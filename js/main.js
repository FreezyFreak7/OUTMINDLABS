/* OutMindLabs — L'Archive */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Shared cursor position (viewport space)
  var CX = null, CY = null;
  window.addEventListener('mousemove', function (e) { CX = e.clientX; CY = e.clientY; }, { passive: true });
  window.addEventListener('mouseout', function () { CX = null; CY = null; }, { passive: true });

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

  /* ── Hero mesh + reticle + readout (one loop) ──── */
  (function () {
    var canvas = document.getElementById('mesh');
    if (!canvas) return;
    var hero = document.getElementById('vitrine');
    var ctx = canvas.getContext('2d');
    var reticle = document.getElementById('reticle');
    var rx = reticle && reticle.querySelector('.rx');
    var ry = reticle && reticle.querySelector('.ry');
    var latEl = document.getElementById('lat');
    var lonEl = document.getElementById('lon');
    var nodesEl = document.getElementById('nodes');

    var SPACING = 62, CONNECT = SPACING * 1.6, CONNECT2 = CONNECT * CONNECT, RADIUS = 190;
    var W = 0, H = 0, parts = [], rect = null, dirty = true;
    var buckets = new Map();

    function P(x, y, i) { this.x = this.bx = x; this.y = this.by = y; this.i = i; this.sp = Math.random() * 18 + 6; }

    function build() {
      rect = hero.getBoundingClientRect();
      W = rect.width; H = rect.height;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var nav = document.getElementById('nav');
      var top = (nav ? nav.offsetHeight : 0) + 14;
      var usable = H - top;
      parts = []; var i = 0;
      var sx = ((W % SPACING) + SPACING) / 2;
      var sy = top + (((usable % SPACING) + SPACING) / 2);
      for (var y = sy; y < H; y += SPACING)
        for (var x = sx; x < W; x += SPACING) parts.push(new P(x, y, i++));
      if (nodesEl) nodesEl.textContent = ('00' + parts.length).slice(-3);
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

    function dots() {
      ctx.fillStyle = 'rgba(0,196,154,0.75)';
      for (var i = 0; i < parts.length; i++) {
        ctx.beginPath(); ctx.arc(parts[i].x, parts[i].y, 1.4, 0, Math.PI * 2); ctx.fill();
      }
    }

    function draw() { ctx.clearRect(0, 0, W, H); dots(); lines(); }

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

      if (inside && rx) {
        rx.style.top = my + 'px'; ry.style.left = mx + 'px';
        if (latEl) latEl.textContent = (46.00 + (my / H) * 0.5).toFixed(2);
        if (lonEl) lonEl.textContent = ('0' + (6.00 + (mx / W) * 0.4).toFixed(2));
      }
    }
    build(); loop();
    requestAnimationFrame(function () { hero.classList.add('filled'); });
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
        var show = f === 'all' || c.getAttribute('data-discipline') === f;
        c.classList.toggle('hide', !show);
      });
    });
  })();

  /* ── Reaction demo ─────────────────────────────── */
  (function () {
    var mod = document.getElementById('reaction');
    if (!mod) return;
    var btn = document.getElementById('reactBtn');
    if (reduce) { mod.classList.add('reacted'); return; }
    if (btn) btn.addEventListener('click', function () { mod.classList.toggle('reacted'); });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { mod.classList.add('reacted'); io.disconnect(); } });
    }, { threshold: 0.5 });
    io.observe(mod);
  })();

  /* ── Access form ───────────────────────────────── */
  (function () {
    var form = document.getElementById('accForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var wrap = document.getElementById('formWrap');
      wrap.innerHTML =
        '<div class="acc-success corner">' +
        '<div class="mark">OK</div>' +
        '<h3>Dossier reçu</h3>' +
        '<p>Le conservateur revient vers vous sous 24 h pour ouvrir le dossier.</p>' +
        '</div>';
    });
  })();

})();
