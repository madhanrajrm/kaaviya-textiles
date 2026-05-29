import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StockAdjustForm } from "./stock-adjust-form";

export default async function StockPage() {
  const sarees = await prisma.saree.findMany({
    include: { variant: true },
    orderBy: { stockQuantity: "asc" },
  });

  const totalUnits = sarees.reduce((s, x) => s + x.stockQuantity, 0);
  const totalValue = sarees.reduce((s, x) => s + x.stockQuantity * x.costPrice, 0);

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-[#1a0f0f]">Stock Management</h1>
        <p className="mt-1 text-[#6b5a5a]">
          {totalUnits} pieces · Value at cost: {formatCurrency(totalValue)}
        </p>
      </header>

      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader title="Manual adjustment" subtitle="Add or remove stock without a receipt" />
          <CardBody>
            <StockAdjustForm sarees={sarees} />
          </CardBody>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader title="Inventory levels" subtitle="Sorted by quantity (lowest first)" />
          <CardBody className="!p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#f0e6dc] bg-[#faf6f1] text-left text-[#6b5a5a]">
                    <th className="px-6 py-3">SKU</th>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Variant</th>
                    <th className="px-6 py-3 text-right">Qty</th>
                    <th className="px-6 py-3 text-right">Value</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sarees.map((s) => {
                    const low = s.stockQuantity <= s.lowStockThreshold;
                    return (
                      <tr key={s.id} className="border-b border-[#faf6f1] hover:bg-[#fff9f5]">
                        <td className="px-6 py-3 font-mono text-xs">{s.sku}</td>
                        <td className="px-6 py-3 font-medium">{s.name}</td>
                        <td className="px-6 py-3 text-[#6b5a5a]">{s.variant.name}</td>
                        <td className="px-6 py-3 text-right font-semibold">{s.stockQuantity}</td>
                        <td className="px-6 py-3 text-right">
                          {formatCurrency(s.stockQuantity * s.costPrice)}
                        </td>
                        <td className="px-6 py-3">
                          <Badge variant={low ? "warning" : "success"}>
                            {low ? "Low" : "OK"}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
