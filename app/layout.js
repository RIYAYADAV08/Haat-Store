import "./globals.css";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import { StoreProvider } from "@/context/StoreContext";
import Header from "@/components/Header";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display" });
const body = Figtree({ subsets: ["latin"], variable: "--font-body" });

export const metadata = {
  title: { default: "Haat | Everyday shopping", template: "%s | Haat" },
  description:
    "Browse 100 products across beauty, groceries, furniture, fashion and more. Search, filter, save favourites and check out.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <StoreProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
          >
            Skip to content
          </a>
          <Header />
          <main id="main" className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6">
            {children}
          </main>
          <footer className="border-t border-mist py-8 text-center text-sm text-ink/60">
            Demo store built with Next.js, Tailwind CSS and the DummyJSON API.
          </footer>
        </StoreProvider>
      </body>
    </html>
  );
}
