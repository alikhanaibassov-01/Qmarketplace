"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { computeAdminSessionToken } from "@/lib/admin-session";
import { pairsToAttributes, productFormSchema } from "@/lib/product-schema";

export async function adminLogin(
  _prev: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const password = String(formData.get("password") ?? "");
  const adminPassword = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!adminPassword || !secret) {
    return { error: "Сервер не настроен: задайте ADMIN_PASSWORD и ADMIN_SESSION_SECRET" };
  }
  if (password !== adminPassword) {
    return { error: "Неверный пароль" };
  }

  const token = await computeAdminSessionToken(secret, password);
  const store = await cookies();
  store.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/admin");
}

export async function adminLogout() {
  const store = await cookies();
  store.delete("admin_session");
  redirect("/admin/login");
}

export async function createProduct(
  _prev: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string } | undefined> {
  const raw = formDataToProductRaw(formData);
  const parsed = productFormSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues.map((i) => i.message).join(", ") };
  }

  const { attributePairs, ...rest } = parsed.data;
  const attributes = pairsToAttributes(attributePairs);

  let product;
  try {
    const imageUrl = String(formData.get("imageUrl") ?? "").trim() || null;
    product = await prisma.product.create({
      data: {
        ...rest,
        imageUrl,
        reviewsSummary: rest.reviewsSummary?.trim() || null,
        category: rest.category?.trim() || null,
        attributes,
      },
    });
  } catch (e) {
    if (isPrismaUniqueError(e)) {
      return { error: "Артикул уже занят — укажите другой SKU" };
    }
    const msg = e instanceof Error ? e.message : "Ошибка сохранения";
    return { error: msg };
  }
  revalidatePath("/");
  revalidatePath("/admin");
  redirect(`/admin/products/${product.id}`);
}

export async function updateProduct(
  id: string,
  _prev: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string } | undefined> {
  const raw = formDataToProductRaw(formData);
  const parsed = productFormSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues.map((i) => i.message).join(", ") };
  }

  const { attributePairs, ...rest } = parsed.data;
  const attributes = pairsToAttributes(attributePairs);

  try {
    const imageUrl = String(formData.get("imageUrl") ?? "").trim() || null;
    await prisma.product.update({
      where: { id },
      data: {
        ...rest,
        imageUrl,
        reviewsSummary: rest.reviewsSummary?.trim() || null,
        category: rest.category?.trim() || null,
        attributes,
      },
    });
  } catch (e) {
    if (isPrismaUniqueError(e)) {
      return { error: "Артикул уже занят — укажите другой SKU" };
    }
    const msg = e instanceof Error ? e.message : "Ошибка сохранения";
    return { error: msg };
  }
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/product/${id}`);
  redirect("/admin");
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

function isPrismaUniqueError(e: unknown): boolean {
  return (
    typeof e === "object" &&
    e !== null &&
    "code" in e &&
    (e as { code: string }).code === "P2002"
  );
}

function formDataToProductRaw(formData: FormData) {
  const keys = formData.getAll("attrKey") as string[];
  const values = formData.getAll("attrValue") as string[];
  const attributePairs = keys.map((key, i) => ({
    key: key ?? "",
    value: String(values[i] ?? ""),
  }));

  return {
    name: String(formData.get("name") ?? ""),
    sku: String(formData.get("sku") ?? ""),
    weightGrams: formData.get("weightGrams"),
    reviewCount: formData.get("reviewCount"),
    rating: formData.get("rating"),
    reviewsSummary: String(formData.get("reviewsSummary") ?? ""),
    category: String(formData.get("category") ?? ""),
    attributePairs,
  };
}
