import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const variants = await prisma.variantCategory.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { sarees: true } } },
  });
  return NextResponse.json(variants);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    const existing = await prisma.variantCategory.findUnique({ where: { name } });
    if (existing) {
      return NextResponse.json({ error: "Variant already exists" }, { status: 409 });
    }
    const variant = await prisma.variantCategory.create({ data: { name } });
    return NextResponse.json(variant, { status: 201 });
  } catch (err: any) {
    console.error("Variant creation error:", err);
    if (err.code === "P2002") {
      return NextResponse.json({ error: "Variant name already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: err?.message || "Unable to create variant" }, { status: 500 });
  }
}
