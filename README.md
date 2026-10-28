# Fome Pizzaria & Churrasqueira

Static website for a Portuguese charcoal grill, wood-fired pizzeria and kebab restaurant. Built with React, TypeScript, Vite and Tailwind CSS.

Live site: https://uzairjan.github.io/fome-pizzaria/

## Features

- Portuguese and English interface
- Light and dark themes with saved preference
- Searchable menu with categories, pricing options, sauces and sides
- Family combo deals
- Persistent cart stored in `localStorage`
- Checkout via WhatsApp with a formatted order summary
- Fully static build, deployed to GitHub Pages

## Local development

Requires Node.js 24 or newer.

```bash
npm install
npm run dev
```

The dev server runs on http://localhost:3000.

## Checks and build

```bash
npm run lint   # TypeScript type check
npm test       # Unit tests for cart and pricing logic
npm run build  # Production build in dist/
npm run preview
```

## Deployment

Pushes to `main` trigger the workflow in `.github/workflows/deploy.yml`, which type-checks, tests, builds and publishes `dist/` to GitHub Pages. The Vite `base` is relative, so the build also works from any subpath.

To publish from another repository, enable **Settings > Pages > Source: GitHub Actions** and update the canonical URL in `index.html`.

## Notes

Restaurant name, phone numbers, address and domain are demo content. Orders are sent to the restaurant through WhatsApp; there is no backend or payment processing.
