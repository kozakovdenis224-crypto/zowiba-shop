import type { Product } from "@/lib/types";

export default function ProductCard({
  product,
  telegramHandle,
}: {
  product: Product;
  telegramHandle: string;
}) {
  const message = `Привіт! Хочу купити: ${product.title} із сайту ZOWIBA.SHOP`;
  const buyLink =
    product.telegram_link ||
    `https://t.me/${telegramHandle}?text=${encodeURIComponent(message)}`;

  return (
    <div className="card-hover glass group flex flex-col overflow-hidden rounded-2xl">
      <div className="relative aspect-video w-full overflow-hidden bg-black/40">
        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-600">
            no image
          </div>
        )}
        {product.category && (
          <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-cyan-300 backdrop-blur">
            {product.category}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-lg font-semibold text-white">{product.title}</h3>
        {product.description && (
          <p className="line-clamp-2 flex-1 text-sm text-slate-400">{product.description}</p>
        )}

        <div className="flex items-center justify-between pt-2">
          <span className="text-xl font-bold text-cyan-300">{product.price} ₴</span>
          <a href={buyLink} target="_blank" rel="noopener noreferrer" className="glow-cyan rounded-full bg-cyan-400 px-5 py-2 text-sm font-semibold text-black transition hover:bg-cyan-300">
            Купити
          </a>
        </div>
      </div>
    </div>
  );
}