import { NextResponse } from "next/server";
import fs from "fs";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const variants = await prisma.variantCategory.findMany();

    return NextResponse.json({
      ok: true,
      databaseUrl: process.env.DATABASE_URL,
      tmpDbExists: fs.existsSync("/tmp/dev.db"),
      variantCount: variants.length,
    });
  } catch (error: any) {
    console.error("debug-db failed:", error);

    return NextResponse.json(
      {
        ok: false,
        message: error?.message,
        databaseUrl: process.env.DATABASE_URL,
        tmpDbExists: fs.existsSync("/tmp/dev.db"),
      },
      { status: 500 }
    );
  }
}
