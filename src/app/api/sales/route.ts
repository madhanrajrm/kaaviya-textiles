import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { nextReceiptNo } from "@/lib/receipt";

export async function GET() {
  const sales = await prisma.salesReceipt.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: { include: { saree: { include: { variant: true } } } },
    },
  });
  return NextResponse.json(sales);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { customerName, customerPhone, notes, discount, items } = body;

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Items required" }, { status: 400 });
  }

  const receiptNo = await nextReceiptNo("SAL");
  let totalAmount = 0;
  const lineData: { sareeId: string; quantity: number; unitPrice: number; lineTotal: number }[] = [];

  for (const item of items) {
    const saree = await prisma.saree.findUnique({ where: { id: item.sareeId } });
    if (!saree) {
      return NextResponse.json({ error: `Saree not found: ${item.sareeId}` }, { status: 400 });
    }
    const qty = Number(item.quantity);
    if (qty > saree.stockQuantity) {
      return NextResponse.json(
        { error: `Insufficient stock for ${saree.name} (have ${saree.stockQuantity})` },
        { status: 400 }
      );
    }
    const unitPrice = Number(item.unitPrice ?? saree.sellingPrice);
    const lineTotal = qty * unitPrice;
    totalAmount += lineTotal;
    lineData.push({ sareeId: item.sareeId, quantity: qty, unitPrice, lineTotal });
  }

  const discountAmt = Number(discount) || 0;
  totalAmount = Math.max(0, totalAmount - discountAmt);

  const sale = await prisma.$transaction(async (tx) => {
    const created = await tx.salesReceipt.create({
      data: {
        receiptNo,
        customerName: customerName ? String(customerName) : null,
        customerPhone: customerPhone ? String(customerPhone) : null,
        notes: notes ? String(notes) : null,
        discount: discountAmt,
        totalAmount,
        items: { create: lineData },
      },
      include: { items: { include: { saree: { include: { variant: true } } } } },
    });

    for (const line of lineData) {
      await tx.saree.update({
        where: { id: line.sareeId },
        data: { stockQuantity: { decrement: line.quantity } },
      });
      await tx.stockMovement.create({
        data: {
          sareeId: line.sareeId,
          type: "SALE",
          quantity: -line.quantity,
          reference: created.id,
          notes: `Sale ${receiptNo}`,
        },
      });
    }

    return created;
  });

  return NextResponse.json(sale, { status: 201 });
}
