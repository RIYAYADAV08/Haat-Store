import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <h1 className="text-4xl font-extrabold">We can't find that page</h1>
      <p className="mt-3 text-ink/70">The product may have been removed, or the link is wrong.</p>
      <Link href="/" className="mt-6 inline-block rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo">
        Back to the shop
      </Link>
    </div>
  );
}
