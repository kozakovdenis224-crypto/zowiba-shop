import { createClient } from "@/lib/supabase/server";
import SettingsForm from "@/components/admin/SettingsForm";
import type { SiteSettings } from "@/lib/types";

export const revalidate = 0;

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).single();

  const settings = (data as SiteSettings) ?? {
    id: 1,
    shop_name: "ZOWIBA.SHOP",
    telegram_url: "https://t.me/zowiba",
    hero_title: "",
    hero_subtitle: "",
    contacts: "",
    logo_url: null,
    banner_url: null,
    updated_at: new Date().toISOString(),
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white">Налаштування сайту</h1>
      <SettingsForm settings={settings} />
    </div>
  );
}
