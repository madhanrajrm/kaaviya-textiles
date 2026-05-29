import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json();
  const { sareeId, quantity, notes } = body;

  if (!sareeId || quantity === undefined) {
    return NextResponse.json({ error: "sareeId and quantity required" }, { status: 400 });
  }

  const delta = Number(quantity);
  if (delta === 0) {
    return NextResponse.json({ error: "Quantity cannot be zero" }, { status: 400 });
  }

  const saree = await prisma.saree.findUnique({ where: { id: sareeId } });
  if (!saree) return NextResponse.json({ error: "Saree not found" }, { status: 404 });

  const newQty = saree.stockQuantity + delta;
  if (newQty < 0) {
    return NextResponse.json({ error: "Insufficient stock" }, { status: 400 });
  }

  const [updated] = await prisma.$transaction([
    prisma.saree.update({
      where: { id: sareeId },
      data: { stockQuantity: newQty },
      include: { variant: true },
    }),
    prisma.stockMovement.create({
      data: {
        sareeId,
        type: "ADJUSTMENT",
        quantity: delta,
        notes: notes ? String(notes) : null,
      },
    }),
  ]);

  return NextResponse.json(updated);
}
