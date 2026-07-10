import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

export default function ProductGrid({
  products,
  telegramHandle,
}: {
  products: Product[];
  telegramHandle: string;
}) {
  if (products.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-24 text-center text-slate-500 sm:px-6">
        Товарів поки немає.
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} telegramHandle={telegramHandle} />
        ))}
      </div>
    </section>
  );
}
