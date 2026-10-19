// DummyJSON: free public API, no key needed. Docs: https://dummyjson.com/docs/products
const BASE = "https://dummyjson.com";

export async function getProducts() {
  const res = await fetch(`${BASE}/products?limit=100`, {
    next: { revalidate: 3600 }, // re-fetch at most once an hour (ISR)
  });
  if (!res.ok) throw new Error("Could not load products. Please try again.");
  const data = await res.json();
  return data.products;
}

export async function getProduct(id) {
  const res = await fetch(`${BASE}/products/${id}`, {
    next: { revalidate: 3600 },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Could not load this product. Please try again.");
  return res.json();
}
