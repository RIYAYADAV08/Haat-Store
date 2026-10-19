"use client";

export default function Error({ error, reset }) {
  return (
    <div role="alert" className="mx-auto max-w-lg rounded-2xl bg-white p-10 text-center ring-1 ring-mist">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="mt-2 text-ink/70">{error.message || "Please check your connection and try again."}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo"
      >
        Try again
      </button>
    </div>
  );
}
