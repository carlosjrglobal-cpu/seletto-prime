/* SELETTO PRIME — interações */
(() => {
  const doc = document.documentElement;
  doc.classList.add('js');
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const WA = document.body.dataset.wa;
  const waLink = (msg) => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- header ---------- */
  const hdr = $('.hdr');
  if (hdr && !hdr.classList.contains('hdr--solid')) {
    const onScroll = () => hdr.classList.toggle('is-solid', scrollY > 40);
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });
  }

  // mega menu (clique para toque/teclado; hover via CSS)
  const mega = $('.has-mega');
  if (mega) {
    const btn = $('button', mega);
    const set = (open) => { mega.classList.toggle('is-open', open); btn.setAttribute('aria-expanded', open); };
    btn.addEventListener('click', (e) => { e.stopPropagation(); set(!mega.classList.contains('is-open')); });
    document.addEventListener('click', (e) => { if (!mega.contains(e.target)) set(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
    mega.addEventListener('mouseleave', () => set(false));
  }

  // menu mobile
  const mnav = $('#mnav');
  const burger = $('.hdr__burger');
  if (mnav && burger) {
    const open = () => { mnav.classList.add('is-open'); burger.setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden'; $('.mnav__close', mnav).focus(); };
    const close = () => { mnav.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; burger.focus(); };
    burger.addEventListener('click', open);
    $('.mnav__close', mnav).addEventListener('click', close);
    mnav.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    $$('a', mnav).forEach((a) => a.addEventListener('click', () => { mnav.classList.remove('is-open'); document.body.style.overflow = ''; }));
  }

  /* ---------- reveal ---------- */
  const rv = $$('.rv');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((ents) => ents.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    rv.forEach((el) => io.observe(el));
  } else rv.forEach((el) => el.classList.add('in'));

  /* ---------- hero slideshow ---------- */
  const slides = $$('.hero__slide');
  const dots = $$('.hero__dots button');
  if (slides.length > 1) {
    let i = 0; let t;
    const go = (n) => {
      slides[i].classList.remove('is-on'); dots[i].classList.remove('is-on'); dots[i].setAttribute('aria-selected', 'false');
      i = (n + slides.length) % slides.length;
      slides[i].classList.add('is-on');
      void dots[i].offsetWidth; // reinicia animação da barra
      dots[i].classList.add('is-on'); dots[i].setAttribute('aria-selected', 'true');
      const im = $('img', slides[(i + 1) % slides.length]); if (im) im.loading = 'eager';
    };
    const play = () => { clearInterval(t); if (!reduce) t = setInterval(() => go(i + 1), 6500); };
    dots.forEach((d, n) => d.addEventListener('click', () => { go(n); play(); }));
    document.addEventListener('visibilitychange', () => (document.hidden ? clearInterval(t) : play()));
    play();
  }

  /* ---------- comparador bilhar x jantar ---------- */
  $$('.compare').forEach((c) => {
    const r = $('input[type=range]', c);
    const set = (v) => c.style.setProperty('--pos', v + '%');
    r.addEventListener('input', () => set(r.value));
    set(r.value);
    // dica de interação: movimento suave na primeira vez que aparece
    if (!reduce && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(([en]) => {
        if (!en.isIntersecting) return; io.disconnect();
        let touched = false; r.addEventListener('pointerdown', () => (touched = true), { once: true });
        const seq = [50, 28, 72, 50]; let k = 0; const t0 = performance.now(); const dur = 900;
        const step = (now) => {
          if (touched) return;
          const p = Math.min(1, (now - t0 - k * dur) / dur);
          const e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
          const v = seq[k] + (seq[k + 1] - seq[k]) * e; set(v); r.value = v;
          if (p >= 1) k++;
          if (k < seq.length - 1) requestAnimationFrame(step);
        };
        setTimeout(() => requestAnimationFrame((n) => { requestAnimationFrame(step); }), 500);
      }, { threshold: 0.5 });
      io.observe(c);
    }
  });

  /* ---------- carrosséis ---------- */
  $$('[data-rail]').forEach((rail) => {
    const id = rail.dataset.rail;
    const nav = $(`[data-rail-nav="${id}"]`);
    const bar = $(`[data-rail-progress="${id}"] span`);
    const [prev, next] = nav ? $$('button', nav) : [];
    const upd = () => {
      const max = rail.scrollWidth - rail.clientWidth;
      if (prev) prev.disabled = rail.scrollLeft <= 4;
      if (next) next.disabled = rail.scrollLeft >= max - 4;
      if (bar) {
        const w = Math.max(8, (rail.clientWidth / rail.scrollWidth) * 100);
        bar.style.width = w + '%';
        bar.style.transform = `translateX(${max > 0 ? (rail.scrollLeft / max) * ((100 - w) / w) * 100 : 0}%)`;
      }
      if (nav) nav.style.visibility = max > 4 ? '' : 'hidden';
    };
    const card = () => (rail.firstElementChild?.getBoundingClientRect().width || 300) + 24;
    nav && $$('button', nav).forEach((b) => b.addEventListener('click', () => rail.scrollBy({ left: card() * +b.dataset.dir, behavior: reduce ? 'auto' : 'smooth' })));
    rail.addEventListener('scroll', upd, { passive: true });
    addEventListener('resize', upd);
    upd();
  });

  /* ---------- radiogroups (chips e swatches) ---------- */
  const pick = (group, btn, emit = true) => {
    $$('[role=radio]', group).forEach((b) => { const on = b === btn; b.setAttribute('aria-checked', on); b.tabIndex = on ? 0 : -1; });
    if (emit) group.dispatchEvent(new CustomEvent('pick', { detail: btn, bubbles: true }));
  };
  $$('[role=radiogroup]').forEach((g) => {
    g.addEventListener('click', (e) => { const b = e.target.closest('[role=radio]'); if (b) pick(g, b); });
    g.addEventListener('keydown', (e) => {
      const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
      if (!(e.key in keys)) return;
      e.preventDefault();
      const items = $$('[role=radio]', g);
      const cur = items.indexOf(document.activeElement);
      const nx = items[(cur + keys[e.key] + items.length) % items.length];
      pick(g, nx); nx.focus();
    });
  });
  const val = (scope, opt) => { const b = $(`[data-opt="${opt}"] [aria-checked="true"]`, scope); return b ? b.dataset.value : ''; };

  /* ---------- configurador (home) ---------- */
  const cfg = $('#cfg');
  if (cfg) {
    const svg = $('svg', cfg);
    const shade = (hex, k) => {
      const n = parseInt(hex.slice(1), 16); const f = (c) => Math.round(c * k);
      return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`;
    };
    const link = $('[data-wa-cfg]', cfg);
    const sync = () => {
      const fel = $('[data-opt="feltro"] [aria-checked="true"]', cfg);
      const ac = $('[data-opt="acabamento"] [aria-checked="true"]', cfg);
      $('.cfg__felt', svg).setAttribute('fill', fel.dataset.hex);
      $('.cfg__cushion', svg).setAttribute('fill', shade(fel.dataset.hex, 0.72));
      $('.cfg__frame', svg).setAttribute('fill', ac.dataset.hex);
      $('.cfg__wood', svg).setAttribute('opacity', ac.dataset.madeira === '1' ? '.22' : '0');
      const light = ['#ece9e3', '#d3c4ab'].includes(ac.dataset.hex);
      $('.cfg__dia', svg).setAttribute('fill', light ? '#8a7650' : '#d9c08a');
      $('[data-out="feltro"]', cfg).textContent = fel.dataset.value;
      $('[data-out="acabamento"]', cfg).textContent = ac.dataset.value;
      link.href = waLink(`Olá! Vim do site e montei esta combinação:\n• Cor do feltro: ${fel.dataset.value}\n• Acabamento: ${ac.dataset.value}\n• ${val(cfg, 'tecido')}\nGostaria de ajuda para escolher o modelo e receber um orçamento.`);
    };
    cfg.addEventListener('pick', sync);
    sync();
  }

  /* ---------- página do modelo ---------- */
  const pdp = $('[data-pdp]');
  if (pdp) {
    const main = $('[data-gal-main]', pdp);
    const mainImg = $('img', main);
    const thumbs = $$('.gal__thumbs button', pdp);
    const modes = $$('.gal__toggle button', pdp);
    const show = (src, alt, k) => {
      if (mainImg.getAttribute('src') === src) return;
      mainImg.classList.add('is-out');
      const pre = new Image(); pre.src = src;
      const swap = () => { mainImg.src = src; mainImg.alt = alt; mainImg.classList.remove('is-out'); };
      (pre.decode ? pre.decode() : Promise.resolve()).then(() => setTimeout(swap, 180), () => setTimeout(swap, 180));
      thumbs.forEach((t) => t.setAttribute('aria-current', t.dataset.k === k));
      modes.forEach((m) => m.setAttribute('aria-pressed', m.dataset.mode === k || (k === 'capa' && m.dataset.mode === 'bilhar')));
      main.dataset.k = k;
    };
    thumbs.forEach((t) => t.addEventListener('click', () => show(t.dataset.src, t.dataset.alt, t.dataset.k)));
    modes.forEach((m) => m.addEventListener('click', (e) => {
      e.stopPropagation();
      const t = thumbs.find((x) => x.dataset.k === m.dataset.mode);
      if (t) show(t.dataset.src, t.dataset.alt, t.dataset.k);
    }));
    const open = () => {
      const k = main.dataset.k || 'capa';
      const idx = Math.max(0, thumbs.findIndex((t) => t.dataset.k === k));
      openLB('modelo', idx);
    };
    $('[data-gal-expand]', pdp).addEventListener('click', (e) => { e.stopPropagation(); open(); });
    main.addEventListener('click', (e) => { if (!e.target.closest('button')) open(); });

    const link = $('[data-wa-pdp]', pdp);
    const price = $('[data-price]', pdp);
    const sync = () => {
      const tam = $('[data-opt="tamanho"] [aria-checked="true"]', pdp);
      const fel = val(pdp, 'feltro');
      $('[data-out="tamanho"]', pdp).textContent = tam.dataset.value;
      $('[data-out="feltro"]', pdp).textContent = fel || 'A definir';
      if (price && tam.dataset.preco) {
        price.textContent = tam.dataset.preco;
        const lbl = $('[data-price-label]', pdp);
        if (lbl) lbl.textContent = tam.dataset.value + ' —';
      }
      const linhas = [
        `Olá! Vim do site e gostaria de um orçamento:`,
        `• Modelo: ${pdp.dataset.modelo} (${pdp.dataset.linha})`,
        `• Tamanho: ${tam.dataset.value}`,
        `• Cor do feltro: ${fel || 'a definir'}`,
        `• ${val(pdp, 'tecido')}`,
      ];
      link.href = waLink(linhas.join('\n'));
    };
    pdp.addEventListener('pick', sync);
    sync();
  }

  /* ---------- catálogo: filtros e busca ---------- */
  const tabs = $$('.tab[data-filter]');
  if (tabs.length) {
    const groups = $$('[data-group]');
    const search = $('[data-search]');
    const empty = $('[data-empty]');
    const norm = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    let filtro = 'todas';
    const apply = () => {
      const q = norm(search.value.trim());
      let total = 0;
      groups.forEach((g) => {
        const okLine = filtro === 'todas' || g.dataset.group === filtro;
        let n = 0;
        $$('.mcard', g).forEach((c) => { const ok = okLine && (!q || norm(c.dataset.nome).includes(q)); c.hidden = !ok; if (ok) n++; });
        g.hidden = n === 0; total += n;
      });
      empty.hidden = total > 0;
      tabs.forEach((t) => t.setAttribute('aria-pressed', t.dataset.filter === filtro));
    };
    tabs.forEach((t) => t.addEventListener('click', () => {
      filtro = t.dataset.filter; apply();
      history.replaceState(null, '', filtro === 'todas' ? location.pathname : '#' + filtro);
      const first = groups.find((g) => !g.hidden);
      if (first && filtro !== 'todas') first.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    }));
    search.addEventListener('input', apply);
    const h = location.hash.slice(1);
    if (tabs.some((t) => t.dataset.filter === h)) { filtro = h; apply(); }
  }

  /* ---------- lightbox ---------- */
  let lb; let lbItems = []; let lbI = 0;
  const lbBuild = () => {
    lb = document.createElement('div');
    lb.className = 'lb'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Foto ampliada');
    lb.innerHTML = `<img class="lb__img" alt="">
      <button class="lb__btn lb__close" type="button" aria-label="Fechar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
      <button class="lb__btn lb__prev" type="button" aria-label="Foto anterior"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 12H5M11 6l-6 6 6 6"/></svg></button>
      <button class="lb__btn lb__next" type="button" aria-label="Próxima foto"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>
      <p class="lb__count" aria-live="polite"></p>`;
    document.body.appendChild(lb);
    $('.lb__close', lb).addEventListener('click', lbClose);
    $('.lb__prev', lb).addEventListener('click', () => lbGo(lbI - 1));
    $('.lb__next', lb).addEventListener('click', () => lbGo(lbI + 1));
    lb.addEventListener('click', (e) => { if (e.target === lb) lbClose(); });
    document.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') lbClose();
      if (e.key === 'ArrowRight') lbGo(lbI + 1);
      if (e.key === 'ArrowLeft') lbGo(lbI - 1);
    });
    let x0 = null;
    lb.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', (e) => { if (x0 == null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) lbGo(lbI + (dx < 0 ? 1 : -1)); x0 = null; });
  };
  let lastFocus;
  const lbGo = (n) => {
    lbI = (n + lbItems.length) % lbItems.length;
    const a = lbItems[lbI]; const im = $('.lb__img', lb);
    im.src = a.getAttribute('href'); im.alt = $('img', a)?.alt || a.dataset.alt || '';
    $('.lb__count', lb).textContent = `${lbI + 1} / ${lbItems.length}`;
    const multi = lbItems.length > 1;
    $('.lb__prev', lb).hidden = !multi; $('.lb__next', lb).hidden = !multi;
  };
  function openLB(group, idx) {
    if (!lb) lbBuild();
    lbItems = $$(`[data-lb="${group}"]`);
    if (!lbItems.length) return;
    lastFocus = document.activeElement;
    lbGo(idx); lb.classList.add('is-open'); document.body.style.overflow = 'hidden';
    $('.lb__close', lb).focus();
  }
  function lbClose() { lb.classList.remove('is-open'); document.body.style.overflow = ''; lastFocus && lastFocus.focus(); }
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-lb]');
    if (!a || a.hidden) return;
    e.preventDefault();
    openLB(a.dataset.lb, $$(`[data-lb="${a.dataset.lb}"]`).indexOf(a));
  });

  /* ---------- formulário de contato → WhatsApp ---------- */
  const form = $('[data-wa-form]');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const f = new FormData(form);
      const nome = (f.get('nome') || '').trim();
      if (!nome) { form.nome.focus(); form.nome.setAttribute('aria-invalid', 'true'); return; }
      const ln = [`Olá! Meu nome é ${nome}.`];
      if (f.get('cidade')) ln.push(`• Cidade: ${f.get('cidade')}`);
      if (f.get('modelo')) ln.push(`• Modelo de interesse: ${f.get('modelo')}`);
      if (f.get('tamanho')) ln.push(`• Tamanho: ${f.get('tamanho')}`);
      if (f.get('mensagem')) ln.push('', f.get('mensagem'));
      window.open(waLink(ln.join('\n')), '_blank', 'noopener');
    });
  }

  doc.classList.add('js-ready');
})();
