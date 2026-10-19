export function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

// Price after discount, rounded to 2 decimals
export function finalPrice(product) {
  const discounted = product.price * (1 - (product.discountPercentage || 0) / 100);
  return Math.round(discounted * 100) / 100;
}

// "mens-shirts" -> "Mens shirts"
export function categoryLabel(slug) {
  const text = slug.replace(/-/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}
