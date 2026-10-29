# Kaif Ali — Engineering Atlas

An immersive, engineering-focused portfolio for **Kaif Ali**, a B.Tech Electrical Engineering student at IIT Bhilai. The Engineering Atlas presents real software projects, their technologies, development status, and known limitations.

## What this is

The Engineering Atlas is a single-page, framework-free portfolio built with HTML, CSS, and JavaScript, with a Three.js-powered interactive 3D hero. It combines an orbital project scene with accessible, detailed project case studies and a secondary section for smaller builds.

The 3D scene is a way to explore the portfolio—not a replacement for readable content or ordinary project links.

## Experience

- Interactive Three.js 3D orbital scene with drag-to-rotate 360-degree viewing
- Project nodes that navigate to the matching case studies
- Reset-view control and touch-friendly orbit interaction
- Reduced-motion support and an existing contour-canvas fallback if WebGL or the Three.js CDN fails
- Four detailed featured projects: Koinelio, SmartNotepad, ASRS, and NextMarga
- A NextMarga live-homepage snapshot attempt, with its repository-derived architecture diagram as a fallback
- Responsive HTML/CSS navigation, semantic structure, and accessible project links
- Secondary project links and an engineering journey/skills section

## Project inventory

### Featured projects

- **Koinelio — Campus Community Platform**  
  Repository: https://github.com/rkaif8314-a11y/Koinelio-Campus-Community-Platform  
  Demo: https://koinelio.vercel.app/

- **SmartNotepad — Cloud Notes**  
  Repository: https://github.com/rkaif8314-a11y/SmartNotepad  
  Demo: https://smart-notepad-one.vercel.app/

- **NextMarga — Opportunity Discovery and Guidance**  
  Repository: https://github.com/rkaif8314-a11y/NextMarga  
  Demo: https://next-marga.vercel.app/

- **ASRS — Student Record System**  
  Repository: https://github.com/rkaif8314-a11y/IIT-BHILAI-RECORD-SYSTEM-TO-STUDENT-RECORD-MANAGEMENT-SYSTEM  
  Demo: https://asrs-sys.vercel.app/

### More builds and practice

- **SkyLume Weather** — https://github.com/rkaif8314-a11y/skylume-weather  
  Demo: https://skylume-weather.vercel.app/
- **Veriq** — https://github.com/rkaif8314-a11y/Veriq  
  Demo: https://veriq-smoky.vercel.app/
- **CodeVault** — https://github.com/rkaif8314-a11y/codevault  
  Demo: https://codevault-pink.vercel.app/
- **DSA practice** — https://github.com/rkaif8314-a11y/Leetcode-TUF-DSA-problems- and https://github.com/rkaif8314-a11y/DSA-C-

Tech Cafe is excluded because the previous public repository link returned 404 and no matching public repository was found in the audit.

## Structure

- `index.html` — semantic page, project content, metadata, import map, and scene canvas
- `styles.css` — Engineering Atlas design tokens, layout, responsive behavior, scene controls, and preview styling
- `script.js` — section HUD, contour fallback, current year, and NextMarga preview fallback
- `three-scene.js` — Three.js scene, OrbitControls, clickable project nodes, resize and lifecycle handling
- `assets/` — existing project captures for Koinelio, SmartNotepad, and ASRS
- `docs/design-research.md` — reference-inspection notes and constraints
- `docs/` — maintenance and release-checklist notes

## Run locally

This is a static website. No `npm install` or build step is required.

From the repository folder, run:

```bash
python -m http.server 8000
```

Then open http://localhost:8000 in your browser.

The 3D scene loads a pinned Three.js build from jsDelivr, so an internet connection is required for the full WebGL experience. If WebGL or module loading fails, the existing contour field remains as a visual fallback.

The NextMarga preview uses a remote screenshot endpoint to request a current image of the public homepage. If that endpoint is blocked or unavailable, the verified architecture diagram remains visible. The preview image is illustrative only and does not prove that every feature of the live application works. Open the direct demo link to visit NextMarga.

## Deploy to Vercel

The portfolio is static and does not require a backend or environment variables.

- Framework preset: **Other**
- Build command: **None**
- Output directory: **.**
- Install command: **None**

Review the live preview and verify external assets before promoting a deployment.

## Truthfulness, accessibility, and safety

- No user counts, adoption claims, impact metrics, or unsupported production-readiness claims.
- Status labels reflect available repository documentation and should be rechecked when project states change.
- Koinelio's production-hardening and database-migration caveat is retained; it is not described as an official IIT Bhilai service.
- ASRS is presented as a demo, not an official IIT Bhilai system.
- Project screenshots are genuine captures of public pages; architecture diagrams are labelled as diagrams.
- The 3D canvas is supplementary. Project content and navigation remain available as normal HTML.
- The site respects `prefers-reduced-motion` and does not require webcam access.
- No paid APIs or API keys are required.

## Reference research

The portfolio's design direction was inspired by references supplied by the owner. See `docs/design-research.md` for what could be inspected, what could not be verified visually, and how ideas were adapted into an original design rather than copied.

---

**Build · Learn · Improve · Repeat**
