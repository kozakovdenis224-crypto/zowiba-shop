import { createClient } from "@/lib/supabase/server";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import type { Product, SiteSettings } from "@/lib/types";

export const revalidate = 0;

function extractTelegramHandle(url: string) {
  try {
    const u = new URL(url);
    return u.pathname.replace("/", "") || "zowiba";
  } catch {
    return "zowiba";
  }
}

export default async function Home() {
  const supabase = await createClient();

  const [{ data: settingsData }, { data: productsData }] = await Promise.all([
    supabase.from("site_settings").select("*").eq("id", 1).single(),
    supabase
      .from("products")
      .select("*")
      .eq("visible", true)
      .order("created_at", { ascending: false }),
  ]);

  const settings = (settingsData as SiteSettings) ?? {
    shop_name: "ZOWIBA.SHOP",
    telegram_url: "https://t.me/zowiba",
    hero_title: "Цифрові товари нового покоління",
    hero_subtitle: "Софт, автоматизація та інструменти — швидко, надійно, без зайвих питань.",
    logo_url: null,
    banner_url: null,
  };

  const products = (productsData as Product[]) ?? [];
  const telegramHandle = extractTelegramHandle(settings.telegram_url);

  return (
    <main>
      <Header
        shopName={settings.shop_name}
        telegramUrl={settings.telegram_url}
        logoUrl={settings.logo_url}
      />
      <Hero
        title={settings.hero_title ?? "ZOWIBA.SHOP"}
        subtitle={settings.hero_subtitle ?? ""}
        bannerUrl={settings.banner_url}
      />
      <ProductGrid products={products} telegramHandle={telegramHandle} />
    </main>
  );
}
