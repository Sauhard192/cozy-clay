# CozyClay

A local React + Vite + TypeScript implementation of the supplied homepage and mobile-menu PDFs.

## Run locally

Run `npm ci`, then `npm run dev` from this directory.

To check and preview the production build, run `npm run build` followed by `npm run preview -- --port 4173`.

## Edit content

Edit `src/content/site.ts` for product images, categories, featured order, announcement, maker bio, and contact links. The exported accessors isolate local data from components so a CMS can be connected later.

Read `design.md` for the design specification and `AGENTS.md` for contribution instructions. `asset-manifest.json` records the source of each supplied asset.

## Scope

Navigation stays within the homepage. Cards are informational; ordering and other pages are deferred. No CMS, backend, payment service, analytics, or deployment is configured.

The reference's promotion and 2025 copyright are preserved pending content review. Key Chains and Worry Stone intentionally use the supplied sticker placeholder. The creator photo was extracted from the PDF.
