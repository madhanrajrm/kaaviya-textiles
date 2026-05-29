import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";

export default async function SalesPage() {
  const sales = await prisma.salesReceipt.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#1a0f0f]">Sales Receipts</h1>
          <p className="mt-1 text-[#6b5a5a]">{sales.length} transactions</p>
        </div>
        <Link href="/sales/new">
          <Button>
            <Plus className="h-4 w-4" />
            New sale
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader title="All sales" />
        <CardBody className="!p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#f0e6dc] bg-[#faf6f1] text-left text-[#6b5a5a]">
                <th className="px-6 py-3">Receipt</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Items</th>
                <th className="px-6 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale.id} className="border-b border-[#faf6f1] hover:bg-[#fff9f5]">
                  <td className="px-6 py-3">
                    <Link href={`/sales/${sale.id}`} className="font-medium text-[#7a1f2e] hover:underline">
                      {sale.receiptNo}
                    </Link>
                  </td>
                  <td className="px-6 py-3">{sale.customerName ?? "Walk-in"}</td>
                  <td className="px-6 py-3 text-[#6b5a5a]">{formatDate(sale.createdAt)}</td>
                  <td className="px-6 py-3">{sale.items.length}</td>
                  <td className="px-6 py-3 text-right font-semibold">
                    {formatCurrency(sale.totalAmount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {sales.length === 0 && (
            <p className="p-8 text-center text-[#6b5a5a]">No sales yet. Create your first sale.</p>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
