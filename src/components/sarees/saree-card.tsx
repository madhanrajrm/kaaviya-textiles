import Image from "next/image";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import type { Saree } from "@/types";

export function SareeCard({ saree }: { saree: Saree }) {
  const low = saree.stockQuantity <= saree.lowStockThreshold;

  return (
    <div className="group overflow-hidden rounded-2xl border border-[#e8d5c4]/80 bg-white shadow-sm transition hover:shadow-lg hover:shadow-[#7a1f2e]/10">
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f5ebe0]">
        <Image
          src={saree.imageUrl}
          alt={saree.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 25vw"
        />
        <div className="absolute left-3 top-3">
          <Badge variant={low ? "danger" : "success"}>
            {saree.stockQuantity} in stock
          </Badge>
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-[#7a1f2e]">
          {saree.variant.name}
        </p>
        <h3 className="mt-1 font-serif text-lg font-semibold text-[#1a0f0f] line-clamp-2">
          {saree.name}
        </h3>
        <p className="mt-1 text-xs text-[#6b5a5a]">SKU: {saree.sku}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-[#7a1f2e]">
            {formatCurrency(saree.sellingPrice)}
          </span>
          <Link href={`/sarees/${saree.id}/edit`}>
            <Button variant="outline" className="!px-3 !py-2">
              <Pencil className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
