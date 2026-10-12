# Publish Cozy Clay on GitHub Pages

Target: https://sauhard192.github.io/cozy-clay/

Pushes to main automatically run Publish GitHub Pages: install dependencies, optimize images, build the site and deploy dist. Manual workflow runs remain available. This local configuration takes effect after it is committed and pushed.

## Publish when ready

1. In GitHub, open **Settings → Pages → Build and deployment** and select **GitHub Actions** as the source.
2. Commit the intended project changes, including `.github/workflows/pages.yml`, and push them to main.
3. Open **Actions → Publish GitHub Pages** to follow the automatically triggered deployment.
4. Wait for the workflow to finish. The deployment link appears in its summary.

Publish future updates by pushing to main. To publish manually, open **Actions → Publish GitHub Pages → Run workflow**, select the branch and confirm. No `gh-pages` npm package or dedicated deployment branch is needed.

## Local commands

- `npm run dev`: normal local development at `/`.
- `npm run build:pages`: type-check, build for `/cozy-clay/`, and create direct-route entry files in `dist`.
- `npm run preview:pages`: preview that build; visit `/cozy-clay/` on the printed server address.

Only `dist` is uploaded by the workflow. Keep source files and node_modules out of manual uploads.

## How paths work

Vite's `github-pages` mode uses `/cozy-clay/`; regular development/builds retain `/`. The shared `siteUrl` helper prefixes runtime assets and internal links, while `routePath` strips the prefix for app route selection. Vite rewrites CSS asset URLs, and HTML preloads use `%BASE_URL%`.

The Pages build creates `about/index.html`, `say-hello/index.html`, and `products/index.html`. This lets direct visits and refreshes work without a server rewrite or hash routing. GitHub may add a trailing slash to a direct route; the app accepts both forms. Category and sort query parameters remain supported. Add an entry in `scripts/prepare-pages.mjs` whenever adding a new page.

For a future custom domain, change the Pages-mode base in `vite.config.ts` to `/` and configure that domain separately in GitHub. No custom domain is configured now.

## Verification

Configuration was checked with TypeScript and targeted base-path/direct-entry tests. No production build, browser check, push, or deployment was performed during setup. The workflow runs the production build when you publish.
