"use client";

import Image from "next/image";
import { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { finalPrice, money } from "@/lib/format";

export default function ProductDetail({ product }) {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const images = product.images?.length ? product.images : [product.thumbnail];
  const price = finalPrice(product);
  const hasDiscount = product.discountPercentage >= 1;
  const outOfStock = product.stock === 0;
  const saved = wishlist.includes(product.id);

  function handleAdd() {
    addToCart(
      { id: product.id, title: product.title, price, thumbnail: product.thumbnail, stock: product.stock },
      qty
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="grid gap-10 md:grid-cols-2">
      <div>
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-white ring-1 ring-mist">
          <Image
            src={images[active]}
            alt={`${product.title}, image ${active + 1} of ${images.length}`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain p-6"
            priority
          />
        </div>
        {images.length > 1 && (
          <ul className="mt-3 flex gap-3 overflow-x-auto" aria-label="Product images">
            {images.map((src, i) => (
              <li key={src}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Show image ${i + 1}`}
                  aria-current={i === active}
                  className={`relative block h-20 w-20 overflow-hidden rounded-xl bg-white ring-2 ${
                    i === active ? "ring-indigo" : "ring-mist"
                  }`}
                >
                  <Image src={src} alt="" fill sizes="80px" className="object-contain p-1" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h1 className="text-3xl font-extrabold sm:text-4xl">{product.title}</h1>
        {product.brand && <p className="mt-1 text-ink/60">by {product.brand}</p>}

        <p className="mt-3 text-sm text-ink/70">
          <span aria-hidden="true">★</span> {product.rating.toFixed(1)} · {product.reviews?.length || 0} reviews
        </p>

        <p className="mt-5 flex items-baseline gap-3">
          <span className="text-3xl font-bold">{money(price)}</span>
          {hasDiscount && (
            <>
              <span className="text-lg text-ink/50 line-through">{money(product.price)}</span>
              <span className="rounded-full bg-marigold px-2.5 py-1 text-xs font-bold">
                {Math.round(product.discountPercentage)}% off
              </span>
            </>
          )}
        </p>

        <p className="mt-5 max-w-prose leading-relaxed text-ink/80">{product.description}</p>

        <p className={`mt-4 text-sm font-medium ${outOfStock ? "text-red-600" : product.stock < 10 ? "text-amber-700" : "text-emerald-700"}`}>
          {outOfStock ? "Out of stock" : product.stock < 10 ? `Only ${product.stock} left` : "In stock"}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded-xl border border-mist bg-white">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
              className="h-11 w-11 text-lg"
            >
              −
            </button>
            <span className="w-8 text-center font-semibold" aria-live="polite">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(product.stock || 1, q + 1))}
              aria-label="Increase quantity"
              className="h-11 w-11 text-lg"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={outOfStock}
            className="h-11 rounded-xl bg-ink px-6 text-sm font-semibold text-white hover:bg-indigo disabled:cursor-not-allowed disabled:bg-ink/30"
          >
            {added ? "Added to cart" : "Add to cart"}
          </button>

          <button
            type="button"
            onClick={() => toggleWishlist(product.id)}
            aria-pressed={saved}
            className="h-11 rounded-xl border border-ink px-5 text-sm font-semibold hover:bg-ink hover:text-white"
          >
            {saved ? "Saved" : "Save for later"}
          </button>
        </div>

        <dl className="mt-8 grid max-w-md grid-cols-2 gap-y-2 border-t border-mist pt-5 text-sm">
          {product.shippingInformation && (<><dt className="text-ink/60">Shipping</dt><dd>{product.shippingInformation}</dd></>)}
          {product.warrantyInformation && (<><dt className="text-ink/60">Warranty</dt><dd>{product.warrantyInformation}</dd></>)}
          {product.returnPolicy && (<><dt className="text-ink/60">Returns</dt><dd>{product.returnPolicy}</dd></>)}
        </dl>
      </div>
    </div>
  );
}
