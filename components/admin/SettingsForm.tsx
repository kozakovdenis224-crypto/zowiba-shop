"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateSettings, uploadSettingsImage } from "@/app/actions/settings";
import type { SiteSettings } from "@/lib/types";
import { UploadCloud } from "lucide-react";

export default function SettingsForm({ settings }: { settings: SiteSettings }) {
  const router = useRouter();
  const [shopName, setShopName] = useState(settings.shop_name ?? "");
  const [telegramUrl, setTelegramUrl] = useState(settings.telegram_url ?? "");
  const [heroTitle, setHeroTitle] = useState(settings.hero_title ?? "");
  const [heroSubtitle, setHeroSubtitle] = useState(settings.hero_subtitle ?? "");
  const [contacts, setContacts] = useState(settings.contacts ?? "");
  const [logoUrl, setLogoUrl] = useState(settings.logo_url ?? "");
  const [bannerUrl, setBannerUrl] = useState(settings.banner_url ?? "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<"logo" | "banner" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>, kind: "logo" | "banner") {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(kind);
    const formData = new FormData();
    formData.append("file", file);
    const { url, error } = await uploadSettingsImage(formData, kind);
    setUploading(null);

    if (error) {
      setError(error);
      return;
    }
    if (kind === "logo") setLogoUrl(url ?? "");
    else setBannerUrl(url ?? "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const result = await updateSettings({
      shop_name: shopName,
      telegram_url: telegramUrl,
      hero_title: heroTitle,
      hero_subtitle: heroSubtitle,
      contacts,
      logo_url: logoUrl,
      banner_url: bannerUrl,
    });

    setSaving(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="glass max-w-2xl space-y-5 rounded-2xl p-6">
      <div>
        <label className="mb-1 block text-xs text-slate-400">Назва магазину</label>
        <input
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400/50"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs text-slate-400">Telegram (посилання в шапці)</label>
        <input
          value={telegramUrl}
          onChange={(e) => setTelegramUrl(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400/50"
          placeholder="https://t.me/zowiba"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs text-slate-400">Заголовок Hero</label>
        <input
          value={heroTitle}
          onChange={(e) => setHeroTitle(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400/50"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs text-slate-400">Підзаголовок Hero</label>
        <textarea
          value={heroSubtitle}
          onChange={(e) => setHeroSubtitle(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400/50"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs text-slate-400">Контакти (необов&apos;язково)</label>
        <input
          value={contacts}
          onChange={(e) => setContacts(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400/50"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-xs text-slate-400">Логотип</label>
          <div className="flex items-center gap-3">
            {logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="logo" className="h-10 w-10 rounded-lg object-cover" />
            )}
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs text-slate-300 hover:border-cyan-400/40">
              <UploadCloud size={14} />
              {uploading === "logo" ? "..." : "Завантажити"}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleUpload(e, "logo")}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs text-slate-400">Банер Hero</label>
          <div className="flex items-center gap-3">
            {bannerUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={bannerUrl} alt="banner" className="h-10 w-10 rounded-lg object-cover" />
            )}
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs text-slate-300 hover:border-cyan-400/40">
              <UploadCloud size={14} />
              {uploading === "banner" ? "..." : "Завантажити"}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleUpload(e, "banner")}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-lg bg-cyan-400 py-2 text-sm font-semibold text-black transition hover:bg-cyan-300 disabled:opacity-50"
      >
        {saving ? "Збереження..." : "Зберегти налаштування"}
      </button>
    </form>
  );
}
