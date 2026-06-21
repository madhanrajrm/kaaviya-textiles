import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  try {
    const count = await prisma.saree.count({ where: { variantId: id } });
    if (count > 0) {
      return NextResponse.json({ error: "Cannot delete variant with associated sarees" }, { status: 400 });
    }
    await prisma.variantCategory.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Variant delete error:", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
