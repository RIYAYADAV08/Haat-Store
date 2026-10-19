import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, getProducts } from "@/lib/api";
import { categoryLabel, finalPrice } from "@/lib/format";
import ProductDetail from "@/components/ProductDetail";
import ProductCard from "@/components/ProductCard";

// SSG: every product page is built ahead of time, so it loads fast and is easy for Google to crawl
export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ id: String(p.id) }));
}

// Unique title, description and social image for every product (SEO)
export async function generateMetadata({ params }) {
  const product = await getProduct(params.id);
  if (!product) return { title: "Product not found" };

  return {
    title: product.title,
    description: product.description.slice(0, 155),
    openGraph: {
      title: product.title,
      description: product.description.slice(0, 155),
      images: [{ url: product.thumbnail }],
    },
  };
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.id);
  if (!product) notFound();

  const all = await getProducts();
  const related = all.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  // Structured data so Google can show price and rating in search results
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.images,
    description: product.description,
    brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviews?.length || 1,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: finalPrice(product),
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-ink/60">
        <Link href="/" className="hover:text-indigo">Shop</Link>
        <span aria-hidden="true"> / </span>
        <span>{categoryLabel(product.category)}</span>
      </nav>

      <ProductDetail product={product} />

      {product.reviews?.length > 0 && (
        <section className="mt-16" aria-labelledby="reviews">
          <h2 id="reviews" className="text-2xl font-bold">Customer reviews</h2>
          <ul className="mt-5 grid gap-4 md:grid-cols-3">
            {product.reviews.map((r, i) => (
              <li key={i} className="rounded-2xl bg-white p-5 ring-1 ring-mist">
                <p className="text-sm font-semibold">
                  <span aria-hidden="true">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                  <span className="sr-only">{r.rating} out of 5</span>
                </p>
                <p className="mt-2 text-ink/80">{r.comment}</p>
                <p className="mt-3 text-sm text-ink/60">{r.reviewerName}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-16" aria-labelledby="related">
          <h2 id="related" className="text-2xl font-bold">More in {categoryLabel(product.category)}</h2>
          <ul className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {related.map((p) => (
              <li key={p.id}><ProductCard product={p} /></li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
