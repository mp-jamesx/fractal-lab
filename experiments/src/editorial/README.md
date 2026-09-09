# Editorial thumbnails — Experiment 003

Ten live p5.js line drawings, each paired with a different actual Mirror Physics blog article. Open `/experiments/003-editorial-thumbnails`. Card captions identify the posts; enlarged views include the artwork title, conceptual description, moodboard tags, and a link to the source article.

## Process

Ten independent Astra Medium agents (`editorial01`–`editorial10`) each receive one assigned article and shuffled palette/structure/signal tags from the seven-image **Futuristic and lines** moodboard. Source-selection seed: 209094. Exact tags, reference names, article URLs, and concise article summaries are in `briefs.json`. Agents do not receive moodboard images or access each other's sketches.

The site reference is [Mirror Physics Blog](https://www.mirrorphysics.com/blog), inspected on September 9, 2026. Its spacious white editorial layout, restrained borders, and clear typography frame the art; thumbnails retain the moodboard palettes. Article concepts are interpretive artwork rather than diagrams claiming research outcomes. The common instructions are preserved in `AGENT-BRIEF.md`.

## 3D chemistry pipeline

`python3 scripts/build-conformers.py` (from Experimental, with Python RDKit and NumPy installed) regenerates `src/editorial/data/conformers.json`:

1. Parse explicit SMILES connectivity and validate it with RDKit.
2. Add hydrogens, then generate spatial conformers using seeded ETKDGv3.
3. Minimize with MMFF94 and require successful convergence.
4. Validate three-dimensional coordinate rank and export atom identities, xyz positions in ångströms, and bond connectivity/order.
5. Rotate the rigid coordinates and project them through `chemistry.js`; draw bonds and three great circles per atom as p5 linework. Depth affects line visibility. No 2D depiction generator is used.

The bundled molecules are caffeine, metronidazole, aspirin, and cyclohexane. Every atom, including hydrogens, has 3D coordinates; geometrically planar parts such as aromatic rings remain physically planar inside the 3D conformer. Bond lines communicate connectivity with uniform strokes rather than conventional 2D bond-order glyphs. The exact bond orders remain in the data.

These are **illustrative generated conformers**, not experimentally measured structures, docked poses, or molecular dynamics trajectories. Decorative rotation changes only the camera orientation. Conceptual envelopes, loops, and other graphics are not asserted to be real proteins or interaction fields. See the [RDKit conformer documentation](https://www.rdkit.org/docs/GettingStartedInPython.html) for the underlying coordinate-generation methods.

## Runtime

p5.js owns every 1200 × 675 canvas. Open/close moves the same canvas between its card and the detail dialog. No PNG snapshots, SVGs, image generation, raster artwork, or remote image assets are used. Optional animations run at 24fps, pause outside the viewport, and respect reduced motion. The browser needs only the committed coordinate JSON, not Python or RDKit.

## Article assignments

| # | Artwork | Article |
| --- | --- | --- |
| 01 | Controlled Permeability | [SOC 2, Axon, and Building for Pharma](https://mirrorphysics.substack.com/p/soc-2-axon-and-building-for-pharma) |
| 02 | The invariant neighborhood | [A new AI architecture advancing the frontier of chemical simulation](https://mirrorphysics.substack.com/p/a-new-ai-architecture-advancing-the) |
| 03 | Separating the Signal | [Updating our ADMET Toolkits](https://mirrorphysics.substack.com/p/updating-our-admet-toolkits) |
| 04 | Return to the experiment | [Experimental grounding with onepot.ai](https://mirrorphysics.substack.com/p/experimental-grounding-with-onepotai) |
| 05 | Beyond the Measuring Frame | [Benchmarking Scientific Intelligence: Bioinformatics](https://mirrorphysics.substack.com/p/benchmarking-scientific-intelliogence) |
| 06 | Coordinated Search | [Supercharging Rowan’s tools with AI agents](https://mirrorphysics.substack.com/p/supercharging-rowans-tools-with-ai) |
| 07 | Many clocks, one horizon | [Scalable Molecular Dynamics with Agentic AI](https://mirrorphysics.substack.com/p/scalable-molecular-dynamics) |
| 08 | One Candidate, Many Lenses | [AI Agents for Molecular Property Prediction](https://mirrorphysics.substack.com/p/molecular-property-prediction-with) |
| 09 | The Narrowing Field | [Structure-Based Virtual Screening with AI Agents](https://mirrorphysics.substack.com/p/virtual-screening-with-axon) |
| 10 | Everyday Chemistry, Under Observation | [From Latte to Lab: A Toy Model of Enzyme Inhibitor Screening](https://mirrorphysics.substack.com/p/from-latte-to-lab-a-toy-model-of) |

## Validation

All ten canvases render at 1200 × 675 with zero image elements or loading failures. The expanded molecular views contain the same live p5 canvas and the correct article link. Browser logs contain no errors or warnings. Conformer generation converges for all four molecules, with full-rank xyz coordinates and plausible bond lengths. Production build passes.
