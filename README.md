# Kaif Ali — Engineering Atlas

An engineering-focused portfolio for Kaif Ali, an Electrical Engineering student at IIT Bhilai. It presents real software projects, verified repository links, and clear development-status notes.

## Experience

- Interactive Three.js 3D orbital scene with 360-degree drag rotation
- Project nodes link to the corresponding case studies
- Reset-view control, touch-friendly orbiting, and reduced-motion support
- Canvas contour fallback if WebGL or the Three.js CDN cannot load
- Real project case studies for Koinelio, SmartNotepad, ASRS, and NextMarga
- Live NextMarga homepage snapshot with the verified architecture diagram as a fallback
- Responsive HTML/CSS navigation, semantic structure, and accessible project links

## Files

- `index.html` — semantic page and project content
- `styles.css` — Engineering Atlas tokens, layout, responsive behavior, and preview styling
- `script.js` — section HUD, contour fallback, year, and NextMarga preview fallback
- `three-scene.js` — Three.js scene, OrbitControls, interactive project nodes, resize and lifecycle handling
- `assets/` — existing project captures for Koinelio, SmartNotepad, and ASRS
- `docs/design-research.md` — reference inspection notes and constraints

## Run locally

This is a static website. No npm install or build step is required.

From the repository folder, run:

```bash
python -m http.server 8000
```

Then open http://localhost:8000 in your browser.

The 3D scene imports a pinned Three.js version from jsDelivr, so the browser needs internet access for the full WebGL experience. The existing contour canvas remains as a fallback. The NextMarga preview attempts to show a dynamically generated image of its public homepage through a screenshot endpoint; if the endpoint is unavailable, the architecture diagram remains visible. The full application is always available through the direct demo link.

## Verified project links

- Koinelio: https://github.com/rkaif8314-a11y/Koinelio-Campus-Community-Platform
- SmartNotepad: https://github.com/rkaif8314-a11y/SmartNotepad
- ASRS: https://github.com/rkaif8314-a11y/IIT-BHILAI-RECORD-SYSTEM-TO-STUDENT-RECORD-MANAGEMENT-SYSTEM
- NextMarga: https://github.com/rkaif8314-a11y/NextMarga
- SkyLume Weather: https://github.com/rkaif8314-a11y/skylume-weather

## Safety and accuracy

- No user counts, adoption claims, impact metrics, or unsupported production-readiness claims.
- Koinelio's production-hardening and database-migration caveat is retained.
- ASRS is presented as a demo, not as an official IIT Bhilai system.
- The 3D scene is decorative/supplementary; project navigation remains available as ordinary HTML.
- No paid APIs or API keys are required.

**Build · Learn · Improve · Repeat**
