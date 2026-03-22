import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Витрина — учебный маркетплейс",
  description: "Каталог товаров для стажёрской практики",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white text-neutral-900">{children}</body>
    </html>
  );
}
