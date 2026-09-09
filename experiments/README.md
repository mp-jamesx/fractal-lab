# Experimental

Local Vite app for Mirror Physics visual experiments using Three.js and p5.js.

## Run

```sh
cd experiments
npm install
npm run dev
```

Open http://127.0.0.1:8770. `npm run build` creates the production build.

## Form studies — Series 001

The home page is a library of named, numbered experiments with preview cards, configured in `src/experiments.json`. Experiment **3D M logo — 001** opens `/experiments/001-3d-m-logo`, a 3×3 gallery of nine independent 3D interpretations of the M. A back link returns to the library. Drag each tile to orbit. Click its title to enlarge the sculpture, zoom, reset the view, and inspect the exact palette, structure, and signal tags. The layout reduces columns on small screens. A single WebGL renderer draws all scenes in separate viewports. Sculptures remain still until manipulated.

The parent agent reviewed all 12 Mirror branding references, then selected shuffled category combinations and adjusted several for variety. Three Astra Medium subagents built three pieces each. Subagents received only the tag briefs and the original logo geometry, with explicit instructions not to access reference images. The selected briefs are saved in `src/briefs.json`; reference numbers correspond to the moodboard catalog order at creation.

| Study | Title | Palette ref | Structure ref | Signal ref |
| --- | --- | --- | --- | --- |
| 01 | Chromatic Chainmail | 02 | 09 | 07 |
| 02 | Quiet Voltage | 03 | 07 | 09 |
| 03 | Antenna Herbarium | 11 | 11 | 01 |
| 04 | Orbital Bloom | 04 | 08 | 07 |
| 05 | Little Hemisphere | 06 | 05 | 10 |
| 06 | Index of Echoes | 05 | 03 | 04 |
| 07 | Ember Atlas | 01 | 12 | 09 |
| 08 | Anatomy of a Signal | 10 | 04 | 02 |
| 09 | Chromatic Organ | 07 | 06 | 02 |

- `src/home.js` and `src/home.css`: experiment library and live logo preview.
- `src/main.js`: homepage, experiment, and original-model routing. Add new experiment metadata to `src/experiments.json` and its route/module to `src/main.js`.
- `src/pieces/piece01.js` through `piece09.js`: independent art modules exporting title, description, and createPiece().
- `src/gallery.js`: scenes, cameras, orbit controls, gallery and expanded views.
- `src/logo-utils.js`: source shapes, extrusion, point-in-logo sampling and seeded randomness.
- `src/style.css`: responsive gallery styling.

## Original model

The original matte gray extruded logo remains available at http://127.0.0.1:8770/?view=original. Drag to orbit, scroll to zoom, toggle Wireframe to inspect the triangles, or Reset view.

Its three outlines come from `../Blender/general-visuals/logo-tessellator/public/logo.svg`, copied into `src/mirror-logo.svg`. Three.js SVGLoader converts them to ExtrudeGeometry: depth 4, bevel size/thickness 0.25, three bevel segments. No textures or metallic reflections. Edit `src/single.js` and `src/single.css` for this view.

## Validation

Production build passes. Browser review confirmed all nine sculptures render, expanded views show the matching tags, orbit controls expose depth, and the console has no errors or warnings.

## Blog thumbnails — Experiment 002

A second library card opens `/experiments/002-blog-thumbnails`: three runs of ten live p5.js thumbnails, with one separate Astra Medium subagent per sketch using only randomized moodboard tags. Run 01 contains the original explorations; Run 02 mandates line drawings; Run 03 uses the Futuristic and lines moodboard. Click to inspect the tag brief and the actual 1200 × 675 p5 canvas. No PNG snapshots or downloads are used. See [process and sketch index](src/blog/README.md).

## Editorial thumbnails — Experiment 003

Ten live p5.js line drawings for ten actual Mirror Physics blog posts, using shuffled Futuristic and lines tags and the blog site as an editorial reference. Each article gets one separate Astra Medium agent. All chemical depictions use generated 3D RDKit conformers projected to p5 linework. See [article briefs and chemistry pipeline](src/editorial/README.md).

## Fractal Lab integration

This project lives in `fractal-lab/experiments`. Fractal Lab’s left sidebar serves this project within its Experiments section. From the repository root (`..`), run `npm run build:experiments` to create `dist-lab` with the `/lab-experiments/` base path. Normal standalone development on port 8770 and `dist` builds keep their original root paths. Navigation uses Vite’s configured base in both modes.

Experiment UI uses the same Fractal UI Figtree fonts and semantic neutral colors as Moodboards, including system dark mode. `src/theme.css` supplies shared tokens; artwork canvas colors remain defined by each piece.
