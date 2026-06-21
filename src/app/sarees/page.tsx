import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { prisma } from "@/lib/db";
import { SareeCard } from "@/components/sarees/saree-card";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";

export default async function SareesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; variantId?: string }>;
}) {
  const params = await searchParams;
  const variants = await prisma.variantCategory.findMany({ orderBy: { name: "asc" } });

  const sarees = await prisma.saree.findMany({
    where: {
      ...(params.variantId ? { variantId: params.variantId } : {}),
      ...(params.q
        ? {
            OR: [
              { name: { contains: params.q } },
              { sku: { contains: params.q } },
            ],
          }
        : {}),
    },
    include: { variant: true },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#1a0f0f]">Saree Catalog</h1>
          <p className="mt-1 text-[#6b5a5a]">{sarees.length} styles · Banaras, Silk & Cotton</p>
        </div>
        <Link href="/sarees/new">
          <Button>
            <Plus className="h-4 w-4" />
            Add saree
          </Button>
        </Link>
      </div>

      <Card className="mb-8">
        <CardBody>
          <form className="flex flex-wrap gap-3" method="get">
            <div className="relative min-w-[200px] flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a8a7a]" />
              <input
                name="q"
                defaultValue={params.q}
                placeholder="Search by name or SKU…"
                className="w-full rounded-lg border border-[#e8d5c4] py-2.5 pl-10 pr-3 text-sm focus:border-[#7a1f2e] focus:outline-none focus:ring-2 focus:ring-[#7a1f2e]/20"
              />
            </div>
            <select
              name="variantId"
              defaultValue={params.variantId ?? ""}
              className="rounded-lg border border-[#e8d5c4] px-3 py-2.5 text-sm"
            >
              <option value="">All variants</option>
              {variants.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
            <Button type="submit" variant="outline">
              Filter
            </Button>
          </form>
        </CardBody>
      </Card>

      {sarees.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-300 px-8 py-16 text-center">
          <p className="text-lg font-semibold text-slate-700">No sarees found</p>
          <p className="mt-2 text-sm text-slate-500">Try adjusting your filters or add a new saree to get started.</p>
          <Link href="/sarees/new" className="mt-4 inline-block">
            <Button>
              <Plus className="h-4 w-4" />
              Add first saree
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sarees.map((saree) => (
            <SareeCard key={saree.id} saree={saree} />
          ))}
        </div>
      )}
    </div>
  );
}
