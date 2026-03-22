import Link from "next/link";
import { adminLogout } from "@/app/admin/actions";

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-10 border-b border-neutral-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/admin" className="font-medium text-neutral-900">
              Товары
            </Link>
            <Link href="/admin/products/new" className="text-neutral-600 transition-colors hover:text-neutral-900">
              Новый товар
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-neutral-500 transition-colors hover:text-neutral-800">
              Витрина
            </Link>
            <form action={adminLogout}>
              <button
                type="submit"
                className="rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-100"
              >
                Выйти
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
