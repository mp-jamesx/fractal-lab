# Experimental

Local Vite app for Mirror Physics visual experiments using Three.js and p5.js.

## Run

From the Fractal Lab repository root, run `npm ci` and `npm run dev`. Open http://127.0.0.1:8765/#/experiments. The single root `npm run build` includes all experiments in `dist/`.

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
- `../../src/Experiments.jsx`: homepage, experiment, and original-model routing. Add new experiment metadata to `src/experiments.json` and its route/module to `../../src/Experiments.jsx`.
- `src/pieces/piece01.js` through `piece09.js`: independent art modules exporting title, description, and createPiece().
- `src/gallery.js`: scenes, cameras, orbit controls, gallery and expanded views.
- `src/logo-utils.js`: source shapes, extrusion, point-in-logo sampling and seeded randomness.
- `src/style.css`: responsive gallery styling.

## Original model

The original matte gray extruded logo remains available at http://127.0.0.1:8765/#/experiments/original. Drag to orbit, scroll to zoom, toggle Wireframe to inspect the triangles, or Reset view.

Its three outlines come from `../Blender/general-visuals/logo-tessellator/public/logo.svg`, copied into `src/mirror-logo.svg`. Three.js SVGLoader converts them to ExtrudeGeometry: depth 4, bevel size/thickness 0.25, three bevel segments. No textures or metallic reflections. Edit `src/single.js` and `src/single.css` for this view.

## Validation

Production build passes. Browser review confirmed all nine sculptures render, expanded views show the matching tags, orbit controls expose depth, and the console has no errors or warnings.

## Blog thumbnails — Experiment 002

A second library card opens `/experiments/002-blog-thumbnails`: three runs of ten live p5.js thumbnails, with one separate Astra Medium subagent per sketch using only randomized moodboard tags. Run 01 contains the original explorations; Run 02 mandates line drawings; Run 03 uses the Futuristic and lines moodboard. Click to inspect the tag brief and the actual 1200 × 675 p5 canvas. No PNG snapshots or downloads are used. See [process and sketch index](src/blog/README.md).

## Editorial thumbnails — Experiment 003

Ten live p5.js line drawings for ten actual Mirror Physics blog posts, using shuffled Futuristic and lines tags and the blog site as an editorial reference. Each article gets one separate Astra Medium agent. All chemical depictions use generated 3D RDKit conformers projected to p5 linework. See [article briefs and chemistry pipeline](src/editorial/README.md).

## Fractal Lab integration

Artwork modules export `mount(app)` and return a cleanup function. `src/Experiments.jsx` in the repository root lazy-loads and mounts each route directly into the React app. There is no iframe, nested npm manifest, separate server, or secondary build. Add collection metadata to `experiments/src/experiments.json` and register its loader in `src/Experiments.jsx`.

Use hash routes under `#/experiments/` and the shared breadcrumbs helper. Scope experiment CSS to its `.experiment-*` view so it cannot restyle Moodboards or the sidebar. Clean up canvases, GPU resources, animation frames, listeners, and observers on unmount. Root Fractal tokens supply typography and theme colors; artwork palettes remain defined by each piece.
