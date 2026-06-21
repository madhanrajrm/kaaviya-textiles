import Link from "next/link";
import {
  Package,
  Shirt,
  ShoppingCart,
  Truck,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";
import { SHOP_TAGLINE } from "@/lib/constants";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

async function getDashboard() {
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

  return {
    sareeCount,
    variantCount,
    totalStock,
    stockValue,
    lowStockCount: lowStock.length,
    lowStockItems: lowStock.slice(0, 6),
    salesTotal: salesAgg._sum.totalAmount ?? 0,
    salesCount: salesAgg._count,
    purchaseTotal: purchaseAgg._sum.totalAmount ?? 0,
    purchaseCount: purchaseAgg._count,
    recentSales,
    recentPurchases,
  };
}

export default async function DashboardPage() {
  const data = await getDashboard();

  const stats = [
    {
      label: "Saree styles",
      value: data.sareeCount,
      icon: Shirt,
      href: "/sarees",
      color: "text-[#7a1f2e]",
    },
    {
      label: "Total stock (pcs)",
      value: data.totalStock,
      icon: Package,
      href: "/stock",
      color: "text-[#c9a227]",
    },
    {
      label: "Sales revenue",
      value: formatCurrency(data.salesTotal),
      icon: TrendingUp,
      href: "/sales",
      color: "text-emerald-700",
    },
    {
      label: "Purchases",
      value: formatCurrency(data.purchaseTotal),
      icon: Truck,
      href: "/purchases",
      color: "text-[#6b5a5a]",
    },
  ];

  return (
    <div>
      <header className="mb-12 rounded-3xl bg-gradient-to-br from-sky-600 via-sky-500 to-teal-600 px-8 py-16 text-white sm:px-12 sm:py-24">
        <h1 className="font-serif text-5xl font-extrabold leading-tight sm:text-6xl">
          Kaaviya Textiles
        </h1>
        <p className="mt-4 text-lg text-sky-100">{SHOP_TAGLINE}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/sales/new">
            <Button className="bg-white text-sky-600 hover:bg-slate-100">
              <ShoppingCart className="h-5 w-5" />
              Start a Sale
            </Button>
          </Link>
          <Link href="/sarees">
            <Button variant="outline" className="border-white text-white hover:bg-white/10">
              <Shirt className="h-5 w-5" />
              View Catalog
            </Button>
          </Link>
        </div>
      </header>

          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Link key={stat.label} href={stat.href}>
                  <Card className="transition hover:shadow-2xl">
                    <CardBody className="flex items-center gap-4 !py-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-500">{stat.label}</p>
                        <p className="text-3xl font-extrabold text-slate-900">{stat.value}</p>
                      </div>
                    </CardBody>
                  </Card>
                </Link>
              );
            })}
          </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <Link href="/sales/new">
          <Button>
            <ShoppingCart className="h-4 w-4" />
            New sale
          </Button>
        </Link>
        <Link href="/purchases/new">
          <Button variant="secondary">
            <Truck className="h-4 w-4" />
            New purchase
          </Button>
        </Link>
        <Link href="/sarees/new">
          <Button variant="outline">Add saree</Button>
        </Link>
      </div>

      {data.lowStockCount > 0 && (
        <Card className="mb-8 border-amber-200 bg-amber-50/50">
          <CardHeader
            title="Low stock alert"
            subtitle={`${data.lowStockCount} item(s) need restocking`}
            action={<AlertTriangle className="h-5 w-5 text-amber-600" />}
          />
          <CardBody>
            <ul className="space-y-2">
              {data.lowStockItems.map((s) => (
                <li key={s.id} className="flex items-center justify-between text-sm">
                  <span>{s.name}</span>
                  <Badge variant="warning">
                    {s.stockQuantity} left (min {s.lowStockThreshold})
                  </Badge>
                </li>
              ))}
            </ul>
            <Link href="/stock" className="mt-4 inline-block text-sm font-medium text-[#7a1f2e]">
              Manage stock →
            </Link>
          </CardBody>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Recent sales" subtitle={`${data.salesCount} total`} />
          <CardBody>
            {data.recentSales.length === 0 ? (
              <p className="text-sm text-[#6b5a5a]">No sales yet.</p>
            ) : (
              <ul className="space-y-3">
                {data.recentSales.map((sale) => (
                  <li key={sale.id} className="flex justify-between border-b border-[#f0e6dc] pb-2">
                    <div>
                      <Link href={`/sales/${sale.id}`} className="font-medium text-[#7a1f2e] hover:underline">
                        {sale.receiptNo}
                      </Link>
                      <p className="text-xs text-[#9a8a7a]">{formatDate(sale.createdAt)}</p>
                    </div>
                    <span className="font-semibold">{formatCurrency(sale.totalAmount)}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Recent purchases" subtitle={`${data.purchaseCount} total`} />
          <CardBody>
            {data.recentPurchases.length === 0 ? (
              <p className="text-sm text-[#6b5a5a]">No purchases yet.</p>
            ) : (
              <ul className="space-y-3">
                {data.recentPurchases.map((p) => (
                  <li key={p.id} className="flex justify-between border-b border-[#f0e6dc] pb-2">
                    <div>
                      <Link href={`/purchases/${p.id}`} className="font-medium text-[#7a1f2e] hover:underline">
                        {p.receiptNo}
                      </Link>
                      <p className="text-xs text-[#9a8a7a]">
                        {p.vendorName} · {formatDate(p.createdAt)}
                      </p>
                    </div>
                    <span className="font-semibold">{formatCurrency(p.totalAmount)}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      </div>

      <p className="mt-8 text-center text-xs text-[#9a8a7a]">
        Stock value at cost: {formatCurrency(data.stockValue)} · {data.variantCount} variants
      </p>
    </div>
  );
}
