"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { money } from "@/lib/format";

const FREE_SHIPPING_ABOVE = 50;
const SHIPPING_FEE = 5;

export default function CartPage() {
  const { cart, cartTotal, setQty, removeFromCart, clearCart } = useStore();
  const [ordered, setOrdered] = useState(false);

  const shipping = cartTotal === 0 || cartTotal >= FREE_SHIPPING_ABOVE ? 0 : SHIPPING_FEE;
  const total = cartTotal + shipping;
  const remaining = FREE_SHIPPING_ABOVE - cartTotal;

  function placeOrder() {
    clearCart();
    setOrdered(true);
  }

  if (ordered) {
    return (
      <div role="status" className="mx-auto max-w-lg py-16 text-center">
        <h1 className="text-3xl font-extrabold">Order placed</h1>
        <p className="mt-3 text-ink/70">This is a demo store, so no payment was taken. Thanks for trying it out.</p>
        <Link href="/" className="mt-6 inline-block rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo">
          Keep shopping
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <h1 className="text-3xl font-extrabold">Your cart is empty</h1>
        <p className="mt-3 text-ink/70">Add a few products and they'll show up here.</p>
        <Link href="/" className="mt-6 inline-block rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold">Your cart</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <ul className="space-y-4">
          {cart.map((item) => (
            <li key={item.id} className="flex gap-4 rounded-2xl bg-white p-4 ring-1 ring-mist">
              <Link href={`/products/${item.id}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-mist/50">
                <Image src={item.thumbnail} alt="" fill sizes="96px" className="object-contain p-2" />
              </Link>

              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-3">
                  <Link href={`/products/${item.id}`} className="font-semibold hover:text-indigo">
                    {item.title}
                  </Link>
                  <p className="font-bold">{money(item.price * item.qty)}</p>
                </div>
                <p className="text-sm text-ink/60">{money(item.price)} each</p>

                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center rounded-lg border border-mist">
                    <button type="button" onClick={() => setQty(item.id, item.qty - 1)} aria-label={`Decrease quantity of ${item.title}`} className="h-9 w-9">−</button>
                    <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
                    <button type="button" onClick={() => setQty(item.id, item.qty + 1)} disabled={item.qty >= item.stock} aria-label={`Increase quantity of ${item.title}`} className="h-9 w-9 disabled:opacity-30">+</button>
                  </div>
                  <button type="button" onClick={() => removeFromCart(item.id)} className="text-sm font-medium text-red-600 underline">
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-2xl bg-white p-6 ring-1 ring-mist" aria-labelledby="summary">
          <h2 id="summary" className="text-xl font-bold">Order summary</h2>

          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{money(cartTotal)}</dd></div>
            <div className="flex justify-between"><dt>Shipping</dt><dd>{shipping === 0 ? "Free" : money(shipping)}</dd></div>
            <div className="flex justify-between border-t border-mist pt-3 text-base font-bold"><dt>Total</dt><dd>{money(total)}</dd></div>
          </dl>

          {remaining > 0 && (
            <p className="mt-4 rounded-lg bg-marigold/20 px-3 py-2 text-sm">
              Add {money(remaining)} more for free shipping.
            </p>
          )}

          <button type="button" onClick={placeOrder} className="mt-5 w-full rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-indigo">
            Place demo order
          </button>
          <button type="button" onClick={clearCart} className="mt-3 w-full text-center text-sm text-ink/60 underline">
            Empty cart
          </button>
        </aside>
      </div>
    </div>
  );
}
