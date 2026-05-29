import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const [sareeCount, variantCount, salesAgg, purchaseAgg, sarees] = await Promise.all([
    prisma.saree.count(),
    prisma.variantCategory.count(),
    prisma.salesReceipt.aggregate({ _sum: { totalAmount: true }, _count: true }),
    prisma.purchaseReceipt.aggregate({ _sum: { totalAmount: true }, _count: true }),
    prisma.saree.findMany({ include: { variant: true } }),
  ]);

  const totalStock = sarees.reduce((sum, s) => sum + s.stockQuantity, 0);
  const stockValue = sarees.reduce((sum, s) => sum + s.stockQuantity * s.costPrice, 0);
  const lowStock = sarees.filter((s) => s.stockQuantity <= s.lowStockThreshold);

  const recentSales = await prisma.salesReceipt.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { items: { include: { saree: true } } },
  });

  const recentPurchases = await prisma.purchaseReceipt.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { items: { include: { saree: true } } },
  });

  return NextResponse.json({
    sareeCount,
    variantCount,
    totalStock,
    stockValue,
    lowStockCount: lowStock.length,
    lowStockItems: lowStock.slice(0, 8),
    salesTotal: salesAgg._sum.totalAmount ?? 0,
    salesCount: salesAgg._count,
    purchaseTotal: purchaseAgg._sum.totalAmount ?? 0,
    purchaseCount: purchaseAgg._count,
    recentSales,
    recentPurchases,
  });
}
