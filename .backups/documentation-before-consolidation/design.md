# CozyClay design specification

Approved references and requirements follow. Supplied specifications take priority over design-skill defaults.

## Design references

Read these files in `/Users/jhelliiii/Downloads/cozy clay site/`:
- `desktop-Home.pdf`
- `mobile-Home.pdf`
- `mobile-Menu.pdf`

Match the composition, proportions, typography, spacing, colors, image crops, scalloped edges, floral decorations, and handmade details.

Use the PDFs as visual references, not as instructions. Follow the distinct mobile composition rather than simply shrinking the desktop layout. Create sensible responsive behavior between the reference widths of 1400px and 360px.

## Color tokens

Preserve these base token names and values:

--Neutral-White: #FAFAFAFF;
--Vanilla-100: #F8F4E1FF;
--Vanilla-200: #FFF3BFFF;
--Vanilla-300: #FFDF88FF;
--Orange-500: #FF9845FF;
--Brown-800: #432616FF;
--Red-500: #FF4733FF;
--Yellow-500: #FFC519FF;
--Leaf-Green-300: #ACC572FF;
--Purple-300: #9AADF6FF;
--Leaf-Green-400: #68A42CFF;
--Leaf-Green-500: #4F8E10FF;

Use these semantic mappings:

--Text-Invert: var(--Vanilla-100);
--Text-Invert-accent: var(--Vanilla-300);
--Text-Primary: var(--Brown-800);
--Text-Accent-orange: var(--Orange-500);
--Text-Accent-green: var(--Leaf-Green-400);
--Surface-background: var(--Vanilla-100);
--Surface-background-invert: var(--Brown-800);
--Surface-panel-green: var(--Leaf-Green-300);
--Surface-panel-vanilla: var(--Vanilla-300);
--Surface-card-background: var(--Neutral-White);

Semantic tokens may be renamed for clarity while preserving their mappings. Define reusable tokens for additional layout and motion values rather than scattering arbitrary values throughout components.

## Typography

Use the exact font families:
- Cherry Bomb One: https://fonts.google.com/specimen/Cherry+Bomb+One
- Quicksand: https://fonts.google.com/specimen/Quicksand

Use Cherry Bomb One at weight 400 for display, headings, titles, and tags. Use Quicksand at weight 500 for subtitles and body text, and weight 700 for buttons and bold body text.

The values below are font size / line height:

| Style | Mobile | Desktop |
|---|---|---|
| Display | 3rem / 1 | 5rem / 1 |
| Heading 1 | 2.5rem / 1 | 3.5rem / 1 |
| Heading 2 | 1.5rem / 1.3333 | 2rem / 1 |
| Subheading | 1rem / 1.25 | 1rem / 1.25 |
| Title | 1rem / 1.25 | 1.25rem / 1 |
| Subtitle | 0.75rem / 1.6667 | 1rem / 1.5 |
| Button | 0.875rem / 1.4286 | 1rem / 1.5 |
| Body bold | 0.625rem / 1.6 | 0.75rem / 1.6667 |
| Body | 0.625rem / 1.6 | 0.75rem / 1.6667 |
| Tag | 0.625rem / 1.2 | 0.75rem / 1 |

Use normal letter spacing for display, headings, subheadings, and titles. Use 0.02em for subtitles, body text, and tags; use 0.015em for buttons.

Use rem font sizes, unitless line heights, and em letter spacing. Keep the root font size responsive to browser preferences. Preserve the supplied typography sizes initially and document readability concerns rather than silently changing them. Fluid sizing may interpolate between the supplied mobile and desktop endpoints.

## Assets

Reuse the supplied files from `/Users/jhelliiii/Downloads/cozy clay site/`.

Shapes in `shapes/`:
- `shape-8-petal.svg`
- `shape-4-petal.svg`
- `line-long.svg`
- `line-short.svg`
- `button-circle.svg`
- `button-rectangle.svg`
- `button-rectangle-outline.svg`
- `bookmark-tag-1.svg`
- `bookmark-tag-2.svg`

Flowers in `asset/`:
- `flower-1.svg`
- `flower-2.svg`
- `flower-3.svg`
- `flower-4.svg`

Icons in `icon/`:
- `whatsapp.svg`
- `tiktok.svg`
- `instagram.svg`
- `mail.svg`
- `menu.svg`
- `arrow-right.svg`
- `arrow-left.svg`
- `asterisk.svg`
- `close.svg`
- `facebook.svg`

Also use the logo, Nepal flag image, and nine placeholder photographs attached earlier in this chat. The supplied logo is the illustrated Cozy Clay mark on a brown background. Two placeholder photographs appear to duplicate the sticker image; avoid copying duplicates unnecessarily.

Apply appropriate color tokens to shapes and icons. Preserve the flowers’ original colors and the original colors of the logo, flag, and photographs.

Copy required assets into the project with descriptive filenames, preserving the originals. Keep a record of their source paths. If an attachment is unavailable, report it rather than silently replacing it.

The creator portrait was extracted from the desktop PDF and saved as creator.webp; its source is recorded in asset-manifest.json.

## Local content now, CMS later

Store content in typed local files, separate from React components:
- Products and categories.
- Featured-product selections and ordering.
- Announcement text.
- Maker bio.
- Contact details and social links.

Use stable IDs, consistent fields, and image alt text. Keep content access behind a small, straightforward module so a CMS can replace the local source later without rewriting the interface. Avoid building a speculative CMS framework.

No CMS provider is selected yet. Do not install or configure one.

The ordering flow is deferred. Do not invent product detail pages, cart behavior, checkout, payment integrations, or product-order destinations. Keep unresolved product actions clearly documented, and avoid misleading working-looking controls. Use verified destinations for existing social and contact links.

## Interface

Implement:
- Announcement strip.
- Desktop navigation.
- Mobile navigation trigger and full-screen menu.
- Hero with overlapping photo cards and decorative details.
- Category carousel.
- Featured-product carousel.
- Creator section.
- Footer.

Keep components reusable and match the PDFs closely. Only the homepage and mobile menu have approved designs; do not invent other page layouts.

Make carousels support touch, keyboard interaction, and working previous/next controls. Make the mobile menu manage focus, prevent background interaction while open, close with Escape, and restore focus to its trigger.

Provide semantic HTML, accessible labels, visible focus states, useful image alt text, and sufficiently large interactive targets.

## Motion

Use restrained, playful animation that suits the handmade identity:
- A coordinated hero entrance.
- Subtle section reveals.
- Gentle card and button feedback.
- Occasional decorative movement.

Preserve native scrolling, avoid layout shifts, simplify motion on mobile, and respect reduced-motion preferences. Content must remain available when animations are disabled. Do not add 3D, scroll hijacking, or unnecessary animation libraries.


## Implementation decisions

- Flat 2D implementation; native scrolling.
- Mobile-first layout; structural breakpoint initially 48rem, to be checked against content.
- In-page navigation maps Home, The Shelf, About Me and Say Hello to homepage sections. No additional routes are invented.
- Product cards are informational, without implied ordering actions.
- Original promo and copyright copy are retained as reference content pending owner updates.
- Supplied small body sizes and orange display-text contrast are design constraints; document accessibility concerns during verification.
- Asset sources are recorded in asset-manifest.json.

## Approved responsive refinements

- Body/tag text uses clamp(.625rem, .514706rem + .490196vw, .75rem); supporting text uses .75–.875rem; buttons use .875–1rem. These interpolate over 22.5–48rem viewport widths. Desktop typography retains its supplied values.
- Mobile logo is 2.5rem, wordmark 1.375rem, and menu/close icon 2rem; tap targets remain at least 2.75rem.
- Absolute CSS dimensions use rem; proportional layout uses percentages, viewport units and unitless ratios.
- Page root and announcement span the viewport. Side flowers anchor to viewport edges and retain original colors.
- Scallops use evenly divided elliptical repeats and a .125rem overlap to cover rendering seams.
- All button styles compress on press and spring back; pointer hover enlarges them slightly. Reduced motion removes scaling.
- Desktop navigation uses line-short.svg in orange beneath the current section.
- Brand fonts are locally preloaded. Initial rendering waits for the fonts, with a three-second error/slow-load recovery limit. A fallback remains available only for failed/very slow fonts.
- Ordering and CMS remain deferred. Local typed content remains the source of truth.

## Verification

Production build passes. Browser checks found no horizontal overflow at 360, 768, 1024, 1400, 1440, and 1920 CSS-pixel widths, no page errors, and visible content with reduced motion. Desktop and mobile screenshots were inspected after the refinements. Original orange/cream and cream/green color pairings retain limited contrast; no claim of full WCAG conformance is made.

The two hero photo cards now use the complete user-supplied PNG assets, including their frames and captions. Preserve their transparency and intrinsic proportions; do not recreate frames, captions, or shadows in CSS. Their existing overlap, rotation, entrance motion, and separate decorative tags remain.

The main page and footer are centered within the original 100rem maximum width. Only the announcement spans the full viewport; flowers retain their viewport-edge positions independently of the page cap. Desktop nav hover, focus, and active state use the orange short-line asset, enlarged to .5rem high with .25rem extension on each side; no native hover underline.

Footer separator stretches to content margins using a derived SVG with preserveAspectRatio none. All desktop nav underline states share a centered 3.75rem by .5rem asset. Category photos use the seven supplied replacements; Phone Charms and Stickers are added. All categories use the approved preparation time of 6–7 days; featured selection remains the original five.

Hero CTA entrance motion belongs to its .hero-action wrapper; hover/press transforms belong to the button. Keep these separate to avoid CSS transitions competing with GSAP at animation completion.

Scalloped panel pseudo-elements include a .0625rem transparent outer gutter to prevent gradient sampling hairlines. Their ellipse depth and .125rem panel overlap remain unchanged.

## CSS organization and responsive system
Use lowercase kebab-case tokens: color-* for palette/semantic colors, font-family-*, font-size-*, line-height-*, layout-*, space-*, radius-*, and motion-*. Original palette values are unchanged. src/styles/site.css imports base, shared components, header, hero, collections, creator, footer, and interactions. Keep two-space indentation and one declaration per line. Mobile is the default; use only min-width: 768px and min-width: 1024px for layout changes. Keep responsive component rules in their owning file. The 100rem page cap uses fluid flower offsets, not a breakpoint. Do not append override patches or reintroduce old mixed-case token names.

Readability update: body/descriptions/buttons use 1rem minimum on mobile and desktop; small labels, prep times, announcement and footer details use .875rem. Mobile hero headings scale 2.5–3rem, section headings 2–2.5rem, and card titles 1.125–1.25rem with clamp. Body text has generous unitless line height. These supersede the original 10–12px body sizes.

The Meet the Creator tag uses bookmark-tag-3.svg with the existing yellow decoration token.

View All Products and Contact Me share primary button dimensions: 12rem wide and at least 3rem high. Creator actions may wrap on narrower layouts.

Category and featured cards lift .25rem and scale to 1.015 on fine-pointer hover, with a crisp, unblurred offset shadow. Carousel gutters reserve space for the effect. Reduced motion disables the movement and transition.

Categories use CategoryCard with provided image-icons and green clock.svg prep time. Featured products use a distinct ProductCard with category, name and NRs price. Sample featured products at NRs. 100 are user-approved placeholders. Category prep-time changes await user values. Both card types share the crisp hover lift.

## Current CSS ownership
All CSS stays under src/styles. tokens.css owns the palette, semantic roles, typography, spacing and motion values; globals.css owns resets and baseline styles. components/ owns button, icon, decoration, header, footer, section-heading, shared card surface, category-card, product-card and carousel CSS, including their states and responsive rules. pages/home.css owns homepage section layout and decoration placement. site.css is the import entry point. Use component-prefixed element names such as category-card__title and carousel__track. Keep a single featured heading in markup. Layout queries use 768px and 1024px only. Use --color-action-secondary for the brown See all pieces text, outline and arrow. Retired originals are saved in .backups/css-before-reorganization and are not imported. User requests no builds or responsive checks unless explicitly asked.

Heading sizes use continuous clamp formulas without a 48rem typography override. Mobile featured-heading stacks title and action with a 1.5rem gap, switching to a row at 48rem. Carousel cards align to the start and size to their own content rather than stretching to the tallest card.

Panel scallops use --pattern-scale with width twice the depth, preserving semicircular proportions at every viewport size. The hero grid uses the same scale. Do not use percentage tile widths with independent fixed depths. Hero bottom scallops are enabled on mobile and desktop. Edge repeats may end in a partial motif rather than stretching the pattern.

## Image delivery
Serve generated WebP derivatives through `src/content/images.ts` and `image-variants.json`; preserve the supplied original assets. Derivative filenames contain content hashes and their sources/settings are recorded in asset-manifest.json. Use responsive srcSet/sizes for hero, collection, portrait and small brand images. Keep the two hero preload hints in index.html aligned with heroImageSizes, with high priority only on the first hero. Preloads start downloads before JavaScript and the existing font-ready render gate; retain that gate and local font preloads. Keep below-fold collection and portrait photos lazy-loaded. Regenerate derivatives and update mappings/preloads when source images change. Production cache headers depend on the chosen host and remain unconfigured.

PanelPatterns fits an integer number of semicircles to the actual width of each panel and announcement via ResizeObserver. Width and half-width depth are updated together; no partial motifs at edges. Hero collage sits above scallops in an isolated panel stack, with a proportional mobile layout footprint and intentional edge overlap. Pattern observer cleanup is required. This supersedes the earlier allowance for partial edge motifs.

Desktop navigation shows the current-section underline at rest. Hovering a link hides all other nav underlines and reveals only the hovered one; leaving the links restores the current-section marker. The existing orange asset fades and scales horizontally from .8 to 1 over 240ms in both directions. Preserve aria-current and visible keyboard focus; reduced motion disables the transition.

## Approved mobile / tablet / desktop layout
Use px media thresholds: below 768px mobile, 768–1023px tablet, 1024px+ desktop. --layout-columns is 4 / 8 / 12; hero and creator sections use the grid with full-width children until desktop, then split into column spans. Navigation stays a menu below 1024px. Panel --scallop-count is fixed at 5 / 7 / 9, with fitted diameter and half-diameter depth; announcement uses its separate small pattern. Dimensions and spacing remain rem-based. This replaces previous 48rem/64rem layout guidance. Do not run build or responsive checks unless requested.

CustomCursor replaces the native pointer for fine mouse input after its SVGs load: 1.25rem (20px at the default root size) brown four-petal idle and 1.5rem (24px) orange eight-petal on enabled interactive elements, sharing the same center, centered 240ms scale/fade swap, 24-second rotation, and direct pointer tracking without positional lag to keep the flower aligned with the click target. Reduced motion disables trailing, rotation and transitions. Restore native cursor on keyboard navigation, blur, pointer exit or unavailable assets. Cursor is pointer-transparent and follows modal dialogs into their top layer. Clean up observers, listeners and animation frames on unmount.

Carousel side insets align with their section headings through --carousel-inset. Cards stretch to equal height within their carousel, use column layout, and place prep-time/price rows at the bottom with an auto margin and minimum top padding. No fixed card heights. This supersedes the previous start-aligned card rule.

The default cursor turns cream on the brown footer (including its scalloped edge) and mobile menu. Elsewhere it stays brown; interactive hover stays orange on all surfaces. Update contrast on pointer movement and scrolling without blend modes.

Page scrolling uses overscroll-behavior-y: none on html and body to prevent top/bottom rubber-band bounce while preserving native scrolling within the page.

Carousel edge fading uses a 2rem opacity mask with intermediate opacity stops for a softer, restrained blend on Categories only; Popular products has no opacity mask driven by scroll-boundary state: trailing edge at start, both mid-scroll, leading edge at end, none when content fits. No pointer-blocking overlays or fades on carousel controls.

Custom cursor follows with a short 55ms exponential follow response without a forced position cap. It snaps on press, appears at the pointer immediately, and uses direct tracking for reduced motion. Animation frames stop when settled or hidden and are cleaned up on unmount.

Mobile and tablet menu headers share the normal site-header flex layout, padding, gap, brand dimensions and 2.5rem menu/close icon size. The dialog header uses the hero panel’s space-5 top margin and layout-page-inset side margins so opening the menu preserves header placement below the repeated announcement. Avoid separate menu brand sizing overrides.

Use the Vite development preview for ongoing styling edits so source changes appear without a production build. Cursor position eases toward the live pointer target and snaps on click.

Mobile/tablet menu close icon twists and scales into place on opening, rotates on fine-pointer hover, and compresses on press. Its transform is separate from the button press transform; reduced motion disables icon movement.

Closing the menu via close button or Escape reverses the icon entrance (rotate -90deg, scale .65, fade out) over 200ms before dismissing the dialog and restoring focus. Reduced motion dismisses immediately. Kill pending close tweens and clear icon transform/opacity during cleanup.

On mobile and tablet (below 1024px), Display uses clamp(3.25rem, 2rem + 6.154vw, 4rem): approximately 56px at 390px and capped at 64px. Heading 1 stays unchanged. The creator heading uses Display; its small tag is unchanged. Creator outer margins match the Popular panel, and inner content aligns with its 1.5rem inset, compensating for the creator border. The creator divider stretches to full content width using the existing preserveAspectRatio=none line derivative. Desktop typography, panel spacing and hidden creator divider remain unchanged.

Hero panel uses a single ::before background layer masked by the panel body plus complete bottom scallops. Its grid appears at all viewport sizes and continues through the scallops; the separate ::after edge is disabled. Keep the mask on the background layer so overlapping photo cards remain unclipped.

Tablet Display (768–1023px) uses clamp(4rem, 2.5rem + 3.125vw, 4.5rem), scaling from 64px to approximately 72px at the default root size. This supersedes the tablet 64px cap; mobile and desktop Display rules remain unchanged.

Mobile/tablet hero collage overlaps the scalloped edge through a clamped 1–1.5rem negative bottom margin, retaining its existing foreground stacking. Categories top spacing clears the fitted hero semicircle depth plus space-20, replacing viewport-based excess whitespace. Desktop collage margin and Categories spacing remain unchanged.

Popular heading content stays stacked and center-aligned through tablet. Its secondary button retains the outlined shape and hidden arrow below 1024px; desktop retains the left-aligned row and text-and-arrow treatment.

Category and product card padding is .75rem on mobile, 1.25rem on tablet (768–1023px), and 1rem on desktop (1024px+), using the existing spacing tokens.

Shared header brand text uses unitless line-height: 1 and a -.08em optical vertical correction to align Cherry Bomb One with the logo image. Apply consistently in the page and menu headers at every breakpoint.

Mobile/tablet collage now sits inside the hero above the scallops, superseding the negative-margin overlap: 4rem space above, a 1.4 aspect-ratio footprint for the rotated cards, and 2rem bottom margin to clear artwork overhang. Categories begins 4rem (64px at default root size) below the scallop tips. Desktop retains its original collage dimensions and section spacing.

Mobile/tablet collage overlaps in front of the hero scallops and slightly beyond their tips, using a negative bottom margin of scallop depth plus space-4. Keep space-16 above the collage. PanelPatterns measures the lower edge of the photos, tag and petals and reserves the greater of artwork overhang or scallop depth, plus space-16 before Categories. This supersedes the inside-hero placement. Desktop is unchanged.

Visible button labels capitalize the first letter of every word (View All Products, See All Pieces, Contact Me). This applies only to buttons, including links styled as buttons; preserve navigation and card-name casing. Write labels with this casing in source rather than applying a global text transform.

Mobile/tablet menu uses an independent brown surface with a 12px downward fade-in over 280ms, and links rising 8px with 35ms stagger. The header stays stationary. Close, Escape and section links share a 200ms upward fade before dismissing, preserving the icon twist. Scroll lock and focus trapping remain until dismissal; navigation follows cleanup. Reduced motion skips transitions. Cancel animations during cleanup.

Desktop creator layout retains its 5/7 column split with zero repeated grid gaps. Space between portrait and copy comes from fluid copy padding (space-6 to space-20); panel padding scales from space-8 to space-16. Copy has min-width: 0 and can wrap long words, keeping text inside the panel at narrow desktop widths.

Mobile/tablet About panel has equal space-24 (6rem / 96px at default root size) gaps above and below, measured from the neighboring Popular/footer scallop tips to the creator panel border. Its block margins include fitted scallop depth minus the existing .125rem seam overlap. Desktop retains its 14rem margins.

Tablet About layout (768–1023px) places the portrait and left-aligned creator title in a 50/50 row (four columns each). The divider, bio paragraphs and contact actions span all eight columns underneath. The generic copy wrapper uses display: contents on tablet so the single title can participate in the panel grid; desktop restores display: block and its existing 5/7 split. Mobile remains stacked.

## About page
The approved /about page reuses components/Creator.tsx with the same content, styling, tablet 50/50 portrait/title row, full-width tablet bio/actions, and generous spacing. Its creator heading is h1; the homepage keeps h2. Header, announcement, footer, cursor and existing reduced-motion-aware animation are shared. About Me links to /about and is marked aria-current=page there; Home, The Shelf and Say Hello return to homepage anchors. Links use native document navigation, including menu dismissal before changing pages; no routing dependency is added. Brand and footer home links work from both pages. Contact Me remains mailto until a future Say Hello page is approved; do not link the creator section to About. About CSS lives in styles/pages/about.css. About PDFs need not be read: the user explicitly approved reuse of the homepage panel instead. Static deployment will need a fallback to index.html for direct /about loads; hosting remains deferred. Skip build and responsive checks unless asked.

Shared creator styling now lives in styles/components/creator.css, preserving its existing responsive rules. Home-only hero animation is gated by the presence of hero content. Homepage anchor destinations are focused and scrolled to after React mounts when returning from /about.

About page panel top spacing is reduced to clamp(space-12, 6vw, space-24), ranging from 3rem to 6rem. Bottom spacing retains the existing generous clamp(space-24, 12vw, 14rem). Homepage spacing is unchanged.

The hero “Good Things Grow Slowly” petal tag enters after the photo cards begin appearing: 400ms delay, 650ms ease-out from 85% scale, transparent and -22deg rotation to its CSS-defined position/tilt. Clear temporary transforms on completion and keep this entrance inside the existing reduced-motion guard.

All pages use the standalone rounded yellow header panel, owned by Header and styles/components/header.css. App renders it once above main; Home no longer nests it inside the hero. The header background carries the same subtle grid tokens as the hero, clipped to the rounded panel via its own pointer-transparent pseudo-element. PanelPatterns fits its grid size alongside other panels, so the pattern matches at mobile, tablet and desktop widths. Preserve the separate mobile menu, navigation behavior and hero grid/scallops. Future pages inherit this shared shell.

About page flower placement follows desktop-About.pdf and mobile-About.pdf: flower-4 at the lower-right creator-panel edge on every size; flower-1 at the lower-left on tablet/desktop and hidden on mobile. Use original SVG colors, with flower-1 rotated 45deg clockwise and flower-4 rotated 45deg counterclockwise so their heads lean inward and stems exit toward the viewport edges. Desktop bottom offset is -space-20; mobile/tablet retain -space-10/-space-16. Anchor decorations to viewport edges with page-cap compensation, match homepage flower widths (left/purple 4.5rem mobile and 10rem from 768px; right/pink 4rem mobile and 9rem from 768px), and keep them pointer-transparent and decorative. Flowers render in the shared Creator on both Home and About, with purple at lower-left and pink at lower-right; mobile shows pink only. Their shared styles live in components/creator.css. Existing homepage category flowers remain unchanged. User authorized reading the PDFs specifically for flower placement; other page styling retains the approved implementation.

On Home only, Header remains a separate sibling before main but overlays the hero panel at its top, across mobile/tablet/desktop. Its standalone background layer is suppressed so the hero’s masked yellow grid runs continuously behind the header. PanelPatterns measures the actual header height via ResizeObserver and reserves that height as hero top padding; existing hero-content spacing and bottom scallops remain intact. The home frame contains margins with flow-root and anchors the absolute header. About and future non-home pages retain the standalone rounded gridded header. This supersedes the earlier visually separated Home header treatment; no sticky or fixed navigation is introduced.

Banner and header now share StickyHeader: pinned as one unit on every page and size, visible on downward scroll, sliding upward out of view on upward scroll after .5rem cumulative directional movement. Always show at the top, during menu use and keyboard focus. A measured spacer prevents layout jumps; Home reserves only announcement space so its separate header still overlays the hero. Its transparent background at the top becomes the shared rounded yellow grid when scrolled. About reserves the complete shell height. ResizeObserver updates spacing and anchor clearance; passive scroll handlers are animation-frame batched and cleaned up. Reduced motion removes transitions. This replaces previous non-sticky navigation guidance. No build or responsive checks requested.

About page uses the Vanilla-300 semantic surface token for the full body background, including outer gutters. Its creator panel retains the cream page surface. This is scoped to About in pages/about.css.

The outer sticky header shell and frame remain transparent, including while scrolled. Only the orange announcement and rounded yellow gridded header panel paint backgrounds. Preserve existing scroll-direction visibility behavior.

About background carries the header’s grid line token and measured cell size/origin across the full viewport. Its background is fixed to align with the sticky header at rest; PanelPatterns updates alignment on resize and cleans up body properties. Creator and footer surfaces remain solid.

Sticky header behavior is temporarily disabled via StickyHeader’s enabled prop (default false). Preserve the implementation for reactivation with enabled=true. The header scrolls with the document; its measured spacer retains the Home hero overlay and About layout. Disabled mode installs no scroll listeners and reserves no sticky anchor clearance. About grid scrolls with the page and retains header alignment; enabled mode restores fixed grid alignment.

## Say Hello page
/say-hello follows desktop-Contact.pdf and mobile-Contact.pdf. Desktop uses left-aligned text beside the flower illustration and the cream full-page grid; mobile/tablet stack and center text, Instagram button and illustration on a plain background. Direct WhatsApp, Facebook, TikTok and email links sit beneath an orange separator. Instagram keeps @cozyclay.np. Desktop-only flower-1 and flower-4 decorate viewport edges near the footer. Reuse the existing shell, header configuration, footer, cursor and reduced-motion-aware reveal style; do not change unrelated header settings. Say Hello navigation and both creator Contact Me buttons link to /say-hello. Share the SitePage type for routing/navigation. Copy is typed local content: approved corrections include Let’s, the second “have” in lowercase, WhatsApp and TikTok. Retain existing contact destinations, discount announcement and copyright pending owner updates. The shared footer already says From my desk.

Preserve public/assets/asset/flowers.svg as a copy of the original Downloads asset. flowers-once.svg is a documented derivative: original 10-second CSS keyframes, one iteration, hold the final state. Mount it when its reserved aspect-ratio box first enters view (15% intersection) so mobile users see the animation; never replay it on scrolling back. Its internal reduced-motion media query jumps to the final state and pauses. No form, backend, new animation library or looping animation. Asset provenance is recorded in asset-manifest.json. Styles belong to styles/pages/say-hello.css. User requested skipping build and responsive checks.

Header and mobile-menu brand links from other pages navigate to / without a fragment, loading the homepage at its top instead of scrolling to #home. Homepage brand behavior remains unchanged.

Say Hello desktop side flowers use the Home reference scale: flower-1 is 10rem wide with a 45deg tilt, flower-4 is 9rem wide with a -45deg tilt. Both sit 3.5rem above the section bottom and extend 1.5rem beyond the viewport edge, with page-cap compensation. Shared flower-side size tokens preserve Home’s existing sizes. Mobile/tablet visibility remains unchanged; the animated hero illustration is unchanged.

All brand links and resolved Home navigation links use the canonical / route on every page, including Home itself. Do not use #home or /#home for these destinations; those fragments trigger hero scrolling. Preserve #shelf and other intentional section anchors and their existing handling. This supersedes the earlier unchanged homepage-brand behavior.

All social links, including WhatsApp and the Instagram ShapeButton, open in a new tab with rel=noopener noreferrer across pages and footer. Internal navigation and email links retain their existing behavior. ShapeButton exposes an optional newTab prop for this purpose.
