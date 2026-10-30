(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasIO = 'IntersectionObserver' in window;

  // Scenes and weighted wheel scrolling (both off for reduced motion and touch inside stage.js).
  if (window.Stage) { Stage.smooth(); Stage.init(); }

  // In-page links go through Lenis when it runs, so they land where a held stage really is.
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || !window.Stage || !Stage.lenis) return;
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    Stage.lenis.scrollTo(target, { offset: 0 });
    history.pushState(null, '', a.getAttribute('href'));
  });

  // Reveals: once, when the element is 88% down the screen.
  // Clipped things (tiles, shutters) are watched through their parent, which is never clipped.
  const revealables = [...document.querySelectorAll('[data-reveal], [data-shutter]')];
  if (!hasIO || reduced) revealables.forEach((el) => el.classList.add('is-in'));
  else {
    const watched = new Map();
    revealables.forEach((el) => {
      const clipped = el.matches('[data-shutter], .tile');
      const target = clipped ? el.parentElement : el;
      if (!watched.has(target)) watched.set(target, []);
      watched.get(target).push(el);
    });
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { watched.get(e.target).forEach((el) => el.classList.add('is-in')); io.unobserve(e.target); }
    }, { rootMargin: '0px 0px -100px 0px', threshold: 0 });
    watched.forEach((_, target) => io.observe(target));
    // A jump past an element (a link, the End key) never makes it intersect: reveal whatever is already above.
    let queued = false;
    const sweep = () => {
      queued = false;
      for (const [target, els] of watched) {
        if (els[0].classList.contains('is-in')) continue;
        if (target.getBoundingClientRect().top < innerHeight) { els.forEach((el) => el.classList.add('is-in')); io.unobserve(target); }
      }
    };
    addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(sweep); } }, { passive: true });
  }

  // Lines that rise: split after the fonts load, reveal once, then give the plain text back.
  (() => {
    const els = [...document.querySelectorAll('[data-lines]')];
    if (!els.length || !hasIO || reduced || innerWidth < 900) return;
    const restore = (el) => { el.textContent = el.dataset.text; el.classList.remove('is-split', 'is-in'); };
    const split = (el) => {
      const text = el.textContent.trim().replace(/\s+/g, ' ');
      el.dataset.text = text;
      el.textContent = '';
      const words = text.split(' ').map((w) => { const s = document.createElement('span'); s.style.display = 'inline-block'; s.textContent = w; el.append(s, ' '); return s; });
      const lines = [];
      for (const w of words) {
        const last = lines.at(-1);
        if (last && Math.abs(last.top - w.offsetTop) < 4) last.words.push(w.textContent);
        else lines.push({ top: w.offsetTop, words: [w.textContent] });
      }
      el.textContent = '';
      lines.forEach((line, i) => {
        const mask = document.createElement('span');
        const inner = document.createElement('span');
        mask.className = 'line';
        inner.style.setProperty('--i', i);
        inner.textContent = line.words.join(' ');
        mask.append(inner);
        el.append(mask, ' ');
      });
      el.setAttribute('aria-label', text);
      el.classList.add('is-split');
    };
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        io.unobserve(e.target);
        e.target.classList.add('is-in');
        const last = e.target.querySelector('.line:last-of-type > span');
        if (last) last.addEventListener('transitionend', () => { restore(e.target); e.target.removeAttribute('aria-label'); }, { once: true });
      }
    }, { rootMargin: '0px 0px -100px 0px' });
    document.fonts.ready.then(() => els.forEach((el) => { split(el); io.observe(el); }));
    let width = innerWidth;
    addEventListener('resize', () => {
      if (innerWidth === width) return;
      width = innerWidth;
      els.filter((el) => el.matches('.is-split:not(.is-in)')).forEach((el) => { io.unobserve(el); restore(el); });
    });
  })();

  // Rolling figures: each digit rolls up to its value once; the real number stays for screen readers.
  (() => {
    const els = [...document.querySelectorAll('[data-roll]')];
    if (!els.length || reduced || !hasIO) return;
    els.forEach((el) => {
      const value = el.textContent.trim();
      const said = Object.assign(document.createElement('span'), { className: 'sr-only', textContent: value });
      const shown = Object.assign(document.createElement('span'), { className: 'roll__digits' });
      shown.setAttribute('aria-hidden', 'true');
      let i = 0;
      for (const ch of value) {
        if (!/\d/.test(ch)) { shown.append(ch); continue; }
        const col = Object.assign(document.createElement('span'), { className: 'roll__col' });
        const strip = Object.assign(document.createElement('span'), { className: 'roll__strip' });
        strip.style.setProperty('--d', ch);
        strip.style.setProperty('--i', i++);
                col.append(strip);
        shown.append(col);
      }
      el.classList.add('roll');
      el.replaceChildren(said, shown);
    });
    // Each column is as wide as its own final digit, so a 1 does not leave a gap the width of a 0.
    const fit = () => els.forEach((el) => {
      const fs = parseFloat(getComputedStyle(el).fontSize);
      const probe = document.createElement('span');
      probe.style.cssText = 'position:absolute;visibility:hidden;white-space:pre;font:inherit;';
      el.append(probe);
      el.querySelectorAll('.roll__strip').forEach((strip) => {
        probe.textContent = strip.style.getPropertyValue('--d');
        strip.parentElement.style.width = (probe.getBoundingClientRect().width / fs) + 'em';
      });
      probe.remove();
    });
    document.fonts.ready.then(fit);
    // the digits roll when their tile opens (the tile's reveal adds .is-in)
  })();

  // Social content index: one frame level with the row being pointed at or focused.
  (() => {
    const root = document.querySelector('.index');
    if (!root) return;
    const frame = root.querySelector('.index__frame');
    const picture = frame.querySelector('img');
    const fine = matchMedia('(hover: hover) and (pointer: fine) and (min-width: 900px)');
    let warmed = false;
    const show = (item) => {
      if (!fine.matches) return;
      if (!warmed) { warmed = true; root.querySelectorAll('[data-preview]').forEach((li) => { new Image().src = li.dataset.preview; }); }
      picture.src = item.dataset.preview;
      const row = item.querySelector('.index__row');
      const top = row.offsetTop + row.offsetHeight / 2 - frame.offsetHeight / 2; // the row's offsetParent is the section
      const max = root.offsetHeight - frame.offsetHeight - 40;
      const opening = !frame.classList.contains('is-open');
      if (opening) frame.style.transitionProperty = 'clip-path';
      const min = root.querySelector('.index__list').offsetTop;
      frame.style.transform = `translateY(${Math.min(max, Math.max(min, top))}px)`;
      if (opening) { frame.getBoundingClientRect(); frame.style.transitionProperty = ''; }
      frame.classList.add('is-open');
    };
    const hide = () => frame.classList.remove('is-open');
    root.querySelectorAll('.index__item').forEach((item) => {
      const row = item.querySelector('.index__row');
      row.addEventListener('pointerenter', () => show(item));
      row.addEventListener('focus', () => show(item));
      item.querySelector('details').addEventListener('toggle', () => show(item));
    });
    // At rest the frame shows the first piece, so the right side of the section is never empty.
    const first = root.querySelector('.index__item');
    const rest = () => (fine.matches ? show(first) : hide());
    root.querySelector('.index__list').addEventListener('pointerleave', rest);
    root.addEventListener('focusout', (e) => { if (!root.contains(e.relatedTarget)) rest(); });
    if (document.readyState === 'complete') rest(); else addEventListener('load', rest);
  })();

  // The live thing: nine zodiac scarves. Rows open on tap, hover-free; the year finder picks yours.
  (() => {
    const root = document.querySelector('.zodiac');
    if (!root) return;
    const rows = [...root.querySelectorAll('.zrow')];
    const pics = [...root.querySelectorAll('.zodiac__frame img')];
    const cap = root.querySelector('.zodiac__cap');
    const result = root.querySelector('.finder__result');
    const form = root.querySelector('.finder');
    const input = root.querySelector('#year');
    const animals = [
      ['ty', 'Tý', 'rat'], ['suu', 'Sửu', 'buffalo'], ['dan', 'Dần', 'tiger'], ['mao', 'Mão', 'cat'],
      ['thin', 'Thìn', 'dragon'], ['ti', 'Tỵ', 'snake'], ['ngo', 'Ngọ', 'horse'], ['mui', 'Mùi', 'goat'],
      ['than', 'Thân', 'monkey'], ['dau', 'Dậu', 'rooster'], ['tuat', 'Tuất', 'dog'], ['hoi', 'Hợi', 'pig'],
    ];
    const capFor = (row) => {
      const name = row.querySelector('.zrow__name').textContent;
      const meta = row.querySelector('.zrow__meta').textContent.split(',')[0];
      return `${name}, the ${meta}`;
    };
    const activate = (key) => {
      rows.forEach((r) => r.setAttribute('aria-expanded', String(r.dataset.key === key)));
      pics.forEach((p) => p.classList.toggle('is-on', p.dataset.key === key));
      const row = rows.find((r) => r.dataset.key === key);
      cap.textContent = row ? capFor(row) : 'The ngoại án screen, Huế';
    };
    rows.forEach((r) => r.addEventListener('click', () => {
      const open = r.getAttribute('aria-expanded') === 'true';
      activate(open ? 'screen' : r.dataset.key);
    }));
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const y = Number((input.value.match(/\d{4}/) || [])[0]);
      if (!y || y < 1900 || y > 2100) { result.textContent = 'Type a year with four digits, like 1998.'; return; }
      const [key, name, animal] = animals[(((y - 4) % 12) + 12) % 12];
      const row = rows.find((r) => r.dataset.key === key);
      if (!row) {
        result.textContent = `${y} is the year of ${name}, the ${animal}. Tỵ, Dậu and Sửu make up the metal triad, which is not among these nine scarves.`;
        activate('screen');
        return;
      }
      const triad = row.closest('.triad').querySelector('.triad__name').textContent.toLowerCase();
      const blessing = row.querySelector('.zrow__meta').textContent.split(', ')[1];
      result.textContent = `${y} is the year of ${name}, the ${animal}: ${triad}, ${blessing}.`;
      activate(key);
      const top = row.getBoundingClientRect().top;
      if (top < 0 || top > innerHeight * 0.8) {
        if (window.Stage && Stage.lenis) Stage.lenis.scrollTo(row, { offset: -innerHeight * 0.4 });
        else row.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' });
      }
    });
    // Picture follows the row passing the middle of the screen, on wide screens only.
    const wide = matchMedia('(min-width: 900px)');
    if (hasIO) {
      let touched = false;
      form.addEventListener('submit', () => { touched = true; });
      rows.forEach((r) => r.addEventListener('click', () => { touched = true; }));
      const io = new IntersectionObserver((entries) => {
        if (touched || !wide.matches) return;
        for (const e of entries) if (e.isIntersecting) activate(e.target.dataset.key);
      }, { rootMargin: '-46% 0px -46% 0px' });
      rows.forEach((r) => io.observe(r));
    }
  })();
})();
