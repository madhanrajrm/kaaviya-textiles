import { prisma } from "@/lib/db";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { VariantForm } from "@/components/variants/variant-form";

export default async function VariantsPage() {
  const variants = await prisma.variantCategory.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#1a0f0f]">Variants</h1>
          <p className="mt-1 text-[#6b5a5a]">Manage your saree variant categories used in the catalog.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader title="Variant categories" subtitle={`${variants.length} total`} />
          <CardBody>
            {variants.length === 0 ? (
              <p className="text-sm text-[#6b5a5a]">No variants have been created yet.</p>
            ) : (
              <ul className="space-y-2">
                {variants.map((variant) => (
                  <li key={variant.id} className="rounded-xl border border-[#e8d5c4] bg-white px-4 py-3 text-sm text-[#1a0f0f]">
                    {variant.name}
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Add variant" subtitle="Create a new variant category" />
          <CardBody>
            <VariantForm />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
