export const title = 'Six Paths to Affinity';
export const description = 'A systematic atlas of folded molecular search spaces. White contour ribbons repeat across a dark specimen grid; a lime candidate and orange binding sites interrupt the rhythm.';

export function draw(p, seed) {
  p.background('#111310');
  p.noFill();
  p.strokeCap(p.ROUND);
  const paper = '#eceee6', lime = '#c7f65b', orange = '#ff7945';
  const left = 54, top = 48, cw = 364, ch = 289;
  // Open registration corners keep the specimens suspended in a shared atlas.
  p.stroke('#40453b'); p.strokeWeight(1);
  for (let c = 0; c <= 3; c++) {
    for (let r = 0; r <= 2; r++) {
      const x = left + c * cw, y = top + r * ch;
      p.line(x - 6, y, x + 6, y);
      p.line(x, y - 6, x, y + 6);
    }
  }
  for (let cell = 0; cell < 6; cell++) {
    const col = cell % 3, row = Math.floor(cell / 3);
    const cx = left + cw * (col + .5), cy = top + ch * (row + .5);
    const phase = cell * .59 + (seed % 37) * .011;
    // Segmented axes rather than typography: an instrument's quiet indexing.
    p.stroke('#41473b'); p.strokeWeight(1);
    for (let x = -151; x <= 151; x += 11) p.line(cx + x, cy, cx + x + 2, cy);
    for (let y = -116; y <= 116; y += 11) p.line(cx, cy + y, cx, cy + y + 2);
    p.push(); p.translate(cx, cy); p.rotate(-.36 + col * .25 - row * .17);
    // Nested closed curves describe a wide folded band with a distinct hollow.
    for (let j = 0; j < 17; j++) {
      const u = j / 16;
      p.stroke(cell === 4 ? lime : paper);
      p.strokeWeight(j === 0 || j === 16 ? 1.85 : 1.05);
      p.beginShape();
      for (let k = 0; k <= 240; k++) {
        const t = k / 240 * Math.PI * 2;
        const r = 51 + u * 52 + 10 * Math.cos(3 * t + phase) + 7 * Math.sin(2 * t - phase);
        const x = r * Math.cos(t) * 1.19 + 17 * Math.sin(2 * t + phase) * Math.sin(u * Math.PI);
        const y = r * Math.sin(t) * .75 + 13 * Math.cos(2 * t + phase) + (u - .5) * 17 * Math.cos(t);
        p.vertex(x, y);
      }
      p.endShape(p.CLOSE);
    }
    // Each hollow contains a small bond diagram: distinct candidates in a screen.
    const vertices = 5 + cell % 2;
    const coords = [];
    for (let i = 0; i < vertices; i++) {
      const a = i * Math.PI * 2 / vertices + phase;
      coords.push([Math.cos(a) * 19, Math.sin(a) * 19]);
    }
    p.stroke(orange); p.strokeWeight(1.6);
    for (let i = 0; i < vertices; i++) {
      const a = coords[i], b = coords[(i + 1) % vertices];
      p.line(a[0], a[1], b[0], b[1]);
    }
    const a = coords[cell % vertices];
    p.line(a[0], a[1], a[0] * 1.7, a[1] * 1.7);
    p.circle(a[0] * 1.9, a[1] * 1.9, 6);
    p.pop();
    // Compact binary-looking line marks carry the editorial grid's cadence.
    p.stroke(cell === 4 ? lime : '#697260'); p.strokeWeight(1.4);
    for (let i = 0; i < 9; i++) {
      const x = cx - 30 + i * 7;
      p.line(x, cy + 128, x, cy + 128 + ((i + cell) % 3 === 0 ? 7 : 3));
    }
    if (cell === 4) {
      p.stroke(lime); p.strokeWeight(1.5);
      const x = left + col * cw + 14, y = top + row * ch + 13;
      p.line(x, y + 30, x, y); p.line(x, y, x + 30, y);
      p.line(x + cw - 28, y + ch - 56, x + cw - 28, y + ch - 26);
      p.line(x + cw - 28, y + ch - 26, x + cw - 58, y + ch - 26);
    }
  }
}
