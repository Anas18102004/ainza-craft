## Plan

### 1. Use the uploaded boardroom image
The uploaded image (cinematic AINZA boardroom with holographic table, city skyline at dusk, glowing AINZA logo on wall) is the perfect hero-quality asset. Best placement: **About Preview section** on the home page — it visually proves the brand's premium positioning and shows the actual AINZA brand mark in a real-world boardroom context.

- Copy upload → `src/assets/generated/about-boardroom.jpg` (overwrite current placeholder).
- Keep existing parallax treatment in `AboutPreview.tsx`; tighten the overlay so the AINZA logo on the wall remains readable.
- Update caption chip from "Leadership" to something that matches the imagery ("Inside AINZA").

### 2. Fix founder name typo everywhere
Replace every occurrence of **"Hamza Meman"** with **"Hamza Memon"** across:
- `src/components/home/AboutPreview.tsx` (2 places)
- `src/routes/about.tsx`
- any other file the search reveals.

### 3. Redesign the Services section visual (home page, left side)
Current left visual = generic command-center image with dot pills. Replace with a **bespoke premium architecture/operations diagram**.

Approach: generate a **new premium 3D render** with `imagegen` (model: premium) showing an isometric holographic systems-architecture board — concentric AI core, orbiting service nodes (AI, Cyber, Apps, Platforms, Cloud, Strategy), violet/blue brand palette, dark studio background. This becomes the new backdrop in `src/assets/generated/services-architecture.jpg`.

- Update `ServicesPreview.tsx` to use the new image and re-tune the 6 node coordinates (`spot.x/y`) so each pill sits over its corresponding orbit node in the new render.
- Strengthen overlay gradients for legibility; keep the existing interactive hover/click stack on the right untouched.

### 4. Add hero imagery to /services page
For each of the 6 service sections (AI, Security, Apps, Platforms, Cloud, Strategy), generate one premium 3D visual per service (or one wide hero image) and place it alongside the existing CSS module visuals.

Plan: generate **6 square premium 3D renders** (consistent style — dark studio, violet/blue accents, isometric or close-up macro shots of relevant tech objects: neural mesh, security shield/lock mesh, device stack, platform grid, cloud/server cluster, strategy blueprint). Save to `src/assets/generated/service-{id}.jpg` and render them in the alternating module slots in `services.tsx`.

### 5. Add architecture imagery to /ai-systems page
The page currently has a hand-built CSS/SVG reference architecture diagram. Add a **premium 3D hero image** above it depicting a realistic AI reference architecture (data flowing into reasoning core into actions, guardrails halo). Save to `src/assets/generated/ai-systems-hero.jpg` and place as a full-width visual at the top of the page (above the existing CSS diagram, which stays as the interactive technical reference).

Also add 1 supporting image inside the Use Cases section (e.g., document understanding macro shot) for visual depth: `src/assets/generated/ai-usecase-docs.jpg`.

### Technical notes
- All new images: `imagegen--generate_image` with `model: "premium"`, 16:9 or 1:1 as appropriate, saved as `.jpg` to `src/assets/generated/`.
- Imports as ES6 modules in the relevant components.
- No changes to design tokens, layout grids, or copy beyond the typo fix and any caption tweaks tied to new imagery.
- No backend or routing changes.

### Files to touch
- `src/assets/generated/about-boardroom.jpg` (replace with upload)
- `src/assets/generated/services-architecture.jpg` (new)
- `src/assets/generated/service-ai.jpg` … `service-strategy.jpg` (new, 6 files)
- `src/assets/generated/ai-systems-hero.jpg`, `ai-usecase-docs.jpg` (new)
- `src/components/home/AboutPreview.tsx` (name fix, caption)
- `src/components/home/ServicesPreview.tsx` (swap image, retune dot coords)
- `src/routes/services.tsx` (add per-service images)
- `src/routes/ai-systems.tsx` (add hero + use-case image)
- `src/routes/about.tsx` (name fix if present)
