## Context

The project is currently the blank Lovable template — only `src/routes/index.tsx` (placeholder) and `__root.tsx` exist. The "current code" you referenced is the uploaded `reference_hero_index.html` (1626 lines), which I'll use as the hero foundation and brand system source of truth. Logos (`logo.png`, `logo_text.png`) will be copied into `src/assets/brand/`.

## Brand system (extracted from reference + uploads)

- Background `#050511`, text white 95%, muted 70%, dim 42%
- Accents: violet `#bba5ff`, blue `#7ca7ff`, cyan `#8de8ee`
- Fonts: Outfit (UI/headings), Cormorant Garamond (editorial accents), IBM Plex Mono (labels)
- Tokens go into `src/styles.css` as oklch CSS variables + Tailwind `@theme inline` mappings (`--violet`, `--blue`, `--cyan`, `--glass`, `--grid`, gradients, shadows). All component code uses semantic tokens, never raw hex.

## Routes

File-based routes under `src/routes/` — each gets its own `head()` (title, description, og:title, og:description):

- `index.tsx` — full homepage
- `services.tsx`, `products.tsx`, `ai-systems.tsx`, `about.tsx`, `contact.tsx` — stub pages with the same header/footer, a hero band, and a "Full page coming soon — talk to AINZA" CTA. They exist so the nav links resolve and SEO works; the homepage previews link into them.

Shared layout: `src/components/site/SiteHeader.tsx` (floating glass nav, exact reference styling), `src/components/site/SiteFooter.tsx`. Mounted in `__root.tsx` around `<Outlet />`.

## Homepage sections (file map)

All under `src/components/home/`, composed in `src/routes/index.tsx`:

1. `Hero.tsx` — port reference hero: floating nav (in SiteHeader), big "Engineering intelligent systems…" headline, subtext, Primary "Start a Project" + Secondary "Explore Services", premium dark backdrop with a generated **realistic innovation-lab interior with a wall-mounted raised 3D AINZA logo** (image asset, parallax). Headline fade-up, soft grain, reduced-motion aware.

2. `TrustStrip.tsx` — single floating glass bar over a dark gradient band (NOT a card grid). Four items: Business-first solutions · Security by design · Support after launch · Built to scale. Each: minimal line icon + label + thin divider. Subtle CSS light-sweep animation across the bar; on hover the icon lifts 3px and glows.

3. `ServicesPreview.tsx` — **split layout, not a grid**.
   - Left: generated image of a **dark operations-lab console with a glowing AINZA service core and six labeled glass modules** (AI / Security / Apps / Platforms / Cloud / Strategy), with CSS-positioned highlight rings overlaid so the active module can light up.
   - Right: vertical interactive stack of 6 service rows (AI Systems & Automation, Cybersecurity, Web & Mobile Development, Digital Platforms, Cloud & DevOps, Strategy & Consulting). Hover/focus expands the row, glows the icon, slides the arrow, and highlights the matching module on the left via shared state.
   - CTA: "View All Services →/services" + secondary "Talk to AINZA →/contact".
   - Section background: dark digital-infrastructure gradient + faint blueprint grid (CSS only, distinct from other sections).

4. `ProductsPreview.tsx` — case-study showcase: 1 large featured card (YES Fashion — Workflow Software & Automation) on the left, 2 stacked compact cards on the right (Abrar Forwarders — Enterprise Logistics Website; Elite Enterprises — Industrial Services Platform). Each card uses a generated **realistic device mockup** (desktop app UI for YES; laptop logistics site; widescreen industrial services site). Tags row, subtle tilt-on-hover, parallax on the mockups.
   - Below: "TRUSTED BY AMBITIOUS BUSINESSES" — a polished dark-glass plaque strip with three **text-based logo marks** (YES Fashion / Abrar Forwarders / Elite Enterprises) rendered in CSS typography (no AI-generated logo text, to avoid distortion).
   - Section background: studio-table gradient with soft spotlight (CSS radial gradients), distinct from Services.
   - CTA: "Explore Products →/products".

5. `WhyAinza.tsx` — vertical "AINZA Standard" timeline (not a 4-card row). Central animated line that draws in on scroll; four milestones `01–04` with glass panels, line icons (Target, Headset, Shield, Handshake from lucide-react), heading + 1-line description for each of the four principles. Background: subtle blueprint grid texture, more restrained motion, serious tone.

6. `AboutPreview.tsx` — split: left = short copy ("A technology partner built for businesses…") + founders line ("Founded by Hamza Meman · Co-founded by Mohammad Anas") + "About AINZA →/about" CTA. Right = generated **premium boardroom / dark stone wall with a physically installed 3D AINZA wall sign** (different scene from hero — more intimate, warmer rim light). Logo parallax.

7. `FinalCta.tsx` — premium dark-glass action panel (not a flat rectangle). Animated gradient border, soft purple-blue light rays (CSS conic + radial gradients, no heavy lib), a subtle 3D AINZA mark on the right, heading "Ready to build what's next for your business?", subtext, Primary "Talk to AINZA →/contact", Secondary "Explore Services →/services".

8. `SiteFooter.tsx` — logo + tagline, 3 link columns (Navigate / Services / Talk to us), soft top border, dark gradient, no clutter.

## Visuals & assets

Generated with `imagegen` (premium tier for any with visible logo/text, fast otherwise) into `src/assets/generated/`:

- `hero-lab.jpg` — innovation-lab interior with raised 3D wall-mounted AINZA logo (premium)
- `services-console.jpg` — dark ops-lab console with glowing service core + 6 labeled glass modules (premium — has module labels)
- `product-yes-fashion.jpg` — clean internal workflow software mockup (no fake brand text)
- `product-abrar.jpg` — logistics website on widescreen monitor, port/containers tone
- `product-elite.jpg` — industrial services platform on laptop, lifting equipment tone
- `about-boardroom.jpg` — premium boardroom with installed 3D AINZA wall sign (premium)

Uploaded `logo.png` and `logo_text.png` copied to `src/assets/brand/` for nav, footer, and final-CTA mark.

All AINZA wordmark inside generated images is risky → prompts will keep the logo as the **A-mark only** (matches `logo.png`) for accuracy, and the wordmark is placed as a real `<img>` overlay where text legibility matters. Client "logos" in the trust strip are rendered as CSS type, never image-generated.

## Motion

- Framer Motion (`motion` package, already common in template — install if missing) for fade-up, staggered children, scroll-reveal, timeline draw.
- All motion wrapped to respect `prefers-reduced-motion`.
- No GSAP, no Three.js — pure CSS gradients/transforms + Motion is enough for the requested feel and keeps the Worker bundle light.

## Accessibility & responsive

- Semantic landmarks, single H1 (hero), H2 per section, alt text on every image.
- Service rows are real `<button>`s with `aria-expanded` and keyboard support; the left console highlight is decorative.
- Desktop split layouts collapse: Services right-stack becomes accordion on mobile; Products becomes a horizontal snap-scroll rail; Why-AINZA timeline left-aligns; About stacks.
- Min 16px body, line-height 1.6, contrast checked against `#050511`.

## Out of scope (explicit)

- Full Services / Products / AI Systems / About / Contact page content (stub only, per the homepage-is-preview decision).
- Backend, forms, Lovable Cloud, analytics — not requested.

## Technical section (file checklist)

```
src/styles.css                              (extend tokens)
src/routes/__root.tsx                       (wrap with SiteHeader/Footer, fonts)
src/routes/index.tsx                        (compose homepage)
src/routes/services.tsx                     (stub + head)
src/routes/products.tsx                     (stub + head)
src/routes/ai-systems.tsx                   (stub + head)
src/routes/about.tsx                        (stub + head)
src/routes/contact.tsx                      (stub + head)
src/components/site/SiteHeader.tsx
src/components/site/SiteFooter.tsx
src/components/site/Reveal.tsx              (motion + reduced-motion helper)
src/components/home/Hero.tsx
src/components/home/TrustStrip.tsx
src/components/home/ServicesPreview.tsx
src/components/home/ProductsPreview.tsx
src/components/home/WhyAinza.tsx
src/components/home/AboutPreview.tsx
src/components/home/FinalCta.tsx
src/assets/brand/logo.png, logo-text.png    (copied from uploads)
src/assets/generated/*.jpg                  (6 images)
```

Confirm and I'll build it end-to-end in one pass.
