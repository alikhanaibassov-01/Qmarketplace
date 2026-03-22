import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { attributesToPairs } from "@/lib/product-schema";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  const pairs = attributesToPairs(product.attributes);

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-b border-neutral-200/80">
        <div className="mx-auto max-w-3xl px-6 py-8">
          <Link href="/" className="text-sm text-neutral-500 transition-colors hover:text-neutral-800">
            ← К каталогу
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        {product.imageUrl ? (
          <div className="relative mb-10 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-neutral-100">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        ) : null}
        {product.category?.trim() ? (
          <p className="text-xs font-medium uppercase tracking-widest text-neutral-400">{product.category}</p>
        ) : null}
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-900">{product.name}</h1>
        <p className="mt-2 text-sm text-neutral-500">Артикул {product.sku}</p>

        <dl className="mt-10 grid gap-6 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-neutral-400">Вес</dt>
            <dd className="mt-1 text-lg text-neutral-900">{product.weightGrams} г</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-neutral-400">Оценка</dt>
            <dd className="mt-1 text-lg text-neutral-900">
              ★ {product.rating.toFixed(1)}{" "}
              <span className="text-sm text-neutral-500">({product.reviewCount} отзывов)</span>
            </dd>
          </div>
        </dl>

        {product.reviewsSummary ? (
          <section className="mt-10">
            <h2 className="text-xs font-medium uppercase tracking-wide text-neutral-400">О отзывах</h2>
            <p className="mt-2 text-neutral-700 leading-relaxed">{product.reviewsSummary}</p>
          </section>
        ) : null}

        {pairs.length > 0 ? (
          <section className="mt-10">
            <h2 className="text-xs font-medium uppercase tracking-wide text-neutral-400">Характеристики</h2>
            <dl className="mt-4 divide-y divide-neutral-100 rounded-2xl border border-neutral-200">
              {pairs.map(({ key, value }) => (
                <div key={key} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:justify-between">
                  <dt className="text-sm text-neutral-500">{key}</dt>
                  <dd className="text-sm font-medium text-neutral-900">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}
      </main>

      <SiteFooter />
    </div>
  );
}
