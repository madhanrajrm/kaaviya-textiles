import { prisma } from "@/lib/db";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { SareeForm } from "@/components/sarees/saree-form";

export default async function NewSareePage() {
  const variants = await prisma.variantCategory.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl font-bold text-[#1a0f0f]">Add new saree</h1>
      <Card>
        <CardHeader title="Saree details" subtitle="Create a new catalog entry" />
        <CardBody>
          <SareeForm variants={variants} />
        </CardBody>
      </Card>
    </div>
  );
}
