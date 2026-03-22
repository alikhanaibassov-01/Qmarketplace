import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ q?: string }> };

export default async function AdminProductsPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim();

  const products = await prisma.product.findMany({
    where: query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { sku: { contains: query, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Каталог</h1>
          <p className="mt-1 text-sm text-neutral-500">Поиск по названию или артикулу</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
        >
          Добавить товар
        </Link>
      </div>

      <form className="mt-8 flex max-w-md gap-2" method="get">
        <input
          name="q"
          defaultValue={query ?? ""}
          placeholder="Поиск…"
          className="min-w-0 flex-1 rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
        />
        <button
          type="submit"
          className="rounded-full border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
        >
          Найти
        </button>
      </form>

      <div className="mt-10 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-100 bg-neutral-50/80 text-xs font-medium uppercase tracking-wide text-neutral-500">
            <tr>
              <th className="px-4 py-3">Название</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Категория</th>
              <th className="px-4 py-3 text-right">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {products.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-neutral-500">
                  Нет товаров. Создайте первую карточку.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-50/50">
                  <td className="px-4 py-3 font-medium text-neutral-900">{p.name}</td>
                  <td className="px-4 py-3 text-neutral-600">{p.sku}</td>
                  <td className="px-4 py-3 text-neutral-600">{p.category ?? "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="font-medium text-neutral-900 underline-offset-4 hover:underline"
                    >
                      Изменить
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
