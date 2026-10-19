"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { useStore } from "@/context/StoreContext";
import { categoryLabel, finalPrice } from "@/lib/format";

const PAGE_SIZE = 12;

const SORTS = {
  featured: { label: "Featured", fn: null },
  "price-asc": { label: "Price: low to high", fn: (a, b) => finalPrice(a) - finalPrice(b) },
  "price-desc": { label: "Price: high to low", fn: (a, b) => finalPrice(b) - finalPrice(a) },
  rating: { label: "Top rated", fn: (a, b) => b.rating - a.rating },
};

export default function ShopClient({ products }) {
  const searchParams = useSearchParams();
  const { wishlist } = useStore();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("featured");
  const [savedOnly, setSavedOnly] = useState(searchParams.get("saved") === "1");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category))].sort(),
    [products]
  );

  // Filtering + sorting is derived from state, so we compute it instead of storing it
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (savedOnly && !wishlist.includes(p.id)) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.brand || "").toLowerCase().includes(q)
      );
    });
    const sorter = SORTS[sort].fn;
    if (sorter) list = [...list].sort(sorter);
    return list;
  }, [products, query, category, sort, savedOnly, wishlist]);

  const shown = results.slice(0, visible);
  const filtersActive = query || category !== "all" || savedOnly || sort !== "featured";

  function reset() {
    setQuery("");
    setCategory("all");
    setSort("featured");
    setSavedOnly(false);
    setVisible(PAGE_SIZE);
  }

  // Any filter change should start again from the first page
  const onChange = (setter) => (e) => {
    setter(e.target.value);
    setVisible(PAGE_SIZE);
  };

  const field =
    "w-full rounded-xl border border-mist bg-white px-3 py-2.5 text-sm";

  return (
    <div>
      <section className="mb-8 max-w-2xl">
        <h1 className="text-4xl font-extrabold sm:text-5xl">Everything for the week, in one place.</h1>
        <p className="mt-3 text-lg text-ink/70">
          {products.length} products across {categories.length} categories. Search, filter and
          save what you like.
        </p>
      </section>

      <form
        role="search"
        onSubmit={(e) => e.preventDefault()}
        className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_auto]"
      >
        <div>
          <label htmlFor="q" className="sr-only">Search products</label>
          <input
            id="q"
            type="search"
            value={query}
            onChange={onChange(setQuery)}
            placeholder="Search by name, brand or category"
            className={field}
          />
        </div>
        <div>
          <label htmlFor="cat" className="sr-only">Category</label>
          <select id="cat" value={category} onChange={onChange(setCategory)} className={field}>
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{categoryLabel(c)}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="sort" className="sr-only">Sort by</label>
          <select id="sort" value={sort} onChange={onChange(setSort)} className={field}>
            {Object.entries(SORTS).map(([key, s]) => (
              <option key={key} value={key}>{s.label}</option>
            ))}
          </select>
        </div>
        <label className="flex items-center gap-2 rounded-xl border border-mist bg-white px-3 py-2.5 text-sm">
          <input
            type="checkbox"
            checked={savedOnly}
            onChange={(e) => {
              setSavedOnly(e.target.checked);
              setVisible(PAGE_SIZE);
            }}
          />
          Saved only
        </label>
      </form>

      <div className="mb-4 flex items-center justify-between text-sm text-ink/70">
        <p aria-live="polite">
          Showing {shown.length} of {results.length} products
        </p>
        {filtersActive && (
          <button type="button" onClick={reset} className="font-semibold text-indigo underline">
            Clear filters
          </button>
        )}
      </div>

      {results.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center ring-1 ring-mist">
          <p className="text-lg font-semibold">No products match your filters.</p>
          <p className="mt-1 text-ink/70">Try a different word, or clear the filters.</p>
          <button
            type="button"
            onClick={reset}
            className="mt-5 rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {shown.map((p, i) => (
            <li key={p.id}>
              <ProductCard product={p} priority={i < 4} />
            </li>
          ))}
        </ul>
      )}

      {shown.length < results.length && (
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="rounded-xl border border-ink px-6 py-3 text-sm font-semibold hover:bg-ink hover:text-white"
          >
            Show more products
          </button>
        </div>
      )}
    </div>
  );
}
