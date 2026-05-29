import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { ReceiptPrint } from "@/components/receipts/receipt-print";

export default async function SaleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sale = await prisma.salesReceipt.findUnique({
    where: { id },
    include: { items: { include: { saree: { include: { variant: true } } } } },
  });

  if (!sale) notFound();

  return (
    <div>
      <Link href="/sales" className="mb-6 inline-flex items-center gap-2 text-sm text-[#7a1f2e] hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Back to sales
      </Link>
      <ReceiptPrint type="sale" receipt={sale} />
    </div>
  );
}
