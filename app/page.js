import { Suspense } from "react";
import { getProducts } from "@/lib/api";
import ShopClient from "@/components/ShopClient";

// Server Component: data is fetched on the server and cached (revalidated hourly)
export default async function HomePage() {
  const products = await getProducts();

  return (
    // useSearchParams() in ShopClient needs a Suspense boundary
    <Suspense fallback={null}>
      <ShopClient products={products} />
    </Suspense>
  );
}
