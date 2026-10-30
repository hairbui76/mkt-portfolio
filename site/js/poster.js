// The poster layer: the bar follows the chapter colour, chapter headings arrive letter by letter or slide in
// with the scroll, and the reach figures roll when their chapter arrives. GSAP + ScrollTrigger + SplitText.
(() => {
  const bar = document.querySelector('.bar');
  const reach = document.querySelector('.reach');
  const chapters = [...document.querySelectorAll('[data-ch]:not(.bar)')];

  // Without GSAP the page still reads: the bar stays red, the figures sit at their values.
  if (!window.gsap || !window.ScrollTrigger) { if (reach) reach.classList.add('is-in'); return; }
  gsap.registerPlugin(ScrollTrigger);
  if (window.SplitText) gsap.registerPlugin(SplitText);

  // 1. The bar takes the colour of whichever chapter is under it (a hard cut, 300ms on the bar only).
  chapters.forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: () => `top ${bar.offsetHeight / 2}px`,
      end: () => `bottom ${bar.offsetHeight / 2}px`,
      onToggle: (self) => { if (self.isActive) bar.dataset.ch = el.dataset.ch; },
    });
  });

  // 2. The bar steps aside while reading down and comes back on the way up.
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      const away = self.direction === 1 && self.scroll() > window.innerHeight * 0.6;
      bar.classList.toggle('is-away', away && !bar.contains(document.activeElement));
    },
  });
  bar.addEventListener('focusin', () => bar.classList.remove('is-away'));

  // 3. The reach figures roll once, when the chapter is a quarter into view.
  if (reach) ScrollTrigger.create({ trigger: reach, start: 'top 75%', once: true, onEnter: () => reach.classList.add('is-in') });

  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    // 4. Chapter headings marked data-split rise letter by letter out of their line, once.
    if (window.SplitText) {
      document.fonts.ready.then(() => {
        document.querySelectorAll('.head[data-split]').forEach((el) => {
          SplitText.create(el, {
            type: 'lines, chars',
            linesClass: 'split-line',
            mask: 'lines',
            autoSplit: true,
            onSplit: (self) => gsap.from(self.chars, {
              yPercent: 115,
              duration: 0.9,
              ease: 'expo.out',
              stagger: 0.022,
              scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            }),
          });
        });
        ScrollTrigger.refresh();
      });
    }

    // 5. Headings marked data-push slide in from the right as they come up the screen, locked to the scroll.
    document.querySelectorAll('.head[data-push]').forEach((el) => {
      gsap.fromTo(el, { xPercent: 9 }, {
        xPercent: 0,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 45%', scrub: true },
      });
    });

    // 6. The hero sentence's second half drifts a little left as the hero is left behind.
    const b = document.querySelector('.hero__half--b');
    if (b && matchMedia('(min-width: 900px)').matches) {
      gsap.to(b, { xPercent: 2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom bottom', scrub: true } });
    }
  });
})();
