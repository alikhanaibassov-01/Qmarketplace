"use client";

import { useActionState, useMemo, useState } from "react";
import { createProduct, updateProduct } from "@/app/admin/actions";

type Pair = { key: string; value: string };

export type ProductFormInitial = {
  name: string;
  sku: string;
  weightGrams: number;
  reviewCount: number;
  rating: number;
  reviewsSummary: string;
  category: string;
  imageUrl: string;
  attributePairs: Pair[];
};

type Props =
  | { mode: "create" }
  | { mode: "edit"; productId: string; initial: ProductFormInitial };

export function ProductForm(props: Props) {
  const [pairs, setPairs] = useState<Pair[]>(() =>
    props.mode === "edit"
      ? props.initial.attributePairs.length > 0
        ? props.initial.attributePairs
        : [{ key: "", value: "" }]
      : [{ key: "", value: "" }]
  );

  const [imageUrl, setImageUrl] = useState(
    props.mode === "edit" ? props.initial.imageUrl : ""
  );
  const [uploading, setUploading] = useState(false);

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (data.url) setImageUrl(data.url);
    } finally {
      setUploading(false);
    }
  }

  const productId = props.mode === "edit" ? props.productId : null;
  const formAction = useMemo(() => {
    if (productId) return updateProduct.bind(null, productId);
    return createProduct;
  }, [productId]);

  const [state, submitAction] = useActionState(formAction, undefined);

  function addPair() {
    setPairs((p) => [...p, { key: "", value: "" }]);
  }

  function removePair(index: number) {
    setPairs((p) => p.filter((_, i) => i !== index));
  }

  function setPair(index: number, field: keyof Pair, value: string) {
    setPairs((p) => p.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  }

  const initial = props.mode === "edit" ? props.initial : undefined;

  return (
    <form action={submitAction} className="mx-auto max-w-2xl space-y-8">
      {state?.error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {state.error}
        </p>
      ) : null}

      <input type="hidden" name="imageUrl" value={imageUrl} />

      <section className="space-y-4">
        <h2 className="text-sm font-medium text-neutral-500">Фото товара</h2>
        <div className="flex items-start gap-6">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Превью"
              className="h-32 w-32 rounded-2xl border border-neutral-200 object-cover"
            />
          ) : (
            <div className="flex h-32 w-32 items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 text-xs text-neutral-400">
              Нет фото
            </div>
          )}
          <div className="flex flex-col gap-2">
            <label className="cursor-pointer rounded-full border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-50">
              {uploading ? "Загрузка…" : "Выбрать файл"}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={uploading}
                className="hidden"
              />
            </label>
            {imageUrl ? (
              <button
                type="button"
                onClick={() => setImageUrl("")}
                className="text-left text-xs text-neutral-500 underline-offset-4 hover:underline"
              >
                Удалить фото
              </button>
            ) : null}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-medium text-neutral-500">Основное</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
              Наименование
            </span>
            <input
              name="name"
              required
              defaultValue={initial?.name}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 py-3 text-neutral-900 outline-none transition-shadow focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
              Артикул (SKU)
            </span>
            <input
              name="sku"
              required
              readOnly={props.mode === "edit"}
              defaultValue={initial?.sku}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 py-3 text-neutral-900 outline-none transition-shadow focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200 read-only:cursor-default read-only:bg-neutral-100/60"
            />
            {props.mode === "edit" ? (
              <span className="mt-1 block text-xs text-neutral-400">SKU не меняется после создания</span>
            ) : null}
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
              Вес, г
            </span>
            <input
              name="weightGrams"
              type="number"
              min={1}
              required
              defaultValue={initial?.weightGrams}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 py-3 text-neutral-900 outline-none transition-shadow focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
              Категория (по желанию)
            </span>
            <input
              name="category"
              placeholder="Например: Металлоизделия"
              defaultValue={initial?.category}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 py-3 text-neutral-900 outline-none transition-shadow focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
            />
          </label>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-medium text-neutral-500">Отзывы (витрина)</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
              Количество отзывов
            </span>
            <input
              name="reviewCount"
              type="number"
              min={0}
              required
              defaultValue={initial?.reviewCount ?? 0}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 py-3 text-neutral-900 outline-none transition-shadow focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
              Средняя оценка (1–5)
            </span>
            <input
              name="rating"
              type="number"
              min={1}
              max={5}
              step={0.1}
              required
              defaultValue={initial?.rating ?? 5}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 py-3 text-neutral-900 outline-none transition-shadow focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
              Краткий текст
            </span>
            <textarea
              name="reviewsSummary"
              rows={3}
              defaultValue={initial?.reviewsSummary}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 py-3 text-neutral-900 outline-none transition-shadow focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
            />
          </label>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-sm font-medium text-neutral-500">Доп. характеристики</h2>
          <button
            type="button"
            onClick={addPair}
            className="text-sm font-medium text-neutral-700 underline-offset-4 hover:underline"
          >
            Добавить строку
          </button>
        </div>
        <p className="text-xs text-neutral-400">
          Произвольные пары: например «Тип металла» → «Нержавеющая сталь».
        </p>
        <ul className="space-y-3">
          {pairs.map((row, index) => (
            <li key={index} className="flex flex-col gap-2 sm:flex-row sm:items-end">
              <label className="block flex-1">
                <span className="mb-1 block text-xs text-neutral-500">Ключ</span>
                <input
                  value={row.key}
                  onChange={(e) => setPair(index, "key", e.target.value)}
                  name="attrKey"
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
                />
              </label>
              <label className="block flex-1">
                <span className="mb-1 block text-xs text-neutral-500">Значение</span>
                <input
                  value={row.value}
                  onChange={(e) => setPair(index, "value", e.target.value)}
                  name="attrValue"
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
                />
              </label>
              <button
                type="button"
                onClick={() => removePair(index)}
                className="rounded-xl border border-neutral-200 px-3 py-3 text-sm text-neutral-600 hover:bg-neutral-50 sm:shrink-0"
              >
                Удалить
              </button>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
        >
          {props.mode === "create" ? "Создать товар" : "Сохранить"}
        </button>
      </div>
    </form>
  );
}
