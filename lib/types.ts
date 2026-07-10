export type Product = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  image: string | null;
  category: string | null;
  telegram_link: string | null;
  visible: boolean;
  created_at: string;
};

export type SiteSettings = {
  id: number;
  shop_name: string;
  logo_url: string | null;
  telegram_url: string;
  hero_title: string | null;
  hero_subtitle: string | null;
  banner_url: string | null;
  contacts: string | null;
  updated_at: string;
};
