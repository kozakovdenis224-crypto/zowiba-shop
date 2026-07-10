import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus } from "lucide-react";
import type { Product } from "@/lib/types";

export const revalidate = 0;

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [{ count: total }, { count: visibleCount }, { data: recent }] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("products").select("*", { count: "exact", head: true }).eq("visible", true),
    supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const recentProducts = (recent as Product[]) ?? [];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-cyan-300"
        >
          <Plus size={16} />
          Додати товар
        </Link>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="glass rounded-2xl p-6">
          <p className="text-sm text-slate-400">Всього товарів</p>
          <p className="mt-2 text-3xl font-bold text-white">{total ?? 0}</p>
        </div>
        <div className="glass rounded-2xl p-6">
          <p className="text-sm text-slate-400">Видимих на сайті</p>
          <p className="mt-2 text-3xl font-bold text-cyan-300">{visibleCount ?? 0}</p>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="mb-4 text-sm font-semibold text-slate-300">Останні зміни</h2>
        <div className="space-y-2">
          {recentProducts.length === 0 && (
            <p className="text-sm text-slate-500">Ще немає товарів.</p>
          )}
          {recentProducts.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-lg border border-white/5 px-4 py-3 text-sm"
            >
              <span className="text-white">{p.title}</span>
              <span className="text-slate-500">
                {new Date(p.created_at).toLocaleString("uk-UA")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
