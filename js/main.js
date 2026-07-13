/* OutMindLabs — L'Archive */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Shared cursor position (viewport space)
  var CX = null, CY = null;
  window.addEventListener('mousemove', function (e) { CX = e.clientX; CY = e.clientY; }, { passive: true });
  window.addEventListener('mouseout', function () { CX = null; CY = null; }, { passive: true });
  // touch: a tap or a swipe pushes the hero mesh around too
  function touchPos(e) { var t = e.touches && e.touches[0]; if (t) { CX = t.clientX; CY = t.clientY; } }
  window.addEventListener('touchstart', touchPos, { passive: true });
  window.addEventListener('touchmove', touchPos, { passive: true });
  window.addEventListener('touchend', function () { CX = null; CY = null; }, { passive: true });

  /* ── Custom cursor ─────────────────────────────── */
  (function () {
    if (!fine) return;
    var dot = document.getElementById('cur-dot');
    var ring = document.getElementById('cur-ring');
    if (!dot || !ring) return;
    var rx = 0, ry = 0;
    function frame() {
      if (CX != null) {
        dot.style.left = CX + 'px'; dot.style.top = CY + 'px';
        rx += (CX - rx) * 0.16; ry += (CY - ry) * 0.16;
        ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      }
      requestAnimationFrame(frame);
    }
    frame();
    var hov = 'a,button,input,select,textarea,label,.spec,.assay,.rap,.filter,.discipline';
    document.querySelectorAll(hov).forEach(function (el) {
      el.addEventListener('mouseenter', function () { document.body.classList.add('cur-hover'); });
      el.addEventListener('mouseleave', function () { document.body.classList.remove('cur-hover'); });
    });
  })();

  /* ── Hero mesh + readout (one loop) ────────────── */
  (function () {
    var canvas = document.getElementById('mesh');
    if (!canvas) return;
    var hero = document.getElementById('vitrine');
    var ctx = canvas.getContext('2d');
    var curxEl = document.getElementById('curx');
    var curyEl = document.getElementById('cury');

    var SPACING = 62, CONNECT = SPACING * 1.6, CONNECT2 = CONNECT * CONNECT, RADIUS = 190;
    var W = 0, H = 0, parts = [], rect = null, dirty = true;
    var gStartX = 0, gStartY = 0, gEndX = 0, gEndY = 0;
    var buckets = new Map();

    function P(x, y, i) { this.x = this.bx = x; this.y = this.by = y; this.i = i; this.sp = Math.random() * 18 + 6; }

    function build() {
      rect = hero.getBoundingClientRect();
      W = rect.width; H = rect.height;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Equal margins on all four edges, with the top starting below the header
      var navEl = document.getElementById('nav');
      var navH = navEl ? navEl.offsetHeight : 0;
      var availH = H - navH;
      gStartY = navH + ((availH % SPACING) + SPACING) / 2;
      // On mobile, start the grid at the content's side padding so a line
      // sits on the hero content's left edge; centred margins on desktop.
      if (W <= 900) gStartX = parseFloat(getComputedStyle(hero).paddingLeft) || ((W % SPACING) + SPACING) / 2;
      else gStartX = ((W % SPACING) + SPACING) / 2;
      gEndX = gStartX; while (gEndX + SPACING < W) gEndX += SPACING;
      gEndY = gStartY; while (gEndY + SPACING < H) gEndY += SPACING;
      parts = []; var i = 0;
      for (var y = gStartY; y <= gEndY + 0.5; y += SPACING)
        for (var x = gStartX; x <= gEndX + 0.5; x += SPACING) parts.push(new P(x, y, i++));
      dirty = true;
    }

    function lines() {
      buckets.clear();
      for (var a = 0; a < parts.length; a++) {
        var p = parts[a], k = Math.floor(p.x / CONNECT) + '_' + Math.floor(p.y / CONNECT);
        var arr = buckets.get(k); if (!arr) buckets.set(k, arr = []); arr.push(p);
      }
      ctx.lineWidth = 1;
      for (var b = 0; b < parts.length; b++) {
        var q = parts[b], cx = Math.floor(q.x / CONNECT), cy = Math.floor(q.y / CONNECT);
        for (var gx = cx - 1; gx <= cx + 1; gx++)
          for (var gy = cy - 1; gy <= cy + 1; gy++) {
            var bk = buckets.get(gx + '_' + gy); if (!bk) continue;
            for (var c = 0; c < bk.length; c++) {
              var r = bk[c]; if (r.i <= q.i) continue;
              var dx = q.x - r.x, dy = q.y - r.y, d2 = dx * dx + dy * dy;
              if (d2 < CONNECT2) {
                var op = 1 - Math.sqrt(d2) / CONNECT;
                ctx.strokeStyle = 'rgba(0,196,154,' + (op * 0.5) + ')';
                ctx.beginPath(); ctx.moveTo(q.x, q.y); ctx.lineTo(r.x, r.y); ctx.stroke();
              }
            }
          }
      }
    }

    function grid() {
      // full-bleed graph paper: lines span the whole canvas, phase-locked to the dots
      ctx.strokeStyle = 'rgba(17,17,17,0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      var phaseX = gStartX % SPACING, phaseY = gStartY % SPACING;
      for (var x = phaseX; x < W; x += SPACING) { var px = Math.round(x) + 0.5; ctx.moveTo(px, 0); ctx.lineTo(px, H); }
      for (var y = phaseY; y < H; y += SPACING) { var py = Math.round(y) + 0.5; ctx.moveTo(0, py); ctx.lineTo(W, py); }
      ctx.stroke();
    }

    function dots() {
      ctx.fillStyle = 'rgba(0,196,154,0.65)';
      for (var i = 0; i < parts.length; i++) {
        ctx.beginPath(); ctx.arc(parts[i].x, parts[i].y, 1.4, 0, Math.PI * 2); ctx.fill();
      }
    }

    function draw() { ctx.clearRect(0, 0, W, H); grid(); dots(); lines(); }

    // Rebuild on resize in every mode (incl. reduced-motion static frame)
    var t;
    window.addEventListener('resize', function () {
      clearTimeout(t);
      t = setTimeout(function () { build(); if (reduce) draw(); }, 160);
    });

    if (reduce) { build(); draw(); return; }

    function loop() {
      requestAnimationFrame(loop);
      rect = hero.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;

      var mx = null, my = null, inside = false;
      if (CX != null) {
        mx = CX - rect.left; my = CY - rect.top;
        inside = mx >= 0 && mx <= W && my >= 0 && my <= H;
      }

      var moved = false;
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        if (inside) {
          var dx = mx - p.x, dy = my - p.y, d = Math.hypot(dx, dy) || 0.001;
          if (d < RADIUS) {
            var f = (RADIUS - d) / RADIUS;
            p.x -= (dx / d) * f * p.sp; p.y -= (dy / d) * f * p.sp; moved = true; continue;
          }
        }
        if (p.x !== p.bx) { var sx = p.x - p.bx; if (Math.abs(sx) < 0.08) p.x = p.bx; else { p.x -= sx / 42; moved = true; } }
        if (p.y !== p.by) { var sy = p.y - p.by; if (Math.abs(sy) < 0.08) p.y = p.by; else { p.y -= sy / 42; moved = true; } }
      }
      if (moved || dirty) { draw(); dirty = false; }

      if (inside) {
        if (curxEl) curxEl.textContent = Math.round(mx);
        if (curyEl) curyEl.textContent = Math.round(my);
      }
    }
    build(); loop();
  })();

  /* ── Hero title: fit to width ──────────────────── */
  // Lines are nowrap (so the title is always 3 lines). This shrinks the font
  // just enough that the widest line fits — measured with the real font on
  // the real device, so it can never overflow/clip regardless of rendering.
  (function () {
    var h1 = document.querySelector('.hero .h-xl');
    if (!h1) return;
    var lines = h1.querySelectorAll('.line');
    if (!lines.length) return;
    var rng = document.createRange();
    function widest() {
      var max = 0;
      for (var i = 0; i < lines.length; i++) {
        rng.selectNodeContents(lines[i]);
        var w = rng.getBoundingClientRect().width;
        if (w > max) max = w;
      }
      return max;
    }
    function fit() {
      h1.style.fontSize = '';                    // reset to the CSS size
      var avail = h1.clientWidth * 0.98;         // small safety margin
      if (avail <= 0) return;
      var w = widest();
      if (w > avail) {
        var cur = parseFloat(getComputedStyle(h1).fontSize) || 40;
        h1.style.fontSize = (cur * avail / w) + 'px';
      }
    }
    fit();
    window.addEventListener('load', fit);
    window.addEventListener('resize', fit, { passive: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    setTimeout(fit, 300); setTimeout(fit, 1200);   // in case the font settles late
  })();

  /* ── Scellé label tape ─────────────────────────── */
  (function () {
    var track = document.getElementById('scelle');
    if (!track) return;
    var items = ['PIÈCE À CONVICTION', 'FAIT PAR UN HUMAIN', "CTRL+Z C'EST POUR LES LÂCHES",
      'CONSERVÉ SOUS VERRE', 'VOS CONCURRENTS SONT AU SOUS-SOL',
      'JE FAIS UNE OBSESSION SUR LES PIXELS', "CE N'EST PAS DE LA SCIENCE-FICTION"];
    var set = items.map(function (t) { return '<span>' + t + '</span><span class="plus">+</span>'; }).join('');
    track.innerHTML = set + set;
  })();

  /* ── Nav: theme by section, scroll-spy, mobile ── */
  (function () {
    var nav = document.getElementById('nav');
    if (!nav) return;
    var themed = Array.prototype.slice.call(document.querySelectorAll('[data-nav]'));
    var ticking = false;
    function apply() {
      ticking = false;
      var line = nav.offsetHeight + 4, cur = null;
      for (var i = 0; i < themed.length; i++) {
        var r = themed[i].getBoundingClientRect();
        if (r.top <= line && r.bottom > line) { cur = themed[i]; break; }
      }
      if (!cur) cur = themed[0];
      var dark = cur.getAttribute('data-nav') === 'dark';
      nav.classList.toggle('nav--dark', dark);
      nav.classList.toggle('nav--light', !dark);
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(apply); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    apply();

    // scroll-spy active link
    var links = Array.prototype.slice.call(document.querySelectorAll('.nav-menu a'));
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting && map[e.target.id]) {
          links.forEach(function (l) { l.classList.remove('active'); });
          map[e.target.id].classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    Object.keys(map).forEach(function (id) { var el = document.getElementById(id); if (el) io.observe(el); });

    // mobile toggle
    var toggle = document.getElementById('navToggle');
    var menu = document.getElementById('navMenu');
    if (toggle && menu) {
      toggle.addEventListener('click', function () { nav.classList.toggle('open'); });
      menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') nav.classList.remove('open'); });
    }
  })();

  /* ── Scroll reveal ─────────────────────────────── */
  (function () {
    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); }); return;
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  })();

  /* ── Collection filter ─────────────────────────── */
  (function () {
    var box = document.getElementById('filters');
    var grid = document.getElementById('specGrid');
    if (!box || !grid) return;
    var cards = Array.prototype.slice.call(grid.querySelectorAll('.spec'));
    box.addEventListener('click', function (e) {
      var btn = e.target.closest('.filter'); if (!btn) return;
      box.querySelectorAll('.filter').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var f = btn.getAttribute('data-filter');
      cards.forEach(function (c) {
        var d = c.getAttribute('data-discipline');
        var show = f === 'all' || d === f || d === 'both';
        c.classList.toggle('hide', !show);
      });
    });
  })();

  /* ── Fiche technique: staged reaction ──────────── */
  // A: scroll-scrubbed on desktop. B: auto-run on mobile. Static final under reduced-motion.
  (function () {
    var mod = document.getElementById('reaction');
    if (!mod) return;
    var grid = mod.closest('.fiche-grid') || mod;
    var scroll = document.getElementById('ficheScroll');
    var stepEl = document.getElementById('rstep');
    var logEl = document.getElementById('rlog');
    var btn = document.getElementById('reactBtn');
    var LOG = ['Brouillon', 'Grille', 'Mise en forme', 'Couleur', 'Signé'];
    var N = LOG.length;
    var cur = -1;

    function setStep(n) {
      n = n < 0 ? 0 : n > N - 1 ? N - 1 : n;
      if (n === cur) return;
      cur = n;
      grid.dataset.step = n;
      if (stepEl) stepEl.textContent = ('0' + (n + 1)).slice(-2);
      if (logEl) logEl.textContent = LOG[n];
    }

    if (reduce) { mod.classList.add('mode-static'); setStep(N - 1); return; }

    if (scroll) {
      // Scroll-scrub: the reaction advances as you scroll through the section.
      // Desktop pins the whole section; mobile pins just the reaction (CSS
      // sticky) so the steps stay in view while you scroll past them.
      mod.classList.add('mode-scrub');
      setStep(0);
      var STICKY_TOP = 72;   // matches the mobile sticky `top`
      var pin = mod.parentElement && mod.parentElement.classList.contains('reaction-pin')
        ? mod.parentElement : null;
      var ticking = false;
      function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
          ticking = false;
          var p;
          if (pin && window.innerWidth <= 900) {
            // mobile: progress over the reaction's pinned range so all 5
            // steps land while it is frozen (before the meta appears)
            var wr = pin.getBoundingClientRect();
            var span = wr.height - mod.offsetHeight;
            if (span <= 0) return;
            p = (STICKY_TOP - wr.top) / span;
          } else {
            // desktop: progress over the pinned section
            var r = scroll.getBoundingClientRect();
            var total = r.height - window.innerHeight;
            if (total <= 0) return;
            p = -r.top / total;
          }
          p = p < 0 ? 0 : p > 1 ? 1 : p;
          setStep(Math.floor(p * N * 0.999));
        });
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
      onScroll();
    } else {
      // Fallback (no scroll container): auto-run once when it enters view.
      mod.classList.add('mode-auto');
      setStep(0);
      var timer = null;
      function run() {
        clearInterval(timer); setStep(0);
        var i = 0;
        timer = setInterval(function () { i++; setStep(i); if (i >= N - 1) clearInterval(timer); }, 760);
      }
      if (btn) btn.addEventListener('click', run);
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { setTimeout(run, 650); io.disconnect(); } });
      }, { threshold: 0.4 });
      io.observe(mod);
    }
  })();

  /* ── Floating contact CTA ──────────────────────── */
  // Fades in once you're past the hero; tucks away when you reach contact.
  (function () {
    var cta = document.getElementById('ctaFloat');
    if (!cta) return;
    var hero = document.getElementById('vitrine');
    var contact = document.getElementById('demande');
    var ticking = false;
    function apply() {
      ticking = false;
      var vh = window.innerHeight;
      var pastHero = hero ? hero.getBoundingClientRect().bottom < vh * 0.5 : true;
      var reachedContact = contact ? contact.getBoundingClientRect().top < vh * 0.85 : false;
      cta.classList.toggle('show', pastHero && !reachedContact);
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(apply); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    apply();
  })();

  /* ── Access form (Web3Forms) ───────────────────── */
  (function () {
    var form = document.getElementById('accForm');
    if (!form) return;
    var wrap = document.getElementById('formWrap');

    function success() {
      wrap.innerHTML =
        '<div class="acc-success">' +
        '<div class="mark">OK</div>' +
        '<h3>Message reçu</h3>' +
        '<p>Merci ! Je reviens vers vous sous 24 h.</p>' +
        '</div>';
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var label = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Envoi…'; }

      var err = form.querySelector('.form-error');
      if (err) err.remove();

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      })
        .then(function (r) { return r.json(); })
        .then(function (j) {
          if (j && j.success) { success(); }
          else { fail(btn, label); }
        })
        .catch(function () { fail(btn, label); });
    });

    function fail(btn, label) {
      if (btn) { btn.disabled = false; btn.textContent = label || 'Envoyer'; }
      var p = document.createElement('p');
      p.className = 'form-error';
      p.textContent = 'Échec de l’envoi. Réessayez, ou écrivez-moi à noah@outmindlabs.com.';
      form.appendChild(p);
    }
  })();

  /* ── Redaction that bugs out ────────────────────── */
  // Classified fields periodically try to resolve, glitch, then re-redact.
  (function () {
    var reds = document.querySelectorAll('.redact');
    if (!reds.length) return;
    var GLYPHS = '▓▒░█#@%&/\\?§µ0101';

    reds.forEach(function (el) {
      var base = el.textContent;
      var len = base.length;
      var busy = false;

      function scramble(k) {
        var s = '';
        for (var i = 0; i < len; i++) s += GLYPHS.charAt((Math.random() * GLYPHS.length) | 0);
        return s;
      }
      function burst() {
        if (busy) return;
        busy = true;
        el.classList.add('glitch');
        var ticks = 16, i = 0;
        var iv = setInterval(function () {
          el.textContent = scramble();
          if (++i >= ticks) {
            clearInterval(iv);
            el.textContent = base;
            el.classList.remove('glitch');
            busy = false;
          }
        }, 45);
      }

      if (reduce) return;              // stays a static censored bar
      el.addEventListener('mouseenter', burst);
      (function loop() {
        setTimeout(function () { burst(); loop(); }, 1300 + Math.random() * 2000);
      })();
    });
  })();

})();
