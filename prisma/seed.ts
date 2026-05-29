import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80",
  "https://images.unsplash.com/photo-1583292655858-0ce006caecbb?w=600&q=80",
  "https://images.unsplash.com/photo-1617627143750-d86bc21e3367?w=600&q=80",
  "https://images.unsplash.com/photo-1594736797933-d0cbc0a02146?w=600&q=80",
  "https://images.unsplash.com/photo-1610039996890-9a6c781bf814?w=600&q=80",
  "https://images.unsplash.com/photo-1583391733981-5c3a0c3e0c0e?w=600&q=80",
  "https://images.unsplash.com/photo-1610030469542-517cdf4f5d47?w=600&q=80",
  "https://images.unsplash.com/photo-1583292655621-0c0e0e0e0e0e?w=600&q=80",
];

const COLORS = ["Maroon", "Royal Blue", "Emerald Green", "Gold", "Peach", "Magenta"];
const PATTERNS = ["Zari Border", "Temple Border", "Floral", "Checks", "Plain", "Butta Work"];

async function main() {
  await prisma.stockMovement.deleteMany();
  await prisma.purchaseLineItem.deleteMany();
  await prisma.salesLineItem.deleteMany();
  await prisma.purchaseReceipt.deleteMany();
  await prisma.salesReceipt.deleteMany();
  await prisma.saree.deleteMany();
  await prisma.variantCategory.deleteMany();

  const variants = await Promise.all(
    ["Banaras", "Silk Saree", "Cotton Sarees"].map((name) =>
      prisma.variantCategory.create({ data: { name } })
    )
  );

  const prices = [300, 400, 500, 1000, 2000];
  let imgIdx = 0;
  let skuCounter = 1;

  for (const variant of variants) {
    for (const price of prices) {
      const color = COLORS[skuCounter % COLORS.length];
      const pattern = PATTERNS[skuCounter % PATTERNS.length];
      const costPrice = Math.round(price * 0.65);
      const stock = 10 + (skuCounter % 15);

      await prisma.saree.create({
        data: {
          sku: `KT-${String(skuCounter).padStart(4, "0")}`,
          name: `${variant.name} — ${color} ${pattern}`,
          description: `Beautiful ${variant.name.toLowerCase()} in ${color} with ${pattern.toLowerCase()}.`,
          variantId: variant.id,
          color,
          pattern,
          imageUrl: SAMPLE_IMAGES[imgIdx % SAMPLE_IMAGES.length],
          costPrice,
          sellingPrice: price,
          stockQuantity: stock,
          lowStockThreshold: 5,
        },
      });

      imgIdx++;
      skuCounter++;
    }
  }

  console.log("Seeded Kaaviya Textiles catalog with sample sarees.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
