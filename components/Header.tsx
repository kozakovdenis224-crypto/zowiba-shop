import Link from "next/link";
import { Send } from "lucide-react";

export default function Header({
  shopName,
  telegramUrl,
  logoUrl,
}: {
  shopName: string;
  telegramUrl: string;
  logoUrl?: string | null;
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#05070d]/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight sm:text-xl">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={shopName} className="h-8 w-8 rounded-lg object-cover" />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-400">
              Z
            </span>
          )}
          <span className="text-white">
            {shopName.split(".")[0]}
            <span className="text-cyan-400">.{shopName.split(".")[1] ?? "shop"}</span>
          </span>
        </Link>

        <a
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="glow-cyan flex items-center gap-2 rounded-full bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300 transition hover:bg-cyan-400/20 hover:text-cyan-200"
        >
          <Send size={16} />
          <span className="hidden sm:inline">Telegram</span>
        </a>
      </div>
    </header>
  );
}
