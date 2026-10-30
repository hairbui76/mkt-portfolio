// The three held moments of the page, built on the shared stage (stage.js).
// Each one's finished composition is plain CSS: reduced motion, no script and the phone see that.
(() => {
  const S = window.Scenes = window.Scenes || {};

  // Hero: the sentence holds while the reel of work advances through the frame, one step at a time.
  S.reel = (root, o = {}) => Stage.scene(root, {
    hold: o.hold ?? 1.6,
    scrub: true,
    phone: 'rest',
    beats: 4,
    build(tl, { q }) {
      // each object leaves upward with a turn, the next rises in and settles at its own angle
      const items = q('.reel__item');
      const turn = items.map((el) => parseFloat(el.style.getPropertyValue('--r')) || 0);
      for (let i = 1; i < items.length; i++) {
        const at = 0.25 * i - 0.1;
        tl.to(items[i - 1], { yPercent: -28, rotation: turn[i - 1] - 14, scale: 0.78, autoAlpha: 0, duration: 0.13, ease: 'power2.in' }, at)
          .fromTo(items[i], { yPercent: 34, rotation: turn[i] + 16, scale: 0.72, autoAlpha: 0 },
            { yPercent: 0, rotation: turn[i], scale: 1, autoAlpha: 1, duration: 0.16, ease: 'power3.out' }, at + 0.05);
      }
    },
  });

  // ĐỒNG: the heading leaves first, then five cards cross the brand's green from right to left.
  S.cards = (root, o = {}) => Stage.scene(root, {
    hold: o.hold ?? 2,
    scrub: true,
    phone: 'rest',
    build(tl, { q }) {
      const track = q('.cards')[0];
      const intro = q('.dong__intro')[0];
      const card = q('.card')[0];
      const startX = () => innerWidth * 0.48;
      const endX = () => innerWidth / 2 - (track.scrollWidth - card.offsetWidth / 2);
      tl.to(intro, { xPercent: -35, autoAlpha: 0, duration: 0.14, ease: 'power1.in' }, 0)
        .fromTo(track, { x: startX }, { x: endX, duration: 0.9, ease: 'none' }, 0.06);
    },
  });

  // The ferryman scarf: three pictures rise from the bottom edge, the centre one growing as it comes.
  S.rise = (root, o = {}) => Stage.scene(root, {
    hold: o.hold ?? 1,
    scrub: true,
    phone: 'rest',
    build(tl, { q }) {
      const mid = q('.scarf__mid')[0];
      const sides = q('.scarf__side');
      tl.fromTo(mid, { yPercent: 48, scale: 0.82, transformOrigin: '50% 0%' }, { yPercent: 0, scale: 1, duration: 0.85, ease: 'none' }, 0)
        .fromTo(sides[0], { yPercent: 62 }, { yPercent: 0, duration: 0.85, ease: 'none' }, 0)
        .fromTo(sides[1], { yPercent: 78 }, { yPercent: 0, duration: 0.85, ease: 'none' }, 0);
    },
  });
})();
