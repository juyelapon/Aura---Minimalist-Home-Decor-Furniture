# AURA — Minimalist Home Decor & Architectural Furniture

A production-grade multi-page e-commerce web application built with React (Vite), `react-router-dom`, Tailwind CSS, Framer Motion, and Lucide React.

## Getting Started

```bash
npm install
npm run dev
```

To build for production:

```bash
npm run build
```

## Features

- **Home (`/`)**: Auto-playing Framer Motion Hero Slider, Curated Collections, Signature Silhouettes, and Room Inspirations masonry grid.
- **Shop (`/shop`)**: Sticky Room, Material, and Sort filters synced with URL search params, hover-reveal secondary image cards, Quick Add actions, and 6-items-per-page pagination.
- **Product Detail (`/product/:id`)**: Interactive multi-image gallery, Color/Material finish selector, Add to Cart with quantity control, and animated Dimensions, Shipping & Care accordions.
- **Global Cart Drawer & Toasts**: Persistent `localStorage` cart state managed via `GlobalContext`, complimentary shipping progress bar, and minimalist bottom-right toast notifications.
- **Checkout (`/checkout`)**: 2-column editorial checkout with unboxed underline inputs, delivery service selector, privilege code (`AURA10` for 10% off), and instant order confirmation.
