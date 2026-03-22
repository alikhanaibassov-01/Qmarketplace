import Link from "next/link";
import type { Product } from "@prisma/client";

type Props = { product: Pick<Product, "id" | "name" | "category" | "weightGrams" | "rating" | "reviewCount"> };

export function ProductCard({ product }: Props) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="group block rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-[border-color,box-shadow] hover:border-neutral-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
    >
      {product.category ? (
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">{product.category}</p>
      ) : (
        <p className="text-xs text-neutral-400">Без категории</p>
      )}
      <h2 className="mt-3 text-lg font-semibold tracking-tight text-neutral-900 group-hover:text-neutral-700">
        {product.name}
      </h2>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-600">
        <span>{product.weightGrams} г</span>
        <span aria-hidden>·</span>
        <span>
          ★ {product.rating.toFixed(1)} <span className="text-neutral-400">({product.reviewCount})</span>
        </span>
      </div>
    </Link>
  );
}
