import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { nextReceiptNo } from "@/lib/receipt";

export async function GET() {
  const purchases = await prisma.purchaseReceipt.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: { include: { saree: { include: { variant: true } } } },
    },
  });
  return NextResponse.json(purchases);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { vendorName, vendorPhone, notes, items } = body;

  if (!vendorName || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Vendor and items required" }, { status: 400 });
  }

  const receiptNo = await nextReceiptNo("PUR");
  let totalAmount = 0;

  const lineData: { sareeId: string; quantity: number; unitCost: number; lineTotal: number }[] = [];
  for (const item of items) {
    const saree = await prisma.saree.findUnique({ where: { id: item.sareeId } });
    if (!saree) {
      return NextResponse.json({ error: `Saree not found: ${item.sareeId}` }, { status: 400 });
    }
    const qty = Number(item.quantity);
    const unitCost = Number(item.unitCost ?? saree.costPrice);
    const lineTotal = qty * unitCost;
    totalAmount += lineTotal;
    lineData.push({ sareeId: item.sareeId, quantity: qty, unitCost, lineTotal });
  }

  const purchase = await prisma.$transaction(async (tx) => {
    const created = await tx.purchaseReceipt.create({
      data: {
        receiptNo,
        vendorName: String(vendorName),
        vendorPhone: vendorPhone ? String(vendorPhone) : null,
        notes: notes ? String(notes) : null,
        totalAmount,
        items: { create: lineData },
      },
      include: { items: { include: { saree: { include: { variant: true } } } } },
    });

    for (const line of lineData) {
      await tx.saree.update({
        where: { id: line.sareeId },
        data: { stockQuantity: { increment: line.quantity }, costPrice: line.unitCost },
      });
      await tx.stockMovement.create({
        data: {
          sareeId: line.sareeId,
          type: "PURCHASE",
          quantity: line.quantity,
          reference: created.id,
          notes: `Purchase ${receiptNo}`,
        },
      });
    }

    return created;
  });

  return NextResponse.json(purchase, { status: 201 });
}
