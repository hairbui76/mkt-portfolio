// The two held moments of the page, built on the shared stage (stage.js).
// Each one's finished composition is plain CSS: reduced motion, no script and the phone see that.
(() => {
  const S = window.Scenes = window.Scenes || {};

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

  // The ferryman scarf: the pictures already show under the text; as the scroll goes on the text makes way
  // and the three pictures rise until the whole scarf fills the screen, the centre one growing as it comes.
  S.rise = (root, o = {}) => Stage.scene(root, {
    hold: o.hold ?? 1,
    scrub: true,
    phone: 'rest',
    build(tl, { q }) {
      const text = q('.scarf__text')[0];
      const pics = q('.scarf__pics')[0];
      const mid = q('.scarf__mid')[0];
      const sides = q('.scarf__side');
      const lift = () => text.offsetHeight + 40;
      tl.to(text, { y: () => -lift() * 0.5, autoAlpha: 0, duration: 0.55, ease: 'power1.in' }, 0.1)
        .fromTo(pics, { y: 0 }, { y: () => -lift(), duration: 0.8, ease: 'power1.inOut' }, 0.1)
        .fromTo(mid, { scale: 0.86, transformOrigin: '50% 0%' }, { scale: 1, duration: 0.8, ease: 'power1.inOut' }, 0.1)
        .fromTo(sides[0], { yPercent: 14 }, { yPercent: 0, duration: 0.8, ease: 'power1.inOut' }, 0.1)
        .fromTo(sides[1], { yPercent: 24 }, { yPercent: 0, duration: 0.8, ease: 'power1.inOut' }, 0.1);
    },
  });
})();
