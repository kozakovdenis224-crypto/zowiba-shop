import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZOWIBA.SHOP — цифрові товари",
  description: "Магазин цифрових товарів: софт, парсери, автоматизація.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body className="antialiased">{children}</body>
    </html>
  );
}
