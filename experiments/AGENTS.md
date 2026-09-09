# Visual experiment conventions

Read README.md and the relevant experiment README before editing.

## Blog artwork

- Render artwork as actual p5.js canvases in both the gallery and enlarged view. Do not substitute PNG snapshots, SVGs, generated images, or raster artwork.
- New blog thumbnail experiments use line drawings unless the user changes this constraint: a solid background with unfilled curves, outlines, and wire geometry.
- When asked for the tag-based agent process, pass shuffled palette, structure, and signal tags to each artist agent; do not pass moodboard reference images. Save briefs and source attribution alongside the modules.
- Chemical structures must originate in three-dimensional coordinates, never flat chemical depictions or arbitrarily connected atom icons. `src/editorial/chemistry.js` projects generated RDKit conformers into p5 linework, with wire spheres and rigid rotation. `scripts/build-conformers.py` documents and reproduces the coordinate pipeline.
- Do not deform molecular coordinates to animate them, invent bonding, or present decorative animation as molecular dynamics. Abstract geometry is fine when it is described as conceptual rather than a real chemical structure.
- Keep illustrative conformer provenance and limitations in the experiment README. Real experimental structures or simulated trajectories require their own source attribution.
- Retain existing experiments and add new entries to the homepage with distinct numbered routes.
