# Blog thumbnails — Experiment 002

Three runs of ten 1200 × 675 editorial thumbnails each for a company at the intersection of drug discovery and technology. All artwork is drawn procedurally with p5.js 2D canvas: no image generation, raster inputs, remote assets, or reference images. Some sketches calculate 3D coordinates and project them onto the 2D canvas; those are still code-drawn p5 sketches.

## Run 01 process

The same 12-image Mirror branding moodboard supplied the tags. Palette, structure and signal source lists were independently shuffled with seed 20909; each sketch uses three distinct reference sources. The selected tags and rendering seeds are preserved in `briefs.json`. Ten separate Astra Medium subagents (`blog01`–`blog10`) each authored exactly one sketch. Each received only its tag brief and the drug-discovery/technology context, explicitly excluding reference images and other agents’ artwork.

## Run 01 sketches

| # | Title | Palette | Structure | Signal |
| --- | --- | --- | --- | --- |
| 01 | Affinity Totem | 12 | 02 | 09 |
| 02 | The Binding Event | 08 | 04 | 07 |
| 03 | Affinity Islands | 04 | 10 | 01 |
| 04 | Binding Field | 10 | 01 | 03 |
| 05 | Affinity Pores | 01 | 09 | 05 |
| 06 | Soft Affinity | 05 | 08 | 10 |
| 07 | Conformation Space | 02 | 12 | 11 |
| 08 | Beyond the Binding Horizon | 06 | 05 | 12 |
| 09 | The Shape of Affinity | 11 | 07 | 02 |
| 10 | The Binding Loop | 07 | 03 | 08 |

## Use and extend

Open `/experiments/002-blog-thumbnails`. Run 03 (Futuristic and lines) appears first, followed by Run 02 (Line drawings) and Run 01 (Initial explorations). Select an artwork to see its tag brief. Both gallery and detail views display the actual p5 canvas: opening a detail moves that same canvas into the dialog and closing returns it to its card. No PNG previews, raster downloads, SVGs, or image generation are used.

`gallery.js` owns the p5 instances and seeds. Each `sketches/sketchNN.js` exports `title`, `description` and `draw(p, seed)`. The wrapper creates a 1200 × 675 canvas, sets pixel density to 1, seeds random/noise, and invokes the draw function once. Optional `animate(p, seed)` runs on subsequent frames for sketches with motion. Static compositions remain real p5 canvases.

## Validation

All ten canvases verified at 1200 × 675 in-browser, no console errors/warnings, PNG detail verified at native resolution. Production build passes.

## Run 02 — Line drawings

Ten new Astra Medium agents (`lines01`–`lines10`) each created one independent p5.js sketch from fresh randomized tag-only briefs. Source selection seed: 209092. The strict constraint is a single solid background followed only by unfilled strokes, contours, outlines and curves. No image generation, reference-image access, fills, gradients, shading, stippling or text. Incompatible texture tags are interpreted as line rhythms.

Files live in `run02/sketches/`, with the exact tags and drawing seeds in `run02/briefs.json`. All runs retain independent briefs and sketch files; the detail view identifies the run.

| # | Title | Palette | Structure | Signal |
| --- | --- | --- | --- | --- |
| 01 | Orbital Affinity | 11 | 05 | 12 |
| 02 | Conformation Playground | 05 | 03 | 10 |
| 03 | Reciprocal Forms | 12 | 06 | 07 |
| 04 | Thermal Selection | 01 | 04 | 06 |
| 05 | Conformation Vessel | 06 | 01 | 09 |
| 06 | Conformer Column | 07 | 02 | 08 |
| 07 | A Fold in the Search Space | 09 | 07 | 01 |
| 08 | Conformation Window | 04 | 12 | 05 |
| 09 | Candidate Atlas | 03 | 10 | 04 |
| 10 | Porous Affinity | 10 | 09 | 02 |

Run 02 validation: all ten new canvases render at 1200 × 675, all ten Run 01 canvases remain present, the corrected curve sketch and run-specific PNG export were visually checked. Source audit found no fill, gradient, text, image-loading or stippling calls in Run 02. Production build passes.

## Run 03 — Futuristic and lines

Ten separate Astra Medium agents (`live01`–`live10`) each build one p5 line drawing for drug discovery and technology. Each receives only one randomized palette/structure/signal brief from the seven-image Futuristic and lines moodboard, never the reference images. Selection seed: 209093. The source numbers, descriptive reference titles, exact tags, and sketch seeds are preserved in `run03/briefs.json`. Sketches live in `run03/sketches/`.

The line-drawing constraint continues: solid backgrounds and unfilled strokes, curves, and outlines. Tags describing textures, solid shapes, or typography are interpreted through line structure. Rendering is exclusively native p5.js in the browser.

| # | Title | Palette | Structure | Signal |
| --- | --- | --- | --- | --- |
| 01 | The Affinity Engine | 04 | 05 | 02 |
| 02 | Affinity Well | 06 | 03 | 04 |
| 03 | Six Paths to Affinity | 05 | 04 | 07 |
| 04 | Assay Relay | 04 | 05 | 01 |
| 05 | The Affinity Circuit | 03 | 06 | 05 |
| 06 | Conformer / Six States | 05 | 04 | 06 |
| 07 | Between Molecule and Machine | 01 | 05 | 02 |
| 08 | The Catalytic Aperture | 02 | 03 | 06 |
| 09 | Conformer Census | 06 | 04 | 02 |
| 10 | Selective Current | 07 | 06 | 04 |

Animated sketches pause outside the viewport and while another sketch is expanded. Reduced-motion preferences display their still compositions.

Run 03 validation: all thirty canvases across the three runs render at 1200 × 675 with no loading failures or browser errors/warnings. Expanded views contain the original live canvas and zero image elements. Production build passes (existing large dependency bundle advisory remains).
