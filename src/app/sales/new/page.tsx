import { prisma } from "@/lib/db";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { NewSaleForm } from "./new-sale-form";

export const dynamic = "force-dynamic";

export default async function NewSalePage() {
  const sarees = await prisma.saree.findMany({
    where: { stockQuantity: { gt: 0 } },
    include: { variant: true },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl font-bold text-[#1a0f0f]">New sales receipt</h1>
      <Card>
        <CardHeader title="Sale details" subtitle="Stock will be deducted automatically" />
        <CardBody>
          <NewSaleForm sarees={sarees} />
        </CardBody>
      </Card>
    </div>
  );
}
