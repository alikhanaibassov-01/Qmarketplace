import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-neutral-200/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-10 text-sm text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
        <p>Учебная витрина · без оплаты и доставки</p>
        <Link
          href="/admin/login"
          className="text-neutral-400 transition-colors hover:text-neutral-700"
        >
          Админка
        </Link>
      </div>
    </footer>
  );
}
