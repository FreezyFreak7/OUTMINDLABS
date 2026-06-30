/* OutMindLabs — Shared JS */

// ── Custom cursor ─────────────────────────────────────
(function() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  (function lerp() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(lerp);
  })();

  const hoverEls = document.querySelectorAll('a, button, [role="button"], input, select, textarea, label, .card-light, .card-dark, .testimonial-card, .package-card');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
})();

// ── Scroll fade-in ───────────────────────────────────
(function() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-up').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    observer.observe(el);
  });
})();

// ── Booking form ─────────────────────────────────────
(function() {
  const form = document.getElementById('booking-form');
  if (!form) return;
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const wrap = document.getElementById('form-wrap');
    wrap.innerHTML = `
      <div class="booking-success">
        <div class="success-icon"><i class="fa-solid fa-check"></i></div>
        <h3 class="success-title">Demande Envoyée !</h3>
        <p class="success-body">Noah vous recontactera sous 24h pour confirmer votre créneau d'appel stratégique.</p>
      </div>
    `;
  });
})();

// ── Nav shrinks on scroll ────────────────────────────
(function() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// ── Scroll-spy: highlight the nav link of the section in view
(function() {
  const map = { home: 'home', services: 'services', booking: 'booking' };
  const links = document.querySelectorAll('.nav-links a');
  const sections = ['home', 'services', 'booking']
    .map(id => document.getElementById(id))
    .filter(Boolean);
  if (!sections.length) return;

  const setActive = id => {
    links.forEach(a => {
      const href = a.getAttribute('href') || '';
      a.classList.toggle('active', href === '#' + id);
    });
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && map[e.target.id]) setActive(e.target.id);
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(s => observer.observe(s));
})();

// ── Magnetic buttons ─────────────────────────────────
(function() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(hover: none)').matches) return;
  const magnets = document.querySelectorAll('.btn-primary, .btn-ghost');
  const strength = 0.4;

  magnets.forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const mx = e.clientX - (r.left + r.width / 2);
      const my = e.clientY - (r.top + r.height / 2);
      btn.style.transform = `translate(${mx * strength}px, ${my * strength}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
})();

// ── Hero particle constellation ──────────────────────
// Mint network of dots that connect with nearby neighbours and
// scatter away from the cursor. Confined to the hero, mapped to
// the section's coordinate space, and skipped when off-screen.
(function() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const hero = canvas.closest('.hero') || canvas.parentElement;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(hover: none)').matches) return;

  const ctx = canvas.getContext('2d');
  const SPACING = 68;                 // grid gap between dots
  const CONNECT = SPACING * 1.5;      // max line length
  const CONNECT2 = CONNECT * CONNECT;
  const mouse = { x: null, y: null, radius: 240 };
  let clientX = null, clientY = null; // raw cursor (viewport space)
  let cssW = 0, cssH = 0, particles = [], rect = null;
  const buckets = new Map();

  class Particle {
    constructor(x, y, idx) {
      this.x = this.baseX = x;
      this.y = this.baseY = y;
      this.idx = idx;
      this.speed = Math.random() * 22 + 6;
    }
    update() {
      if (mouse.x != null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy) || 0.0001;
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * this.speed;
          this.y -= (dy / dist) * force * this.speed;
          return;
        }
      }
      // ease back home (higher divisor = slower return)
      if (this.x !== this.baseX) this.x -= (this.x - this.baseX) / 45;
      if (this.y !== this.baseY) this.y -= (this.y - this.baseY) / 45;
    }
  }

  function build() {
    rect = hero.getBoundingClientRect();
    cssW = rect.width;
    cssH = rect.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    particles = [];
    let idx = 0;
    const startX = ((cssW % SPACING) + SPACING) / 2;
    const startY = ((cssH % SPACING) + SPACING) / 2;
    for (let y = startY; y < cssH; y += SPACING) {
      for (let x = startX; x < cssW; x += SPACING) {
        particles.push(new Particle(x, y, idx++));
      }
    }
  }

  function bucketKey(x, y) {
    return Math.floor(x / CONNECT) + '_' + Math.floor(y / CONNECT);
  }

  function drawLines() {
    buckets.clear();
    for (const p of particles) {
      const k = bucketKey(p.x, p.y);
      let arr = buckets.get(k);
      if (!arr) buckets.set(k, (arr = []));
      arr.push(p);
    }
    ctx.lineWidth = 1;
    for (const p of particles) {
      const cx = Math.floor(p.x / CONNECT);
      const cy = Math.floor(p.y / CONNECT);
      for (let gx = cx - 1; gx <= cx + 1; gx++) {
        for (let gy = cy - 1; gy <= cy + 1; gy++) {
          const arr = buckets.get(gx + '_' + gy);
          if (!arr) continue;
          for (const q of arr) {
            if (q.idx <= p.idx) continue;
            const dx = p.x - q.x, dy = p.y - q.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < CONNECT2) {
              const op = 1 - Math.sqrt(d2) / CONNECT;
              ctx.strokeStyle = 'rgba(0,196,154,' + (op * 0.45) + ')';
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(q.x, q.y);
              ctx.stroke();
            }
          }
        }
      }
    }
  }

  function loop() {
    requestAnimationFrame(loop);
    rect = hero.getBoundingClientRect();
    // Skip work while the hero is scrolled out of view
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;

    mouse.x = clientX == null ? null : clientX - rect.left;
    mouse.y = clientY == null ? null : clientY - rect.top;

    ctx.clearRect(0, 0, cssW, cssH);
    for (const p of particles) p.update();
    ctx.fillStyle = 'rgba(0,196,154,0.55)';
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.3, 0, Math.PI * 2);
      ctx.fill();
    }
    drawLines();
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(build, 150);
  });
  window.addEventListener('mousemove', e => { clientX = e.clientX; clientY = e.clientY; });
  window.addEventListener('mouseout', () => { clientX = clientY = null; });

  build();
  loop();
})();
