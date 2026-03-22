import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ category?: string }> };

export default async function HomePage({ searchParams }: Props) {
  const { category: categoryFilter } = await searchParams;
  const category = categoryFilter?.trim() || undefined;

  const categoriesRaw = await prisma.product.findMany({
    where: { category: { not: null } },
    select: { category: true },
    distinct: ["category"],
    orderBy: { category: "asc" },
  });
  const categories = categoriesRaw.map((c) => c.category).filter(Boolean) as string[];

  const products = await prisma.product.findMany({
    where: category ? { category } : undefined,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-b border-neutral-200/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400">Витрина</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">Товары</h1>
            <p className="mt-3 max-w-xl text-lg text-neutral-500">
              Каталог для практики. Без корзины и оплаты — только карточки.
            </p>
          </div>
          <form className="flex flex-wrap items-center gap-2" method="get">
            <label className="sr-only" htmlFor="category">
              Категория
            </label>
            <select
              id="category"
              name="category"
              defaultValue={category ?? ""}
              className="rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-800 outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
            >
              <option value="">Все категории</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-full bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
            >
              Показать
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-14">
        {products.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 py-24 text-center">
            <p className="text-neutral-500">Пока нет товаров.</p>
            <p className="mt-2 text-sm text-neutral-400">
              Добавьте карточки в{" "}
              <Link href="/admin/login" className="text-neutral-700 underline-offset-4 hover:underline">
                админке
              </Link>
              .
            </p>
          </div>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
