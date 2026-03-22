import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.product.upsert({
    where: { sku: "DEMO-STEEL-01" },
    create: {
      name: "Кружка из нержавеющей стали",
      sku: "DEMO-STEEL-01",
      weightGrams: 220,
      reviewCount: 12,
      rating: 4.6,
      reviewsSummary: "Удобная ручка, не бьётся. Для учебной витрины.",
      category: "Металлоизделия",
      attributes: {
        metalType: "Нержавеющая сталь",
        volumeMl: "350",
      },
    },
    update: {},
  });

  await prisma.product.upsert({
    where: { sku: "DEMO-HOME-01" },
    create: {
      name: "Доска разделочная бамбук",
      sku: "DEMO-HOME-01",
      weightGrams: 480,
      reviewCount: 3,
      rating: 4.9,
      reviewsSummary: "Лёгкая, приятная на ощупь.",
      category: "Для дома",
      attributes: {
        material: "Бамбук",
        sizeCm: "30×20",
      },
    },
    update: {},
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
