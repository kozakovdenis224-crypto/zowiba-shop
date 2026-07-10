"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct, uploadProductImage } from "@/app/actions/products";
import type { Product } from "@/lib/types";
import { UploadCloud } from "lucide-react";

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [title, setTitle] = useState(product?.title ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [category, setCategory] = useState(product?.category ?? "");
  const [telegramLink, setTelegramLink] = useState(product?.telegram_link ?? "");
  const [visible, setVisible] = useState(product?.visible ?? true);
  const [imageUrl, setImageUrl] = useState(product?.image ?? "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const { url, error } = await uploadProductImage(formData);
    setUploading(false);

    if (error) {
      setError(error);
      return;
    }
    setImageUrl(url ?? "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const input = {
      title,
      description,
      price: parseFloat(price) || 0,
      category,
      telegram_link: telegramLink,
      visible,
      image: imageUrl,
    };

    const result = product
      ? await updateProduct(product.id, input)
      : await createProduct(input);

    setSaving(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="glass max-w-2xl space-y-5 rounded-2xl p-6">
      <div>
        <label className="mb-1 block text-xs text-slate-400">Назва товару</label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400/50"
          placeholder="Наприклад: PC Remote Control"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs text-slate-400">Опис</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400/50"
          placeholder="Короткий опис товару"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-xs text-slate-400">Ціна ($)</label>
          <input
            required
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400/50"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-400">Категорія</label>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400/50"
            placeholder="Telegram-софт"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs text-slate-400">
          Telegram-посилання (необов&apos;язково, інакше автоматичний @zowiba з текстом)
        </label>
        <input
          value={telegramLink}
          onChange={(e) => setTelegramLink(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400/50"
          placeholder="https://t.me/zowiba?text=..."
        />
      </div>

      <div>
        <label className="mb-1 block text-xs text-slate-400">Зображення</label>
        <div className="flex items-center gap-4">
          {imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt="preview" className="h-16 w-16 rounded-lg object-cover" />
          )}
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-300 hover:border-cyan-400/40">
            <UploadCloud size={16} />
            {uploading ? "Завантаження..." : "Завантажити фото"}
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-300">
        <input
          type="checkbox"
          checked={visible}
          onChange={(e) => setVisible(e.target.checked)}
          className="h-4 w-4 rounded border-white/20 bg-black/30 accent-cyan-400"
        />
        Показувати на сайті
      </label>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={saving || uploading}
        className="w-full rounded-lg bg-cyan-400 py-2 text-sm font-semibold text-black transition hover:bg-cyan-300 disabled:opacity-50"
      >
        {saving ? "Збереження..." : "Зберегти"}
      </button>
    </form>
  );
}
