import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteProduct } from "@/app/admin/actions";
import { ProductForm } from "@/components/admin/product-form";
import { attributesToPairs } from "@/lib/product-schema";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  const attributePairs = attributesToPairs(product.attributes);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Редактирование</h1>
          <p className="mt-1 text-sm text-neutral-500">{product.sku}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/product/${product.id}`}
            className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
          >
            Как на витрине
          </Link>
          <form action={deleteProduct.bind(null, product.id)}>
            <button
              type="submit"
              className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-100"
            >
              Удалить
            </button>
          </form>
        </div>
      </div>
      <div className="mt-10">
        <ProductForm
          mode="edit"
          productId={product.id}
          initial={{
            name: product.name,
            sku: product.sku,
            weightGrams: product.weightGrams,
            reviewCount: product.reviewCount,
            rating: product.rating,
            reviewsSummary: product.reviewsSummary ?? "",
            category: product.category ?? "",
            attributePairs,
          }}
        />
      </div>
    </div>
  );
}
