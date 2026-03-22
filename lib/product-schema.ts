import { z } from "zod";

const attributePair = z.object({
  key: z.string(),
  value: z.string(),
});

export const productFormSchema = z.object({
  name: z.string().min(1, "Укажите наименование"),
  sku: z.string().min(1, "Укажите артикул"),
  weightGrams: z.coerce.number().int().positive("Вес должен быть положительным числом"),
  reviewCount: z.coerce.number().int().min(0),
  rating: z.coerce.number().min(1).max(5),
  reviewsSummary: z.string().optional(),
  category: z.string().optional(),
  attributePairs: z.array(attributePair).optional(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

export function pairsToAttributes(
  pairs: { key: string; value: string }[] | undefined
): Record<string, string> {
  const out: Record<string, string> = {};
  if (!pairs) return out;
  for (const { key, value } of pairs) {
    const k = key.trim();
    if (!k) continue;
    out[k] = value.trim();
  }
  return out;
}

export function attributesToPairs(attributes: unknown): { key: string; value: string }[] {
  if (!attributes || typeof attributes !== "object" || Array.isArray(attributes)) return [];
  return Object.entries(attributes as Record<string, unknown>).map(([key, value]) => ({
    key,
    value: value == null ? "" : String(value),
  }));
}
