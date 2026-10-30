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

  // 3a. Pointing at a hero product brings it to the middle of the fan. CSS does the move; this measures it.
  const fanBox = document.querySelector('.fan');
  if (fanBox) {
    const aim = (li) => {
      const fx = fanBox.offsetWidth, fy = fanBox.offsetHeight;
      const x = li.offsetLeft, y = li.offsetTop; // the slot's centre (translate -50% puts it there)
      const w = li.offsetWidth, h = li.offsetHeight;
      li.style.setProperty('--dx', `${fx / 2 - x}px`);
      li.style.setProperty('--dy', `${fy / 2 - y}px`);
      li.style.setProperty('--s', Math.max(1.15, Math.min((fx * 0.7) / w, (fy * 0.9) / h)).toFixed(3));
    };
    fanBox.querySelectorAll('.fan__item').forEach((li) => {
      li.addEventListener('pointerenter', () => aim(li));
      li.addEventListener('focus', () => aim(li));
    });
  }

  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    // 3b. On load the products deal out of one stack into their fan (the pictures, not their slots, move).
    const fan = document.querySelector('.fan');
    if (fan) {
      const imgs = gsap.utils.toArray('.fan__item img');
      const box = fan.getBoundingClientRect();
      gsap.from(imgs, {
        x: (i, el) => { const r = el.getBoundingClientRect(); return box.left + box.width / 2 - (r.left + r.width / 2); },
        y: (i, el) => { const r = el.getBoundingClientRect(); return box.top + box.height / 2 - (r.top + r.height / 2); },
        rotation: (i) => [-24, 20, 0, -30, 12][i % 5],
        scale: 0.55,
        autoAlpha: 0,
        duration: 0.8,
        ease: 'expo.out',
        stagger: 0.06,
        delay: 0.2,
      });
    }

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

  });
})();
