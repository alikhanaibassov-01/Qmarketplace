"use client";

import Link from "next/link";
import { useActionState } from "react";
import { adminLogin } from "@/app/admin/actions";

export function AdminLoginForm() {
  const [state, formAction] = useActionState(adminLogin, {});

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="text-center text-xs font-medium uppercase tracking-widest text-neutral-400">Админка</p>
        <h1 className="mt-2 text-center text-2xl font-semibold tracking-tight">Вход</h1>
        <form action={formAction} className="mt-8 space-y-4">
          {state?.error ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
              {state.error}
            </p>
          ) : null}
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-neutral-500">Пароль</span>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-full bg-neutral-900 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
          >
            Войти
          </button>
        </form>
        <p className="mt-8 text-center text-sm text-neutral-500">
          <Link href="/" className="underline-offset-4 hover:underline">
            На витрину
          </Link>
        </p>
      </div>
    </div>
  );
}
