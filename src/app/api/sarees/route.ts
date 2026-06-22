import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const variantId = searchParams.get("variantId");
  const q = searchParams.get("q");
  const lowStock = searchParams.get("lowStock") === "true";

  const sarees = await prisma.saree.findMany({
    where: {
      ...(variantId ? { variantId } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q } },
              { sku: { contains: q } },
              { color: { contains: q } },
            ],
          }
        : {}),
    },
    include: { variant: true },
    orderBy: { updatedAt: "desc" },
  });

  const filtered = lowStock
    ? sarees.filter((s) => s.stockQuantity <= s.lowStockThreshold)
    : sarees;

  return NextResponse.json(filtered);
}

export async function POST(request: Request) {
  const body = await request.json();
  const {
    sku,
    name,
    description,
    variantId,
    color,
    pattern,
    imageUrl,
    costPrice,
    sellingPrice,
    stockQuantity,
    lowStockThreshold,
    tagCode,
  } = body;

  if (!sku || !name || !variantId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const saree = await prisma.saree.create({
      data: {
        sku: String(sku).trim(),
        name: String(name).trim(),
        description: description ? String(description) : null,
        variantId,
        color: color ? String(color) : null,
        pattern: pattern ? String(pattern) : null,
        imageUrl: imageUrl ? String(imageUrl) : "",
        costPrice: Number(costPrice) || 0,
        sellingPrice: Number(sellingPrice) || 0,
        stockQuantity: Number(stockQuantity) || 0,
        lowStockThreshold: Number(lowStockThreshold) || 5,
        tagCode: tagCode ? String(tagCode) : null,
      },
      include: { variant: true },
    });
    return NextResponse.json(saree, { status: 201 });
 } catch (err: any) {
   console.error("Saree create error:", err);

    if (err.code === "P2002") {
      return NextResponse.json({ error: "SKU already exists" }, { status: 409 });
    }
  
    return NextResponse.json(
      { error: err?.message || "Unable to create saree" },
      { status: 500 }
    );
}
