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
  const body = await request.json();
  const name = String(body.name ?? "").trim();
  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  try {
    const variant = await prisma.variantCategory.create({ data: { name } });
    return NextResponse.json(variant, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Variant already exists" }, { status: 409 });
  }
}
