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

## Cutouts

`img/cutouts/` holds the products cut out of their backgrounds, as WebP with transparency.

- **Kept from the Canva PDF:** the scarves, the Phỗng Đất cards and board, the logo sticker and My's portrait already had their background removed there.
- **Cut with rembg (isnet-general-use):** the Phỗng Đất kit and the three Ninh Bình stamps.
- **Shadows:** the soft drop shadows from the mockups were trimmed off, so each object sits flat on its colour field.

Where they are used:
- the fan of products in the hero;
- the zodiac table, where the chosen scarf turns straight and comes forward;
- the kit standing out of a mustard block with its cards fanned behind;
- the stamps landing across the Ninh Bình photograph;
- the portrait rising out of the contact block.

## Feedback (Agentation)

Open the page with `?feedback` (for example `…/index.html?feedback`) to get the Agentation toolbar.

How a reviewer uses it:
1. Click an element and write a note.
2. Press Copy and send the markdown to whoever edits the site.

Notes stay in the reviewer's browser; nothing is sent anywhere.

Without `?feedback` the 580 KB bundle is never downloaded. To rebuild the bundle, run `npm install && npm run build` in `tools/agentation/`; it writes `site/feedback/agentation.js`. Agentation is licensed under PolyForm Shield 1.0.0.

## Motion

GSAP 3.15 with ScrollTrigger and SplitText, all in `vendor/`. Visitors who ask for reduced motion see the finished layout.

- **Hero:** the headline rises letter by letter on load while five products deal out of one stack into a fan. The two halves then hold while the fan spreads a little and lifts, each piece at its own depth.
- **Marketing ĐỒNG:** the heading leaves, then five cards cross the green.
- **Headings:**
  - "Organic reach", "Repositioning ĐỒNG", "The ferryman scarf" and "Nine zodiac scarves" rise letter by letter.
  - The later chapter headings slide in with the scroll.
- **Organic reach:** the figures roll up to their values.
- **The ferryman scarf:** three pictures rise from the bottom and the centre one grows.
- **Smaller moves:**
  - the project pictures open like shutters;
  - the "Social content" list shows a preview beside the row you point at;
  - the zodiac picture changes with the row and with the year you type.
