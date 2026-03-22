import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isValidAdminSessionToken } from "@/lib/admin-session";

export async function POST(request: NextRequest) {
  const token = request.cookies.get("admin_session")?.value;
  if (!(await isValidAdminSessionToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file || !file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Нужен файл изображения" }, { status: 400 });
  }

  const blob = await put(`products/${Date.now()}-${file.name}`, file, {
    access: "public",
  });

  return NextResponse.json({ url: blob.url });
}
