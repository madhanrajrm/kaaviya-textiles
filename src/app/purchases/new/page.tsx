import { prisma } from "@/lib/db";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { NewPurchaseForm } from "./new-purchase-form";

export const dynamic = "force-dynamic";

export default async function NewPurchasePage() {
  const sarees = await prisma.saree.findMany({
    include: { variant: true },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl font-bold text-[#1a0f0f]">New purchase receipt</h1>
      <Card>
        <CardHeader title="Purchase details" subtitle="Stock will be added automatically" />
        <CardBody>
          <NewPurchaseForm sarees={sarees} />
        </CardBody>
      </Card>
    </div>
  );
}
