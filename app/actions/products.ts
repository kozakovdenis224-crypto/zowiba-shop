"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ProductInput = {
  title: string;
  description: string;
  price: number;
  category: string;
  telegram_link: string;
  visible: boolean;
  image?: string | null;
};

export async function uploadProductImage(formData: FormData) {
  const supabase = await createClient();
  const file = formData.get("file") as File;
  if (!file || file.size === 0) return { url: null, error: "Файл не обрано" };

  const ext = file.name.split(".").pop();
  const path = `products/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from("products").upload(path, file, {
    upsert: true,
  });

  if (error) return { url: null, error: error.message };

  const { data } = supabase.storage.from("products").getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}

export async function createProduct(input: ProductInput) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").insert({
    title: input.title,
    description: input.description,
    price: input.price,
    category: input.category,
    telegram_link: input.telegram_link || null,
    visible: input.visible,
    image: input.image ?? null,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/products");
  return { success: true, error: null };
}

export async function updateProduct(id: string, input: ProductInput) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({
      title: input.title,
      description: input.description,
      price: input.price,
      category: input.category,
      telegram_link: input.telegram_link || null,
      visible: input.visible,
      image: input.image ?? null,
    })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/products");
  return { success: true, error: null };
}

export async function toggleVisibility(id: string, visible: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").update({ visible }).eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/products");
  return { success: true, error: null };
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/products");
  return { success: true, error: null };
}
