import Image from "next/image";
import Link from "next/link";
import type { Product } from "@prisma/client";

type Props = {
  product: Pick<Product, "id" | "name" | "category" | "weightGrams" | "rating" | "reviewCount" | "imageUrl">;
};

export function ProductCard({ product }: Props) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="group block overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-[border-color,box-shadow] hover:border-neutral-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
    >
      {product.imageUrl ? (
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      ) : (
        <div className="flex aspect-[4/3] w-full items-center justify-center bg-neutral-50 text-sm text-neutral-300">
          Нет фото
        </div>
      )}
      <div className="p-6">
        {product.category ? (
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">{product.category}</p>
        ) : (
          <p className="text-xs text-neutral-400">Без категории</p>
        )}
        <h2 className="mt-2 text-lg font-semibold tracking-tight text-neutral-900 group-hover:text-neutral-700">
          {product.name}
        </h2>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-600">
          <span>{product.weightGrams} г</span>
          <span aria-hidden>·</span>
          <span>
            ★ {product.rating.toFixed(1)} <span className="text-neutral-400">({product.reviewCount})</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
