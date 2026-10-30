# Vũ Huyền My, portfolio site

A one-page site, plain HTML, CSS and JavaScript. No build step.

- Open `index.html` in a browser, or serve the folder (for example `npx serve site`).
- Fonts (Fraunces, Montserrat, with Vietnamese) and GSAP, ScrollTrigger and Lenis are inside the folder, so it works offline.
- `img/<project>/` holds the pictures, converted to WebP from `../assets/`. To use a sharper original, save it as WebP under the same file name and the page picks it up. Update `width` and `height` in `index.html` if the proportions change.

## Before publishing

- The ĐỒNG campaign photos came out of the Canva PDF at about 256×320 px, so they are kept small. Swap in the shoot originals and the cards in "Marketing ĐỒNG" can grow.
- The English glosses of the nine zodiac blessings (steady, buoyant, faithful…) are my translations: check them.
- Year ranges in "About" are shortened from the deck (for example 09.2025–09.2026 → 2025–2026).

## Look

The page reads as a run of posters: each chapter is one full field of the deck's colours (red, green, mustard, paper), with the type set at poster size. The bar at the top takes the colour of the chapter under it and steps aside while you scroll down.

The order follows the deck: the cover ("Hello, I'm My" with her portrait), About, then the four chapters, 01 Social media, 02 Product development, 03 Branding and 04 Film and video, and the Thank you. Each chapter opens like the deck's divider slides, the number outlined and the chapter's words repeating behind.

## Cutouts

`img/cutouts/` holds the products cut out of their backgrounds, as WebP with transparency.

- **Kept from the Canva PDF:** the scarves, the Phỗng Đất cards and board, the logo sticker and My's portrait already had their background removed there.
- **Cut with rembg (isnet-general-use):** the Phỗng Đất kit and the three Ninh Bình stamps.
- **Shadows:** the soft drop shadows from the mockups were trimmed off, so each object sits flat on its colour field.

Where they are used:
- the fan of products that opens Product development;
- the zodiac table, where the chosen scarf turns straight and comes forward;
- the kit standing out of a mustard block with its cards fanned behind;
- the stamps landing across the Ninh Bình photograph;
- My's portrait on the cover.

## Feedback (Agentation)

Open the page with `?feedback` (for example `…/index.html?feedback`) to get the Agentation toolbar.

How a reviewer uses it:
1. Click an element and write a note.
2. Press Copy and send the markdown to whoever edits the site.

Notes stay in the reviewer's browser; nothing is sent anywhere.

Without `?feedback` the 580 KB bundle is never downloaded. To rebuild the bundle, run `npm install && npm run build` in `tools/agentation/`; it writes `site/feedback/agentation.js`. Agentation is licensed under PolyForm Shield 1.0.0.

## Motion

GSAP 3.15 with ScrollTrigger and SplitText, all in `vendor/`. Visitors who ask for reduced motion see the finished layout.

- **Cover:** "Hello, I'm My" rises letter by letter on load and My rises into the frame.
- **Product development:** when the chapter arrives, five products deal out of one stack into a fan. Pointing at a product (or tabbing to it) lifts it, straightens it and brings it to the middle of the fan at a readable size.
- **Marketing ĐỒNG:** the heading leaves, then five cards cross the green.
- **Headings:**
  - The chapter titles, "Organic reach", "The ferryman scarf", "Nine zodiac scarves", "Ninh Bình" and "Repositioning ĐỒNG" rise letter by letter.
  - The later chapter headings slide in with the scroll.
- **Organic reach:** the figures roll up to their values.
- **The ferryman scarf:** the pictures show under the text from the start; the text then makes way and the three pictures rise until the whole scarf fills the screen.
- **Smaller moves:**
  - the project pictures open like shutters;
  - the "Social content" list shows a preview beside the row you point at;
  - the zodiac picture changes with the row and with the year you type.

## Search and sharing

- **Head:** title, description, canonical `https://vhmy.github.io/`, Open Graph and Twitter cards, favicon, theme colour.
- **Structured data:** one JSON-LD graph in `index.html` with `WebSite`, `ProfilePage` and `Person` (job, Hà Nội, ĐỒNG, the two universities, LinkedIn). Update `dateModified` and the Person block when her role changes.
- **Share card:** `img/share/og.jpg` (1200×630), her name beside the fanned products. Rebuild it if the hero products change.
- **Crawlers:** `robots.txt` (keeps `/feedback/` out) and `sitemap.xml` (one page plus its main images; update `lastmod` when the content changes).
- **404.html:** GitHub Pages serves it for any missing path; it is `noindex`.

- **Keywords:** the name in all its spellings (Vũ Huyền My, Vu Huyen My, Huyền My), the role (creative, brand and product marketing; brand strategy; social media; product development), the place (Hà Nội, Vietnam) and the project names (ĐỒNG, Người Lái Đò, Phỗng Đất, Ninh Bình). Each is said once where it belongs: the title, the description, the cover sentence, About, the chapter titles and the one Vietnamese sentence in the footer. Don't add more by repetition; the outline words behind the chapter openers are drawn from an attribute so they don't count as text.
- **Search Console:** the property is verified with the `google-site-verification` tag in the `<head>`; keep it there.

After a deploy, add the site to Google Search Console (URL-prefix property `https://vhmy.github.io/`, verify with the HTML-tag method in the `<head>`) and submit `sitemap.xml`.
