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
