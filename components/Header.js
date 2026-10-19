"use client";

import Link from "next/link";
import { useStore } from "@/context/StoreContext";

export default function Header() {
  const { cartCount, wishlist } = useStore();

  return (
    <header className="sticky top-0 z-40 border-b border-mist bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="font-display text-2xl font-extrabold tracking-tight">
          haat<span className="text-indigo">.</span>
        </Link>

        <nav aria-label="Main" className="flex items-center gap-5 text-sm font-medium">
          <Link href="/" className="hover:text-indigo">
            Shop
          </Link>
          <Link href="/?saved=1" className="hover:text-indigo">
            Saved{wishlist.length > 0 && <span className="ml-1 text-ink/60">({wishlist.length})</span>}
          </Link>
          <Link
            href="/cart"
            className="flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-white hover:bg-indigo"
            aria-label={`Cart, ${cartCount} items`}
          >
            Cart
            <span className="min-w-[1.5rem] rounded-full bg-marigold px-1.5 text-center text-xs font-bold text-ink">
              {cartCount}
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
