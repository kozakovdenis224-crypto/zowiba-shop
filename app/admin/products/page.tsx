import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";
import Link from "next/link";
import { Plus } from "lucide-react";
import ProductRowActions from "@/components/admin/ProductRowActions";

export const revalidate = 0;

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  const products = (data as Product[]) ?? [];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Товари</h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-cyan-300"
        >
          <Plus size={16} />
          Додати товар
        </Link>
      </div>

      <div className="glass overflow-hidden rounded-2xl">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-4 py-3">Товар</th>
              <th className="px-4 py-3">Ціна</th>
              <th className="px-4 py-3">Категорія</th>
              <th className="px-4 py-3">Видимість</th>
              <th className="px-4 py-3 text-right">Дії</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-white/5">
                <td className="flex items-center gap-3 px-4 py-3">
                  {product.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.image}
                      alt={product.title}
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                  )}
                  <span className="text-white">{product.title}</span>
                </td>
                <td className="px-4 py-3 text-cyan-300">${product.price}</td>
                <td className="px-4 py-3 text-slate-400">{product.category ?? "—"}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      product.visible
                        ? "rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300"
                        : "rounded-full bg-slate-500/10 px-3 py-1 text-xs text-slate-400"
                    }
                  >
                    {product.visible ? "видимий" : "приховано"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <ProductRowActions product={product} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="p-6 text-center text-sm text-slate-500">Товарів ще немає.</p>
        )}
      </div>
    </div>
  );
}
