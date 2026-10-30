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

## Motion

GSAP 3.15 with ScrollTrigger and SplitText, all in `vendor/`. Visitors who ask for reduced motion see the finished layout.

- **Hero:** the headline rises letter by letter on load. The two halves then hold while four pieces of work advance through the frame.
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
