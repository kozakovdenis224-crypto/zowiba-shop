"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LayoutDashboard, Package, Settings, LogOut } from "lucide-react";
import clsx from "clsx";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Товари", icon: Package },
  { href: "/admin/settings", label: "Налаштування", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="glass flex h-dvh w-60 shrink-0 flex-col justify-between p-4">
      <div>
        <div className="mb-8 px-2 text-lg font-bold text-white">
          ZOWIBA<span className="text-cyan-400">.admin</span>
        </div>
        <nav className="space-y-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
                  active
                    ? "bg-cyan-400/10 text-cyan-300"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:bg-white/5 hover:text-red-400"
      >
        <LogOut size={16} />
        Вийти
      </button>
    </aside>
  );
}
