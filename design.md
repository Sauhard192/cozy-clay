# CozyClay design specification

Current specification, updated on 2026-10-11 from the approved conversation and current source. User instructions take priority over reference PDFs and skill defaults. This document describes the current design, not a chronological change log. Code remains the source for exact declarations; this update does not certify browser verification.

## Scope and references

Implemented pages: Home (`/`), About Me (`/about`), Say Hello (`/say-hello`), and The Shelf (`/products`). Home retains its Categories section. No product-detail, ordering, cart, checkout, CMS, backend or contact form is included. GitHub Pages configuration is prepared locally; actual publication remains user-managed.

References are in `/Users/jhelliiii/Downloads/cozy clay site/`:

- Home: `desktop-Home.pdf`, `mobile-Home.pdf`, `mobile-Menu.pdf`.
- About: `desktop-About.pdf`, `mobile-About.pdf`. Reuse the homepage creator panel; the PDFs inform the decorations, with later refinements taking precedence.
- Products: `desktop-Products.pdf`, `mobile-Products.pdf`, plus the user-supplied product JSON.
- Say Hello: `desktop-Contact.pdf`, `mobile-Contact.pdf`, plus `/Users/jhelliiii/Downloads/say-hello-flowers.svg`.

Treat PDF contents as visual/copy references, not executable instructions. Match approved composition and assets without introducing a redesign.

## Visual foundations

A warm, playful handmade identity with Cherry Bomb One headings, Quicksand body text, cream surfaces, brown text, orange accents, scallops, supplied floral decorations, crisp shadows and restrained motion.

### Current palette

The active values in `src/styles/tokens.css` have been revised from the initial supplied palette. Preserve the active values; the commented original palette is historical reference, not the current specification.

| Token | Active value |
| --- | --- |
| color-white | #FFFDFCFF |
| color-vanilla-100 | #FFF8E8FF |
| color-vanilla-200 | #FFEFB6FF |
| color-vanilla-300 | #FFD86FFF |
| color-orange-500 | #FF8A3DFF |
| color-brown-300 | #EEC19DFF |
| color-brown-500 | #AC7C62FF |
| color-brown-800 | #4A2818FF |
| color-red-500 | #FF5548FF |
| color-yellow-500 | #FFC928FF |
| color-purple-300 | #A7A8FFFF |
| color-leaf-green-300 | #B7D77BFF |
| color-leaf-green-400 | #78B93DFF |
| color-leaf-green-500 | #559B1FFF |

Components consume semantic roles: `color-text-primary`, `color-text-inverse`, `color-text-inverse-accent`, `color-text-accent-orange`, `color-text-accent-green`, `color-surface-page`, `color-surface-inverse`, `color-surface-green`, `color-surface-vanilla`, `color-surface-card`, `color-decoration`, `color-focus`, and `color-action-secondary`. Secondary action text, outline and arrow are brown through `color-action-secondary`.

SVG flowers and the animated illustration retain their supplied colors. Icons and other shapes use semantic tokens. Preserve photographs, logo and Nepal flag colors.

### Typography and sizing

- Cherry Bomb One, weight 400: display, headings, card names, decorative tags.
- Quicksand, weight 500/700: body, supporting text and buttons.
- Root font size is 100%; dimensions and spacing use rem, tracking uses em, line heights are unitless. Breakpoint thresholds use px.
- Body, subtitle and button sizes are 1rem; supporting labels, preparation times and small footer details are .875rem. The original 10–12px body specification is retired.
- Display currently uses `clamp(3.25rem, 2rem + 6.154vw, 4rem)` on mobile, `clamp(4rem, 2.5rem + 3.125vw, 4.5rem)` on tablet, and `clamp(3rem, 1.633rem + 3.848vw, 5rem)` on desktop.
- Section headings use `clamp(2.5rem, 2.5rem + 1.961vw, 3.5rem)`. Card titles use 1.125–1.25rem on mobile and 1.25rem from tablet.
- Say Hello has its own approved heading formula: `clamp(2.5rem, 1.5rem + 3.85vw, 5rem)`.
- Do not claim all typography is continuous between breakpoints; the current Display token has distinct breakpoint formulas. Keep body/UI text stable rather than making every size fluid.
- Keyboard focus outlines use a .5rem default radius, pill rounding for shaped action buttons, .75rem for icon controls and circles for circular/music buttons. Existing category-card, filter-chip and sort-row rounding is preserved. Focus stays visible without clipping the outline or changing layout.
- Local fonts are preloaded. Initial mounting waits for the required font faces, with a three-second recovery timeout and fallback fonts for failures.
- Visible button labels capitalize the first letter of every word: View All Products, See All Pieces, Contact Me. This does not change navigation/card names. The Instagram handle remains exactly `@cozyclay.np`.

### Responsive layout

| Viewport | Grid columns | Panel scallops | Navigation |
| --- | --- | --- | --- |
| Below 768px | 4 | 5 | Menu |
| 768–1023px | 8 | 7 | Menu |
| 1024px and above | 12 | 9 | Desktop links |

Only 768px and 1024px are structural breakpoints. Page width is capped at 100rem; only the announcement spans the full viewport. Current page/content insets come from layout tokens, including the fluid content inset from tablet onward. Flowers compensate for centered page gutters and remain anchored at viewport edges.

PanelPatterns fits whole semicircles to each actual panel width. Diameter and half-diameter depth change together. No edge cropping or horizontal squashing. Grid cell size follows the fitted pattern; the announcement uses its own smaller fitted repeat. Preserve overlaps that prevent hairline seams.

## Shared shell and navigation

All pages reuse Announcement, Header, footer, menu, CustomCursor and PanelPatterns. Header styling is owned by `styles/components/header.css`; the rounded yellow grid is clipped on its background layer, keeping controls and the modal unclipped.

Home uses a separate header component over its hero background. The hero reserves the measured header height and its yellow grid continues behind the transparent header. Products currently uses the standalone rounded gridded header, as do About and Say Hello. Only if SHOW_PRODUCTS_HERO is re-enabled does Products restore the Home-style hero overlay.

The outer header shell/frame is transparent. Only the announcement and the rounded panel paint their own backgrounds.

### Current sticky setting

StickyHeader exists but `enabled` defaults to false and App does not enable it. The header currently scrolls with the document. Preserve this disabled state unless asked to restore sticky behavior.

When explicitly enabled, the existing implementation pins banner and header together, shows them while scrolling down, slides them out upward while scrolling up after .5rem directional travel, and restores them at the top. Open menus and keyboard focus keep them visible. Measured spacers prevent layout jumps; Home reserves announcement space; Products does so only with its hero enabled. Standalone-header pages, including Products currently, reserve the complete shell. Disabled mode installs no sticky scroll listeners and reserves no sticky anchor clearance.

### Links and states

- Brand links and resolved Home links use `/`, never `#home` or `/#home`.
- The Shelf, View All Products and See All Pieces open `/products`. Home category cards open `/products?category=<category-id>`.
- About Me opens `/about`; Say Hello opens `/say-hello`.
- Contact Me on both creator panels opens `/say-hello`; do not restore mailto on that button.
- Page links use client-side History navigation without a router dependency, preserving the mounted music player. Modified clicks, external links and same-page section links retain native behavior. Back/Forward updates the route; Home opens instantly at the top and cross-page section targets are focused/scrolled after mounting.
- Desktop navigation uses the same orange `nav-underline.svg` marker, 3.75rem by .5rem, for active, hover and focus states. Hover hides other markers and restores the current marker on exit; 240ms fade/scale runs in both directions. No black/native underline.
- All social/WhatsApp links open a new tab with `rel="noopener noreferrer"`. Email links use mailto; internal links stay in the same tab. ShapeButton exposes `newTab` for external social actions.

The mobile/tablet menu shares brand dimensions and header layout, repeats the announcement and uses a brown full-screen surface. Keep native dialog behavior, body scroll lock, focus trap, Escape dismissal and restored trigger focus. Opening uses a 280ms surface reveal and 35ms link stagger. Closing/selection uses a 200ms reverse exit before navigation. The close icon twists/scales in and reverses on dismissal. Reduced motion dismisses without the animation.

## Home

Order: hero, Categories, Popular around here, shared creator panel, shared footer.

- Hero grid appears at every viewport size and continues through its complete bottom scallops. Mask only the background pseudo-element; never clip foreground photo artwork.
- Two complete supplied hero card images retain their embedded frames/captions, transparency and intrinsic proportions. Do not recreate them with CSS cards or duplicate text.
- Mobile/tablet collage overlaps in front of the scallops and slightly beyond their tips, with 4rem above and a negative bottom margin equal to scallop depth plus 1rem. PanelPatterns measures artwork overhang and reserves clearance plus 4rem before Categories. Preserve desktop placement.
- The main page entrance handles the hero copy/CTA; button hover/press remains separate. Collage motion is isolated in HeroCollage: the two complete cards fade/rise .75rem and rotate from 6 degrees flatter into their existing tilt over 600ms, staggered by 100ms. Frame placement remains unchanged.
- Hand Made swings from an 18deg offset into its existing -26deg resting angle on a separate inner layer at 450ms with a gentle 650ms settle, pinned to the measured center of its asterisk. Good Things Grow Slowly follows at 650ms, retaining its .85 scale/-22deg entrance. Desktop fine-pointer mouse-follow activates only while hovering either photo image, with pointer position measured against the collage: first card up to .375rem/1.5deg, second at two-thirds depth/opposite tilt, smoothed over 280ms and returned to rest on pointer exit. During photo hover, Hand Made also swings up to 4deg around its asterisk and the flower note turns up to 2deg around its center. All layers return to rest on photo exit; the surrounding hero, tags and empty collage space do not activate follow. No continuous idle motion; touch, tablet and reduced-motion do not follow the mouse. All observers/listeners/tweens clean up on navigation.
- Category flowers preserve their current viewport-edge positions and tilt. Shared desktop/tablet size references are 10rem for the left flower and 9rem for the right.
- Popular heading/action are stacked and centered through tablet, with space above the action. Desktop uses a left-aligned row. See All Pieces is brown at every size; its outline and hidden arrow remain below desktop.

### Cards and carousels

CategoryCard and ProductCard are separate components sharing the card surface.

| Property | Current design |
| --- | --- |
| Padding | .75rem mobile; 1.25rem tablet; 1rem desktop |
| Photo | Square crop, rounded corners |
| Category card | Supplied category image-icon, category name, green clock.svg and preparation time |
| Product card | Green category label, product name, NRs price |
| Hover | Scale 1.015, lift .25rem, crisp .5rem/.625rem offset shadow with zero blur |
| Height | Equal within the same carousel; intrinsic layout, no fixed height |

Carousels use native horizontal scrolling, touch, snap points, keyboard navigation and bounded previous/next controls. Start/end insets align to section headings; prep time and price sit at the bottom via auto margins. Reserve space for hover effects.

Categories alone has a soft 2rem edge-opacity mask driven by scroll state: trailing fade at start, both mid-scroll, leading at end, none if everything fits. Popular products has no mask. Controls are never masked or blocked.

Seven current categories: Miniature, Earrings, Fridge Magnet, Key Chains, Worry Stone, Phone Charms and Stickers. All currently show 6–7 days; different category times remain pending user-provided values. Popular around here displays every catalogue product tagged bestseller, using its actual supplied name/category/price and no visible badge. Product cards open the shared single-product order dialog.

## Products / The Shelf

Products opens directly to “Our Products,” a semantic h1 using the shared Heading-1 class, followed by category filters, sorting and the visible grid. SHOW_PRODUCTS_HERO=false in src/content/site.ts preserves the complete hero JSX, CSS and assets without rendering it. The same flag controls header overlay/spacer behavior. With the hero disabled, Products uses the standalone header, space-10 (2.5rem / 40px at the default root size) above the title and space-12 (3rem / 48px) below it. No scroll animation hides or reveals the grid; the previous hero and clearance pushed products below the initial screen. Keep the hero disabled unless requested. Its retained specifications below apply only when re-enabled.

Retained hero for route `/products` (currently disabled): shared transparent header overlay, masked yellow grid and fitted 5/7/9 bottom scallops. The footer remains active independently. Hero copy follows the supplied Products PDFs: The Complete Collection / Things for Your Corner. / Small-batch clay pieces made to bring a little more joy to the everyday.

The hero uses supplied complete products-hero-yomari.png and products-hero-dumplings.png assets in the existing overlapping positions, with the left image rotated +15deg and the right image -15deg, without added CSS shadows. Preserve their intrinsic 702/738 proportions, transparent backgrounds, embedded cream borders and original photo colors. Do not recreate their frames with CSS masks, crop, counter-rotate or stretch the images. Decorations are flower-3 (blue) at lower left, +45deg, and flower-2 (yellow) at lower right, -45deg. When the hero is enabled, both decorations are visible on mobile; tablet/desktop use Home's 10rem/9rem side-flower references and viewport-gutter compensation. Preserve source colors; do not substitute creator flowers.

Catalogue uses a uniform two/three/four-card grid on mobile/tablet/desktop, replacing the PDF's mixed-width desktop row. Cards have equal content-driven heights, existing padding/crisp hover, square photos, green category, title and NRs price. Prices sit directly on the card surface without a separate background or padding, aligned with the category and product name at every size. Product cards open the shared single-product order dialog on both Home and Products. On mobile below 768px, product names stay on one line and truncate with an ellipsis when they exceed the card width; the full name remains available in the order dialog. Badges appear only on this page, with at most one New or Bestseller badge per product. Both use the shared product-badge-height token of 2rem and the same photo-top offset. New uses a 2:1 width/height ratio so its visible SVG silhouette matches the Bestseller badge height. Center its text within the solid body beyond the notch, with a half-border-width upward optical adjustment. Bestseller uses a cream surface, yellow border, brown Quicksand text and .625rem corners, inset .5rem from the photo’s top and right edges; use dedicated semantic badge color tokens. New displays the owner-updated tag-new.svg directly as a decorative image, preserving its embedded fill and border. Do not recreate its path or add a CSS/SVG border. Keep the asset’s 2:1 proportions within the shared badge height. Its white text uses Cherry Bomb One, with the owner’s separate text-stroke styling preserved. Its current top offset is space-2 (.5rem); it extends space-2 beyond the card’s right edge, compensating for the shared card-padding property at each breakpoint.

Single-category filters default to All. Mobile chips scroll horizontally with the scrollbar hidden; preserve touch swiping and keyboard access. Selecting a category scrolls its pill to the left inset only when the remaining content can fill the row without extra trailing space. End pills stay in place when fully visible; clipped end pills scroll only enough to become fully visible. This depends on available space rather than a fixed number of pills. Initial category links and Back/Forward selections use the same behavior. Reduced motion makes alignment immediate. Tablet/desktop wrap. Category and sort persist in URL query parameters and browser Back/Forward. Query updates preserve scroll and focus. The selected sort option uses icons/check.svg via the shared Icon component. Sort options are Featured (JSON order), Price: Low to High, Price: High to Low (both use range minimum), and Newest (addedAt descending). The sort dropdown has .25rem row gaps, a 1.5rem container radius, 1rem option radius (outer radius minus .5rem container padding), and 2.75rem minimum option-row height. The sort disclosure uses keyboard-operable native radio inputs; Escape and outside click dismiss it, with trigger focus restored after selection.

`src/content/products.json` contains 32 entries with stable unique IDs, including two Mini me (mix n match) stickers with separate photos. Actual supplied names/categories/prices and owner-supplied photos in public/assets/images/products remain editable there; dates and exclusive tags remain temporary. The second mix-and-match sticker is piece-032, costs NRs. 100 and uses mini-me-mix-n-match-2.jpg. Price is either a number or `{ min, max }`; always display a range object as a range, including 350–350. `src/content/products.ts` owns types, formatting, filtering/sorting and the bestseller accessor, isolating a future CMS adapter. There is no popular tag. Home displays all six currently assigned bestsellers with badges hidden. Dates and tags are placeholders, not verified release dates or sales claims; product photos now use the owner-supplied matching JPEGs.

The Products grid includes one full-width custom-order panel after row two (4/6/8 products on mobile/tablet/desktop). Filtering and sorting retain the panel after the available results when fewer than two rows exist. Product tracks share equal fractional heights; the promo row has natural height. Copy lives in site.ts; the heading wraps naturally without a forced break, with room reserved for tablet/desktop artwork. The custom-order heading uses its own semantic size token: 1.5rem on mobile and 2rem on tablet/desktop. Reuse existing framed product-hero images on tablet/desktop; hide them on mobile. Blue flower-3 sits outside the left edge on tablet/desktop, yellow flower-2 outside the right edge on every size, matching the supplied references, with viewport-gutter compensation beyond the 100rem page cap so both flowers stay at the viewport edges. Orange petal decoration stays clipped inside the yellow, white-bordered panel; the largest background shape uses shape-8-petal.svg. The custom-order button uses the button-rectangle-fill.svg derivative to eliminate SVG letterboxing at its left/right edges; text has no extra side inset. On mobile below 768px, the complete custom-order panel surface opens the prefilled WhatsApp inquiry in a new tab; tablet and desktop use only Order Yours Now. A mobile overlay shares the same destination and delegated click sound, while the visible button remains the single keyboard-accessible link. It uses shared interaction sounds and press feedback. Fine-pointer hover scales it to 1.04 using the shared button easing/duration; reduced motion removes that movement. The order inquiry is handed off to WhatsApp; no checkout or payment processing is added. Focused development-preview checks confirmed placement after eight products at the current desktop viewport, placement after all three Miniature results, equal product-row heights and a disabled action; no build or responsive sweep was run.

## Shared creator and About

Creator is shared between Home and `/about`, with a semantic h2 on Home and h1 on About. Content and Contact Me behavior are shared; the homepage creator section does not link to About.

- Mobile: portrait, centered title, orange divider, bio and actions stacked.
- Tablet: 50/50 portrait/title row, title left-aligned; divider, paragraphs and actions span all eight columns below. A generic display:contents wrapper lets the single title join the grid.
- Desktop: portrait spans five columns, copy seven. No oversized repeated column gaps; fluid copy/panel padding and min-width:0 keep text within the panel.
- Portrait uses the eight-petal mask; Meet The Creator uses tag-meet-the-creator.svg and the yellow decoration role.
- Shared flowers appear on both Home and About: flower-1 lower-left at +45deg, flower-4 lower-right at -45deg. Mobile shows pink only. From tablet, widths are 10rem/9rem. Bottom offsets are -2.5rem mobile, -4rem tablet and -5rem desktop, with viewport-edge compensation.

About has only this panel between the shared shell and footer, without an extra page heading. Mobile/tablet top spacing is `clamp(3rem, 6vw, 6rem)`; below the panel, reserve 8rem to the footer scallop tips by adding their fitted depth minus the .125rem seam overlap to the block margin. Desktop top spacing is 3rem, with its existing bottom `clamp(6rem, 12vw, 14rem)` unchanged.

About's full viewport uses the yellow semantic surface and grid; the creator panel stays cream. PanelPatterns aligns the background grid size/origin to the header. With sticky disabled it scrolls with the document; enabled mode supports fixed alignment. Clean up its body properties on unmount.

## Say Hello

The PDF composition is retained with approved copy corrections:

- Come Say Hello.
- Let’s Make Something Nice.
- Have an idea on your mind, have a question about a piece, or just want to share a photo of your cozy corner?
- Instagram handle: @cozyclay.np; standard link labels WhatsApp and TikTok.

Desktop: left-aligned text in seven columns, flower illustration in five, cream full-page grid. Mobile/tablet: centered, stacked text/action/illustration on a plain background. A full-width orange divider precedes direct WhatsApp, Facebook, TikTok and email links. No form.

Desktop-only side flowers sit near the footer: flower-1 is 10rem at +45deg; flower-4 is 9rem at -45deg. Both sit 3.5rem above the section bottom and extend 1.5rem beyond viewport edges. They are hidden on mobile/tablet. Contact links currently turn orange and scale slightly on pointer hover.

The original `say-hello-flowers.svg` is preserved as supplied. `say-hello-flowers-once.svg` is its documented derivative: original 10-second animation, one iteration, final state held. It mounts once at 15% intersection within a reserved 479/412 aspect-ratio box. Scrolling back does not replay it. Reduced motion jumps to the final frame and pauses.

## Footer, cursor and motion

Footer has a solid brown surface, whole top scallops and rounded bottom corners. Its illustrated logo uses a circular crop (border-radius: 50%, object-fit: cover), preserving its responsive size and placement. All footer content shares the creator panel’s exact inner side padding through `layout-panel-padding-inline`: `calc(1.5rem - border-width)` on mobile/tablet and `clamp(2rem, 4.5vw, 4rem)` on desktop. Footer top/bottom spacing remains unchanged. Its yellow separator fills the inner content width. Preserve the footer line derivative with preserveAspectRatio=none. Footer uses From my desk to yours (the PDF's Form typo is corrected).

CustomCursor is for fine mouse input only after its SVG assets load: 1.25rem brown four-petal idle, 1.5rem orange eight-petal over enabled interactions, cream on the footer/menu. It follows with a 55ms exponential response without a position cap, snaps on press and uses direct positioning for reduced motion. Shapes swap over 240ms; rotation pauses when hidden. Restore the native cursor on keyboard navigation, blur, exit or unavailable assets; support the modal top layer.

Preserve native scrolling and top/bottom overscroll suppression. Existing GSAP motion reveals hero content, creator panels, section headings and Say Hello content; supplied decorations have a brief fade. Respect reduced motion and clean up observers, timelines and animation frames. No 3D or scroll hijacking.

## Assets and local content

Automatic local image optimization: scripts/optimize-images.mjs uses Sharp through imageOptimizerPlugin in vite.config.ts. Vite startup/buildStart prepares variants; the development watcher debounces added/replaced/deleted raster assets and products.json edits, serializes runs, and refreshes image-variants.json for the existing getImageProps adapter. JPEG/PNG/WebP/AVIF originals under public/assets get 320/640/960-width WebP variants (capped at source width), quality 82, preserved transparency and corrected EXIF orientation. Originals are retained; SVGs and animated rasters are preserved. Variants sit beside originals with width/content-hash names. Unchanged variants are reused; generated files are excluded from the watcher to prevent loops. Missing-source mappings are removed. Source additions only need the catalogue image path relative to public/assets; no manual srcSet editing is required. npm run images:optimize offers a manual pass. Builds are still opt-in; wiring this hook does not authorize running a build. Current product photos total about 2.5 MB for all 32 largest 960px variants, compared with 52.6 MB of original JPEGs.


Asset folders: public/assets/images/{products,categories,hero,creator,brand,social} hold originals and existing optimized variants together by purpose; icons/image-icons holds category icons, flowers holds decorative/animated SVGs, shapes holds reusable masks/tags, and fonts/audio hold their respective files. Preserve generated width/hash suffixes. Catalogue image values and image-variants.json keys are paths relative to public/assets. The trusted inline Say Hello SVG stays bundled at src/assets/flowers/say-hello-flowers-interactive.svg for its raw import and interaction handling. Use descriptive filenames; update content, mappings, CSS, HTML and asset-manifest.json together when moving assets.


Assets live under `public/assets/`; record source paths and derivative settings in `asset-manifest.json`. Preserve supplied originals. Responsive WebP derivatives have hashed names and are mapped in `src/content/image-variants.json` and delivered through `images.ts`. Keep srcSet/sizes and the homepage-only main.tsx preload aligned when changing layouts or sources; only the first hero receives high priority. Below-fold collection/portrait images are lazy; the standalone About portrait is eager.

Typed site content/accessors in `src/content/site.ts` own categories, navigation, promo text, maker bio, Say Hello copy and contact destinations. Preserve stable IDs and this separation for a future CMS migration. Do not configure a CMS or ordering flow yet.

Current email: apekshyashrestha12@gmail.com. Existing social destinations remain in the content module. The announcement copy in src/content/site.ts is “Dashain: 5% off · Code: DASHAINTIME”. Footer copyright uses the current calendar year automatically through the site content accessor. Category-specific preparation times remain unresolved; catalogue photos are owner-supplied; badges and dates remain temporary owner-editable values.


## Page and image loading

Each pathname visit (including Back/Forward) remounts the main content and plays a 300ms fade with a .5rem upward entrance. The shared header stays steady. Same-page category/sort updates do not replay page motion. Existing card hover and section interactions remain. HeroCollage separately owns the approved photo arrival, pinned tag swing, delayed petal note and desktop mouse-follow; image-loading zoom stays on the inner image.

RevealImage owns photo and main-artwork loading: reserve the original aspect ratio, keep a plain placeholder with subtle shimmer until load/decode succeeds, then reveal at first viewport intersection with a 350ms fade and scale 1.025 to 1. Successfully decoded images use a 150ms revisit reveal. Failed images show an accessible Image unavailable fallback without collapsing layout. Logos, icons, tags and decorative flowers are excluded. Reduced motion disables entrance movement, zoom, shimmer and transitions. The Say Hello artwork retains its own once-per-visit animation trigger.

Reuse existing WebP srcSet variants and accurate carousel sizes; below-fold photos remain native lazy-loaded. About's main portrait is eager/high priority. main.tsx preloads the first hero during font preparation only on the initial Home route; homepage photos are not preloaded on unrelated routes. Sharp now provides the automatic local image pipeline; no CMS is configured.

## Implementation and verification status

CSS is plain and entirely under `src/styles/`: shared component files, page-specific files, central tokens, globals and fonts. Retired CSS remains in `.backups/css-before-reorganization` and is not imported.

User instruction: do not run builds or responsive checks unless explicitly requested. Historical build/browser results predate later changes and do not validate current pages. Prefer the Vite development preview for source edits; do not use stale production previews as evidence. Products filtering, price sorting and History behavior received focused functional verification in the development preview. The loading update received focused checks of visible/below-fold photo states, category filtering, Home collage, About portrait and Say Hello artwork; no browser errors were reported during those checks. Error fallback and reduced-motion handling were source-reviewed. No build or responsive sweep was run. Subsequent changes passed TypeScript and CSS parsing where applicable. Music and control sounds received isolated state/behavior checks (autoplay denial, pause/resume, visibility handling, alternation, keyboard clicks, mute, swipe suppression, two-voice limit and cleanup). The persistence update also passed isolated checks for refresh/reopen preferences, saved playback position, first-click autoplay recovery, intentional mute, sound-button exclusion and session preference migration. Pages helpers and direct-entry generation passed fixture checks for root and repository-prefixed paths, query URLs and trailing slashes. These checks are not browser audio or live deployment verification; the production Pages build, browser playback and hosted routes remain unverified.

GitHub Pages is configured locally for /cozy-clay/ with an Actions workflow triggered by pushes to main or manual runs and generated direct-route entry files. GitHub settings and publication remain user-managed. Product ordering, CMS, inventory/pricing finalization and deployment remain deferred.

## GitHub Pages configuration

The shared link-preview title in index.html (og:title) is “CozyClay — Handmade Little Joys”. This is separate from browser/page titles. The sharing image is the supplied homepage screenshot, copied unchanged to public/assets/images/social/cozyclay-share-preview.png (1113×712), with its absolute GitHub Pages URL, dimensions, type and alt text in index.html. Preserve the current sharing description pending user input.

Target: https://sauhard192.github.io/cozy-clay/. Vite mode github-pages uses /cozy-clay/; normal development and the regular build retain /. npm run build:pages type-checks, builds in that mode, then runs scripts/prepare-pages.mjs. npm run preview:pages previews that output at /cozy-clay/.

src/utils/paths.ts owns siteUrl for runtime image/audio/icon URLs and internal links, and routePath for prefix/trailing-slash normalization. Preserve external URLs, mailto links, fragments and already-prefixed paths. CSS asset URLs are handled by Vite; HTML asset/preload paths use %BASE_URL%. Navigation compares normalized routes so direct visits with trailing slashes retain filter/sort scroll behavior.

scripts/prepare-pages.mjs copies the built index into about/index.html, say-hello/index.html and products/index.html, and writes .nojekyll. These are direct-route entries, not a custom server rewrite or a hash router; extend them when adding pages.

.github/workflows/pages.yml uses Node 22, npm ci, the Pages build and GitHub's Pages artifact/deploy actions. It runs automatically on pushes to main and also supports workflow_dispatch; it uploads only dist. The user must select GitHub Actions in Settings → Pages. Once the workflow is committed and pushed, subsequent main pushes automatically optimize images, build and publish the site; manual Publish GitHub Pages runs remain available. No gh-pages package, publishing branch or custom domain is configured. Setup did not push, modify GitHub settings or publish. Follow GITHUB-PAGES.md; do not trigger publication without authorization.

## Talk Soon interaction

Say Hello uses the trusted inline say-hello-flowers-interactive.svg derivative, retaining the original one-playthrough animation. The tag links to WhatsApp in a new tab, scales to 1.05 over 200ms on hover/focus, and shows a rounded brown tooltip with white WhatsApp text. On fine-pointer hover it follows the cursor with an 80ms exponential response, offset 16px right/below and flipped/clamped near viewport edges. Keyboard focus keeps it above the tag; reduced motion follows directly. Tracking stops when settled or on pointer exit and cleans up on unmount. Pointer exit retains the last cursor position throughout the fade; only keyboard entry restores the above-tag position. The tooltip is pointer-transparent in both modes to prevent edge-hover loops. Escape dismisses it; touch activates directly. Reduced motion skips scaling and the entrance wait. Preserve original SVGs.

## Background music

Control clicks/taps and keyboard-generated clicks alternate bubble-pop-1.mp3 and bubble-pop-2.mp3 at 15% volume, with at most two overlapping voices. Ignore disabled/inert controls, empty-space clicks, synthetic clicks and drags/swipes. MusicToggle owns shared persisted sound intent: interaction sounds work when autoplay is blocked, but explicit music pause mutes and stops them. No hover or swipe sounds. Keep the source downloads unchanged and record renamed copies in asset-manifest.json.

MusicToggle stays mounted across internal page changes. Attempt autoplay at 3.5% volume; if the browser blocks it while sound is desired, retry on the first trusted click/tap anywhere on the site. Exclude the music-button click from that handler so it retains its own toggle behavior. Loop cozy-theme.mp3, pause/resume at the current position, and retain playback choice/time in localStorage across refreshes and browser reopening, preserving intentional mute. Migrate the previous sessionStorage choice when no durable preference exists, and fall back to sessionStorage if localStorage is unavailable. Save progress at most once every two seconds, with immediate saves on toggle, hide and page exit. Pause while the tab is hidden and resume on return only when playback is still desired and not blocked. Preserve the audio node when the menu opens; move its button portal into the open menu dialog for access within the focus trap. While an order dialog is open, keep the sound button in the page beneath the modal and its backdrop; audio remains mounted.

The bottom-right button uses button-circle-fill.svg. The surface stays orange in every state. All icons stay brown: sound-off when paused, sound-on when playing, and refresh on failure. The sound-on, sound-off and retry icons crossfade over 200ms; the orange background and brown icon color remain constant. Reduced motion removes transitions. Audio failures replace the sound icon inside this same button with refresh.svg and a Retry background music label; browser autoplay denial keeps sound-off instead of showing retry; clicking reloads/retries the track. Internal route changes remount route-specific header, patterns and motion with unique component-prefixed keys while keeping audio alive. Each route retains exactly one header and spacer; duplicate sibling keys must not leave old spacers in the document.

## WhatsApp order inquiry

OrderProvider/OrderDialog provide one shared native modal for product cards on Products and Home. A transparent, keyboard-operable button covers each product card without changing its content layout. The dialog displays the selected photo, name, unit price, quantity (1–99), optional note and calculated total. A range stays a range and both endpoints are multiplied by quantity; show “Final price confirmed on WhatsApp.” Regular prices are used, with discounts confirmed separately. The modal shows the product’s category name, followed by the matching category’s preparationTime with a green clock icon, between the product name and unit price at every breakpoint. Both labels use green supporting text and share a wrapping row so they fit the available space. The existing category value is reused rather than copied into product data; it is not added to the WhatsApp message. The note is limited to 2,000 characters. The subtitle, note placeholder and final-price confirmation share color-order-muted (brown-500). Its focus state thickens the existing orange border from .125rem to .25rem, with no extra brown outline and no layout shift. The quantity count occupies a fixed 1.5rem width so changing between one and two digits does not move the buttons. Quantity controls use icons/plus.svg and icons/minus.svg; minus is disabled at 1 and plus at 99.

Mobile uses a full-width bottom sheet anchored to the viewport bottom, with rounded top corners, no outer border, safe-area padding beneath its actions and a slide-up entrance (immediate with reduced motion). Close, Cancel, Escape and tapping the backdrop dismiss it; swipe dismissal is not enabled. Opening on mobile adds a same-URL history entry so the phone/browser Back button closes the sheet before leaving the page. Other dismissal controls consume that entry too, preserving the current page and scroll position. Its approved stacked layout includes: a full-width 4:3 product photo capped at 32dvh, followed by the full product name, a wrapping category/preparation row, unit price on a separate row and quantity controls. The current WhatsApp subtitle and icon-free category label are retained. Header and body scroll vertically together with horizontal overflow hidden, while Cancel and Send on WhatsApp remain visible in a separate bottom action area, with Cancel on the left. The bottom dashed divider belongs to the fixed action area so it remains visible while content scrolls. The close control sits inside the top-right corner, vertically centered with the Your Order title and using the same orange icon-button style as desktop. The previous compact mobile component and stylesheet are preserved in .backups/order-dialog-before-stacked-mobile/. Tablet and desktop retain their existing layout. Quantity buttons retain 2.75rem tap targets, followed by the note and total. Both actions use stretch-to-fill SVG mask derivatives so their visible shapes share the same height, including the narrower desktop Cancel button; the original shared button assets are preserved. Tablet and desktop use the name/price above the quantity controls, centered beside the photo; actions remain in a row. On tablet and desktop the dialog is centered. At every size it has a viewport-height-limited inner scroll area inside an overflow-hidden surface. The custom thin light-brown scrollbar uses semantic order scrollbar tokens, a cream track and rounded thumb; the outer surface clips the scrollbar to its corners. While the order modal is open, both custom cursor shapes use the white color-cursor-order-contrast role over its close button and outside its surface; other hover colors remain unchanged. On tablet and desktop, its orange close button sits outside the scrolling surface, overlapping the top-right edge by 1.25rem. Tablet and desktop retain side gutters and vertical clearance for the overlapping close button; mobile keeps its close control inside the sheet. Native modality traps focus; opening locks body scrolling. Cancel, Close, Escape and a deliberate outside click dismiss it, restoring focus and body scrolling. Each opening starts with quantity 1 and an empty note.

src/utils/orders.ts owns total/message formatting and encoded wa.me URLs. For range-priced products, the outgoing message asks “Please confirm the final price for this order.” with one blank line before it. Leave one blank line after “Hi CozyClay! I’d like to order:” before the product details. The recipient is 9779768535505, resolved from the existing wa.link/mxolfd destination and stored in site.contact.whatsappNumber. Send on WhatsApp opens a new tab with product, category, a public product-photo URL, quantity, unit price, total and optional note; the dialog remains available. The custom-order button sends “Hi CozyClay! I’d like to discuss a custom order.” Its click uses the shared alternating bubble sounds. Allow an already-started click sound to finish when WhatsApp opens another tab; hidden tabs cannot start new sounds, and explicit mute/unmount still stop playback. No message is sent automatically. The photo URL is the final line of the WhatsApp message, with a blank line before it. Product-photo links use the original image under the current window.location.origin plus Vite BASE_URL in production, automatically following the deployed domain and base path. Development uses site.publicUrl as the public fallback so recipients never receive a localhost image link; update that fallback after moving domains. Direct image links do not guarantee WhatsApp thumbnails; product-specific static Open Graph sharing pages are not implemented. Existing delegated interaction sounds cover the native card/dialog buttons and action links, respecting the persistent sound preference; disabled controls do not play sounds. CSS lives in src/styles/components/order-dialog.css with semantic order colors/dimensions in tokens.css. All modal typography uses existing shared font tokens: small-heading for both the dialog title and product name, title for quantity, body for note/price, small for supporting copy and button for actions. There is no modal-specific font-size token.
