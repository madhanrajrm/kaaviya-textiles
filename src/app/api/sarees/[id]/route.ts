import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const saree = await prisma.saree.findUnique({
    where: { id },
    include: { variant: true, stockMovements: { orderBy: { createdAt: "desc" }, take: 20 } },
  });
  if (!saree) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(saree);
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json();

  try {
    const saree = await prisma.saree.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: String(body.name) }),
        ...(body.description !== undefined && {
          description: body.description ? String(body.description) : null,
        }),
        ...(body.variantId !== undefined && { variantId: body.variantId }),
        ...(body.color !== undefined && { color: body.color ? String(body.color) : null }),
        ...(body.pattern !== undefined && { pattern: body.pattern ? String(body.pattern) : null }),
        ...(body.imageUrl !== undefined && { imageUrl: String(body.imageUrl) }),
        ...(body.costPrice !== undefined && { costPrice: Number(body.costPrice) }),
        ...(body.sellingPrice !== undefined && { sellingPrice: Number(body.sellingPrice) }),
        ...(body.stockQuantity !== undefined && { stockQuantity: Number(body.stockQuantity) }),
        ...(body.lowStockThreshold !== undefined && {
          lowStockThreshold: Number(body.lowStockThreshold),
        }),
        ...(body.tagCode !== undefined && { tagCode: body.tagCode ? String(body.tagCode) : null }),
      },
      include: { variant: true },
    });
    return NextResponse.json(saree);
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  try {
    await prisma.saree.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Cannot delete — linked to receipts" }, { status: 400 });
  }
}
