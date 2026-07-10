"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { SiteSettings } from "@/lib/types";

export async function updateSettings(input: Partial<SiteSettings>) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("site_settings")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", 1);

  if (error) return { success: false, error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/settings");
  return { success: true, error: null };
}

export async function uploadSettingsImage(formData: FormData, kind: "logo" | "banner") {
  const supabase = await createClient();
  const file = formData.get("file") as File;
  if (!file || file.size === 0) return { url: null, error: "Файл не обрано" };

  const ext = file.name.split(".").pop();
  const path = `settings/${kind}-${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from("products").upload(path, file, {
    upsert: true,
  });

  if (error) return { url: null, error: error.message };

  const { data } = supabase.storage.from("products").getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}
