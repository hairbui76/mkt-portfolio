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

    // 7. Cutouts. The Phỗng Đất cards deal out of a stack as the kit comes up the screen.
    const kit = document.querySelector('[data-deal]');
    if (kit) gsap.fromTo(kit, { '--deal': 0 }, { '--deal': 1, ease: 'none', scrollTrigger: { trigger: kit, start: 'top 85%', end: 'center 55%', scrub: true } });

    // 8. The Ninh Bình stamps drop onto the photograph's edge, one after another, once.
    const stamps = gsap.utils.toArray('[data-stamps] .stamp');
    if (stamps.length) gsap.from(stamps, {
      y: -180, rotation: (i) => [24, -20, 16][i % 3], autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.14,
      scrollTrigger: { trigger: '.block--c', start: 'top 62%', once: true },
    });

    // 9. The portrait rises a little out of the contact block as it comes into view.
    const me = document.querySelector('.contact__cutout');
    if (me) gsap.fromTo(me, { yPercent: 14 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.contact', start: 'top bottom', end: 'top 35%', scrub: true } });

    // 10. The hero object leans toward the pointer (fine pointers only).
    const stage = document.querySelector('.hero__reel');
    if (stage && matchMedia('(hover: hover) and (pointer: fine) and (min-width: 900px)').matches) {
      const qx = gsap.quickTo(stage, 'x', { duration: 0.8, ease: 'power3.out' });
      const qy = gsap.quickTo(stage, 'y', { duration: 0.8, ease: 'power3.out' });
      document.querySelector('.hero').addEventListener('pointermove', (e) => {
        qx((e.clientX / innerWidth - 0.5) * 28);
        qy((e.clientY / innerHeight - 0.5) * 20);
      });
    }

    // 6. The hero sentence's second half drifts a little left as the hero is left behind.
    const b = document.querySelector('.hero__half--b');
    if (b && matchMedia('(min-width: 900px)').matches) {
      gsap.to(b, { xPercent: 2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom bottom', scrub: true } });
    }
  });
})();
