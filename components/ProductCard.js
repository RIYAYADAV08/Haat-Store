"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { finalPrice, money } from "@/lib/format";

export default function ProductCard({ product, priority = false }) {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const [added, setAdded] = useState(false);

  const saved = wishlist.includes(product.id);
  const price = finalPrice(product);
  const hasDiscount = product.discountPercentage >= 1;
  const outOfStock = product.stock === 0;

  function handleAdd() {
    addToCart({
      id: product.id,
      title: product.title,
      price,
      thumbnail: product.thumbnail,
      stock: product.stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-mist">
      <div className="relative">
        <Link href={`/products/${product.id}`} aria-label={`View ${product.title}`}>
          <div className="relative aspect-square bg-mist/50">
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain p-4"
              priority={priority}
            />
          </div>
        </Link>
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${product.title} from saved` : `Save ${product.title}`}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white text-lg shadow ring-1 ring-mist"
        >
          <span aria-hidden="true" className={saved ? "text-red-500" : "text-ink/40"}>
            {saved ? "♥" : "♡"}
          </span>
        </button>
        {hasDiscount && (
          <span className="absolute left-3 top-3 rounded-full bg-marigold px-2.5 py-1 text-xs font-bold">
            {Math.round(product.discountPercentage)}% off
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 text-base font-semibold leading-snug">
          <Link href={`/products/${product.id}`} className="hover:text-indigo">
            {product.title}
          </Link>
        </h3>
        <p className="text-sm text-ink/60">
          <span aria-hidden="true">★</span> {product.rating.toFixed(1)}
          <span className="sr-only">out of 5 rating</span>
        </p>

        <div className="mt-auto flex items-end justify-between pt-2">
          <p className="flex items-baseline gap-2">
            <span className="text-lg font-bold">{money(price)}</span>
            {hasDiscount && (
              <span className="text-sm text-ink/50 line-through">{money(product.price)}</span>
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={outOfStock}
          className="mt-1 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo disabled:cursor-not-allowed disabled:bg-ink/30"
        >
          {outOfStock ? "Out of stock" : added ? "Added to cart" : "Add to cart"}
        </button>
        <span className="sr-only" aria-live="polite">
          {added ? `${product.title} added to cart` : ""}
        </span>
      </div>
    </article>
  );
}
