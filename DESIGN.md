# OutMindLabs — Website Concept & Build Spec

_A complete handoff document. Everything a fresh agent needs to understand, run, and extend the site._

---

## 1. What this is

**OutMindLabs** is a solo creative studio run by **Noah**. It sells **two equally-weighted services**:

1. **Websites / digital experiences** — revenue-focused sites built to convert (landing pages, e-commerce, marketing sites, product sites, interactive experiences).
2. **Graphic design / image** — brand identity, logos, social-media content, print & editorial, art direction.

The single most important product requirement: **graphic design must read as a true equal to websites**, not an afterthought. Earlier drafts were website-heavy; the current concept structurally fixes that (see §4).

**Live repo:** `FreezyFreak7/OUTMINDLABS` (GitHub) → deployed on **Vercel** (static, `index.html` at repo root).
**Tagline:** _Laboratoire & Archive de Design._
**Language:** **French primary** (site copy is French). English is secondary. **No emoji, ever.**

---

## 2. The governing concept — "L'ARCHIVE / LE LABO"

The site is framed as a **design laboratory and specimen archive** run by one obsessive conservator.

- The **top of the page is the LAB** (bright bench where designs are mixed, tested, measured).
- The **body is the ARCHIVE** (tested work filed as catalogued *spécimens* under glass, each with an index number, a spec plate, and — under NDA — a redacted client name).

Narrative arc down the page: **bright lab → filed archive.** This is why the hero is bright/light and the deeper sections go dark.

Why this concept won (chosen over 4 alternatives — a field notebook, a control-panel console, a boot-sequence terminal, a chemistry reactor):
- The vitrine/specimen genre is the most **refined and editorial**.
- It **structurally cures the web/graphic imbalance**: in a specimen drawer a logo and a landing page are literal peers — same plate, same dignity.
- Graphic-design work (a poster/logo photographed on a neutral card) looks **more** native as a "specimen" than a browser mockup does.

### Concept guardrails (learned the hard way)
- Keep it **clean AND fun** — the humour lives in the **metadata/framing** layer (deadpan lab jargon), never in noisy surface decoration.
- Do **not** let it drift **military/HUD**. Avoid: crosshair *targeting* reticles, LAT/LON coordinates, "knots/nœuds", classified-redaction as the main hero motif, dark radar screens. (An earlier hero made exactly this mistake.) Lab cues = rulers, graph paper, px/hex/grid readouts, swatches, pipettes, measurement — a bright bench, not a cockpit.
- Museum/archive can read pretentious for a solo studio → keep the irreverent French voice **dialled up**.

---

## 3. Brand voice & copy

- **Confident, irreverent, direct.** Founder who has nothing to prove. Zero corporate speak.
- **Institutional deadpan applied to irreverent claims** — lab jargon (conservateur, spécimen, essai, prélèvement, fiche technique, relevé, paillasse) played completely straight, while the actual lines are cheeky.
- Humour in the metadata: `SUJET : NOAH · STATUT : CAFÉINÉ`, `VOS CONCURRENTS SONT AU SOUS-SOL`, `CTRL+Z C'EST POUR LES LÂCHES`, clients filed under `███████`.
- **No fabricated statistics.** Any result stays qualitative and NDA-safe (e.g. "panier moyen en hausse — mesuré, tenu au secret"), never "+42%".
- **NDA culture is a trust signal:** client names redacted as `███████` ("Plans Confidentiels").
- Keep these voice lines usable verbatim:
  - « Je fais une obsession sur les pixels pour que vous n'ayez pas à le faire. »
  - « Ce n'est pas de la Science-Fiction. C'est de la Magie. »
  - The "magie noire" testimonial.

---

## 4. How graphic design is made equal to websites (critical)

Not by adding copy — by using the **same apparatus** for both:

1. **§002 Classification** declares two co-equal drawers — **WEB** and **IMAGE** — with identical card anatomy, **before any work is shown**. Parity stated up front.
2. **§003 La Collection**: graphic-design specimens appear **first** and interleave 1:1 with web specimens. Each has the same plate: index number, discipline tag, one finding, redacted NDA client. A logo is filed with the same dignity as an e-commerce site.
3. **§004 Fiche technique**: the ONE live before→after demo lives on a **graphic-design** specimen (a grey wordmark snaps into the Syne lockup + palette bloom) — proving design craft with pure CSS, **no images**.
4. **§004** also shows a **type-specimen + palette** tile (Syne/Inter/Space Mono + the color chips) = the studio's own design system as proof of design literacy.
5. **§005 Prélèvements**: "ESSAI 02 — Identité & Image de Marque" is a **first-class assay**, not "pack 04".
6. **§007** booking form has a **Discipline** field (Web · Image · Les deux).

---

## 5. Visual system

### Colors (locked)
| Token | Hex | Usage |
|---|---|---|
| `--accent` (mint) | `#00c49a` | **Signature.** Structural accent, mesh, reticle/guides, signal-wire, status LEDs, hover color-reveal target |
| `--accent-light` | `#99EFD1` | The one mint section background; gradient highlight |
| `--accent-ink` | `#067a5c` | Darkened mint for mono labels/links **on cream** (mint fails WCAG on cream at 2.04:1 — always use ink-mint on light) |
| `--pink` | `#ff0055` | **Redaction ONLY** (NDA client blocks). Appears nowhere else, so it stays meaningful. (Palette-swatch chips showing the hex are the one allowed exception, since that's data.) |
| `--cream` | `#f4f4f5` | Light section / bench background |
| `--ink` | `#111111` | Primary text on light |
| `--muted` | `#555555` | Secondary text on light |
| `--dim` | `#9ca3af` | Dim text on dark |
| `--void` / `--panel` | `#0a0a0a` / `#111` | Dark section backgrounds |

Base is **black / white / grey**; **mint is the only real color**; **pink is a rare, meaningful pop**.

### Typography (locked)
- **Syne** (700/800) — all display/headings and the wordmark. UPPERCASE, `letter-spacing: -0.04em`.
- **Inter** (300–600) — all body copy and quotes.
- **Space Mono** (400/700) — **metadata ONLY**: module codes, field lists, tags, readouts, timelines, captions, colophon. **Never** body or quotes.
- Wordmark lockup: `OUTMIND` (Syne 400) + `LABS` (Syne 700 bold). "LABS" is always the bolder half.

### Recurring motifs (the "lab language")
- **Mono metadata everywhere small** — this single choice carries most of the "instrument" feel.
- **Module codes** per section: `000 · L'ORGANISME`, `001 · LE CONSERVATEUR` … `008 · CLÔTURE`.
- **`+` registration marks** at plate corners (`.corner` utility, two corners via `::before`/`::after`).
- **Blueprint grid** faintly behind dark sections (masked so it fades at edges).
- **Signal wire** — a mint line that draws down the protocol steps on scroll-in.
- **Graph-paper + edge rulers** in the hero (the design bench surface).
- **Redaction blocks** (`.redact`, pink) for NDA names.

---

## 6. Signature interactions (keep it to a few, all purposeful)

1. **Hero mesh** — a cursor-reactive mint particle network ("Spécimen 000 — l'organisme vivant"). Dots connect to nearby neighbours; the cursor scatters them and they ease home. Canvas, spatial-hash line drawing, DPR-aware, pauses when off-screen, skips drawing when fully at rest. **This is the loved signature asset — keep it.**
2. **Cursor guides + live px readout** in the hero (design-tool guides, NOT a targeting reticle).
3. **Specimen reveal** — collection plates are grayscale, desaturate→color on hover with the `+` marks; identical for web and image cards.
4. **Live before→after "réaction"** (§004) — grey wordmark snaps into the Syne lockup and a grey palette blooms to brand colors, on button press or scroll-in. Pure CSS/SVG, no images.
5. **Custom mint cursor** (dot + lerped ring, `mix-blend-mode: difference`), hover-devices only.

Everything above has a **`prefers-reduced-motion` fallback** (mesh static frame, guides hidden, reaction shows final state, reveals shown, marquee static) and degrades cleanly on touch (no `cursor:none` trap).

---

## 7. Page structure (sections, in order)

Each section pairs a **mono module code** (lab framing) with a **bold Syne headline** (human voice). `data-nav` drives the nav theme.

| # | id | Module | BG | Purpose / content |
|---|---|---|---|---|
| 000 | `vitrine` | `000 · L'ORGANISME` | light | **Hero / La Paillasse.** Bright bench: graph paper + rulers + mesh + cursor guides. "Fiche d'échantillon" card. Headline **ON MÉLANGE. ON TESTE. ON SIGNE.** Sub: the lab where designs get tested (web + image). CTAs: "Voir les spécimens" + "ou demander un test →". Bottom readout in px/hex/grid. |
| — | `scelle` | `SCELLÉ` | dark | Thin **label-tape** ticker (demoted marquee) with the irreverent one-liners separated by `+`. Flat, not rotated. |
| 001 | `conservateur` | `001 · LE CONSERVATEUR` | light | **About.** Noah as sole curator; accession photo + `DISPONIBLE`. "Un seul cerveau. Deux obsessions." + field-list (fonction, disciplines, fuseau, latence). |
| 002 | `classification` | `002 · CLASSIFICATION` | mint | **The parity statement.** Two co-equal drawers: Discipline A — Expériences Web / Discipline B — Image & Design Graphique, identical anatomy, mint signal-wire seam. Dark text on mint. |
| 003 | `collection` | `003 · LA COLLECTION` | light | **The work.** Filter chips (Tout / Web / Image). Specimen grid — 6 cards, **graphic design leads**: each = image plate, index (SPÉC. 0XX), discipline tag, short Syne title, one-line finding, redacted client. |
| 004 | `fiche` | `004 · FICHE TECHNIQUE` | dark | Deep-dive on a **graphic-design** specimen: the live before→after réaction + metadata table + type-specimen/palette proof. |
| 005 | `prelevements` | `005 · PRÉLÈVEMENTS` | light | **Offerings as lab assays** (no prices; qualitative "délai"). ESSAI 01 Landing / **02 Identité & Image de Marque (featured)** / 03 Site complet / 04 Système total. |
| 006 | `rapports` | `006 · RAPPORTS` | dark | **Testimonials as field reports** — mono report numbers, quote, redacted author, "RELEVÉ : 5/5". |
| 007 | `demande` | `007 · DEMANDE D'ACCÈS` | light | **Booking as an access-request slip** — Nom / Email / Discipline (Web·Image·Les deux) / Objectif; success state; a 3-step "protocole". |
| 008 | `cloture` | `008 · CLÔTURE` | dark | **Footer colophon.** Closing line "Ajoutons votre projet à la collection.", wordmark, mono colophon (édition/coords), tagline, email, ©. |

**Nav:** slim fixed bar, theme adapts per section (`data-nav`), wordmark left, mono module links right (`001 Conservateur … 007 Accès`), a mint `DISPONIBLE` status dot; collapses to a mono "Index" toggle on mobile. Scroll-spy highlights the current section.

---

## 8. Tech & files

- **Static, no framework, no build step.** Vanilla HTML/CSS/JS.
- **No external JS deps.** (FontAwesome was removed — use Space Mono glyphs, `+` marks, and native characters like `→`.)
- Fonts via Google Fonts `@import` in the CSS (Syne + Inter + Space Mono).
- Deploy: **Vercel**, static, files at **repo root** (`index.html`, `css/style.css`, `js/main.js`). No `vercel.json` needed.

```
index.html      — all 10 sections
css/style.css   — design tokens + all component/section styles + responsive + reduced-motion
js/main.js      — cursor, hero mesh+guides+readout (one rAF loop), scellé, nav theming+scroll-spy+mobile,
                  scroll reveal, collection filter, reaction demo, form success
```

### Accessibility / performance decisions already baked in
- WCAG-safe contrast (ink-mint on cream; focus-visible outlines; readable dim text on dark).
- `:focus-visible` outline on all interactive elements (ink on light/mint, mint on dark).
- Images `loading="lazy" decoding="async"`; consistent grayscale specimen treatment.
- Mesh: DPR-capped, spatial-hash lines, off-screen skip, at-rest skip, rebuild on resize (incl. reduced-motion).
- Full `prefers-reduced-motion` and touch fallbacks.

### Placeholder assets to replace
- Specimen images are **Unsplash placeholders** reframed as poster/print/identity shots. Swap for real work; keep the neutral 4:5 grayscale plate treatment or the grid loses cohesion.
- Noah's photo is a LinkedIn URL with an **expiring token** — replace with a hosted image.

---

## 9. Decisions / rationale log (what was cut and why)

- **Rotated italic marquee** → demoted to a flat mint "scellé" label-tape (its tilt fought the clean grid).
- **"Sites web bâtis pour le profit" hero + pink pills** → removed (hard-coded website-only positioning; pink reserved for redaction).
- **Generic about cards (Performance/UX/Ventes/Stratégie) + fabricated stat bento** → folded into the conservator + specimen fiche; no fake numbers.
- **Pricing-menu services** → recast as lab "assays" with identity elevated.
- **"Agence d'Expérience Digitale" tagline** → replaced by "Laboratoire & Archive de Design".
- **FontAwesome** → dropped entirely.
- **Military hero (reticle + LAT/LON + redaction + dark)** → replaced by the bright design-bench (rulers, graph paper, px readout).

---

## 10. Open items / possible next steps

- Replace Unsplash placeholders with real specimens; host Noah's photo.
- Optional: numbered tick labels on the hero rulers; before/after slider on more specimens; a real calendar embed on the booking form; EN translation toggle (the FR/EN switch is currently decorative).
- Consider a lightweight specimen "détail" view (modal) if real case studies exist.
- Wire the booking form to an email/endpoint (currently client-side success state only).

---

_Fonts and colors are locked; everything else is fair game. Keep it clean and fun, keep graphic design equal to websites, keep pink meaningful, keep the mesh._
