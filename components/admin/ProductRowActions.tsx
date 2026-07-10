"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toggleVisibility, deleteProduct } from "@/app/actions/products";
import type { Product } from "@/lib/types";
import { Pencil, Eye, EyeOff, Trash2 } from "lucide-react";

export default function ProductRowActions({ product }: { product: Product }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    await toggleVisibility(product.id, !product.visible);
    setLoading(false);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm(`Видалити товар "${product.title}"?`)) return;
    setLoading(true);
    await deleteProduct(product.id);
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Link
        href={`/admin/products/${product.id}/edit`}
        className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-cyan-300"
        title="Редагувати"
      >
        <Pencil size={16} />
      </Link>
      <button
        onClick={handleToggle}
        disabled={loading}
        className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-cyan-300"
        title={product.visible ? "Приховати" : "Показати"}
      >
        {product.visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-red-400"
        title="Видалити"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
