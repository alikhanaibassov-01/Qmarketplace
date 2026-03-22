import { ProductForm } from "@/components/admin/product-form";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Новый товар</h1>
      <p className="mt-1 text-sm text-neutral-500">Заполните поля и при необходимости добавьте характеристики.</p>
      <div className="mt-10">
        <ProductForm mode="create" />
      </div>
    </div>
  );
}
