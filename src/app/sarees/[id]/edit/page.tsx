import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { SareeForm } from "@/components/sarees/saree-form";
import { DeleteSareeButton } from "./delete-button";

export default async function EditSareePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [saree, variants] = await Promise.all([
    prisma.saree.findUnique({ where: { id }, include: { variant: true } }),
    prisma.variantCategory.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!saree) notFound();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold text-[#1a0f0f]">Edit saree</h1>
        <DeleteSareeButton id={saree.id} name={saree.name} />
      </div>
      <Card>
        <CardHeader title={saree.name} subtitle={`SKU: ${saree.sku}`} />
        <CardBody>
          <SareeForm variants={variants} initial={saree} />
        </CardBody>
      </Card>
    </div>
  );
}
