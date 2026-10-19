# Haat: E-commerce Store

A fast, responsive and accessible online store built with **Next.js (App Router)**, **React** and **Tailwind CSS**. Product data comes from the free [DummyJSON](https://dummyjson.com) API.

**Live demo:** [haat-store-v461.vercel.app](https://haat-store-v461.vercel.app)
**Source code:** [github.com/RIYAYADAV08/Haat-Store](https://github.com/RIYAYADAV08/Haat-Store)

![Home page](./screenshots/home.png)

## Features

- Browse 100 products with **search**, **category filter**, **sorting** and "show more" pagination
- **Product pages** with image gallery, quantity picker, stock status, reviews and related products
- **Cart** with add, change quantity, remove and a free-shipping progress message
- **Wishlist** to save products and filter by "Saved only"
- Cart and wishlist are **saved in the browser** (localStorage), so they survive a refresh
- **Loading skeletons**, error page with retry, custom 404 page and empty states
- **SEO:** pre-built product pages (SSG), unique title and description per product, Open Graph tags and JSON-LD product data
- **Accessibility:** labelled inputs, keyboard focus styles, skip link, screen-reader announcements and reduced-motion support
- Responsive from small phones to large desktops

## Tech stack

| Area | Tools |
| --- | --- |
| Framework | Next.js 14 (App Router), React 18 |
| Styling | Tailwind CSS |
| State | Context API + `useReducer` |
| Data | DummyJSON REST API, server-side caching (revalidates hourly) |
| Deployment | Vercel |

## Getting started

You need [Node.js](https://nodejs.org) 18.17 or newer.

```bash
# 1. Clone the repository
git clone https://github.com/RIYAYADAV08/Haat-Store.git
cd Haat-Store

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

To test a production build:

```bash
npm run build
npm run start
```

## Project structure

```
app/
  layout.js               Fonts, header, footer, global provider
  page.js                 Home page (server component, fetches products)
  loading.js              Skeleton shown while loading
  error.js                Error page with retry button
  not-found.js            Custom 404
  products/[id]/page.js   Product page (SSG, metadata, JSON-LD)
  cart/page.js            Cart and demo checkout
components/               Header, ProductCard, ShopClient, ProductDetail
context/StoreContext.js   Cart and wishlist reducer, localStorage sync
lib/                      API calls and formatting helpers
```

## How it works

- **Cart state:** every change (add, remove, set quantity) goes through one reducer in `context/StoreContext.js`, which keeps the logic in one place.
- **Saved cart:** the cart is loaded from localStorage in a `useEffect` after the first render, because the server has no localStorage and reading it during render would cause a hydration mismatch.
- **Static product pages:** `generateStaticParams` builds every product page at build time, and `generateMetadata` gives each one its own SEO tags.
- **Filtering:** the visible product list is derived from the filter state with `useMemo`, instead of being stored separately.

## What I learned

- Splitting work between Server Components (data fetching) and Client Components (state and events)
- Managing shared state with Context and a reducer
- Handling loading, error and empty states properly
- Improving SEO and accessibility from the start instead of at the end

## Future improvements

- User login (Firebase Auth or NextAuth)
- Real payments with Stripe
- Order history saved in a database
- Automated tests

## Notes

This is a demo project. The "Place demo order" button does not take any payment, and all products come from a public test API.

## Author

**Riya Yadav**
[LinkedIn](https://www.linkedin.com/in/riyayadav0803) | [GitHub](https://github.com/RIYAYADAV08) | riya080305@gmail.com
