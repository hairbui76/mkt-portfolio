// The three held moments of the page, built on the shared stage (stage.js).
// Each one's finished composition is plain CSS: reduced motion, no script and the phone see that.
(() => {
  const S = window.Scenes = window.Scenes || {};

  // Hero: the sentence holds while the fanned products spread a little further and lift, each at its own depth.
  S.fan = (root, o = {}) => Stage.scene(root, {
    hold: o.hold ?? 0.7,
    scrub: true,
    phone: 'rest',
    build(tl, { q }) {
      const box = q('.fan')[0];
      q('.fan__item').forEach((el, i) => {
        const x = parseFloat(el.style.getPropertyValue('--x')) / 100 - 0.5;
        const y = parseFloat(el.style.getPropertyValue('--y')) / 100 - 0.5;
        const depth = [0.7, 0.9, 0.35, 1, 0.8][i % 5];
        tl.to(el, {
          x: () => x * box.offsetWidth * (x < 0 ? 0.12 : 0.02) * depth, // the right-hand pieces already touch the edge
          y: () => (y * 0.25 - 0.1) * box.offsetHeight * depth,
          rotation: `+=${(x < 0 ? -7 : 3) * depth}`,
          scale: 1 + 0.06 * depth,
          duration: 1,
          ease: 'none',
        }, 0);
      });
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
