export const title = 'Conformer / Six States';
export const description = 'Six folded molecular ribbons form an industrial specimen atlas. White contour tracks expose each candidate’s geometry; lime registration marks and orange binding-site rings isolate the promising states. The folds breathe slowly within their measured grid.';

const TAU = Math.PI * 2;
function ribbon(p, cx, cy, variant, phase) {
  const tilt = [-0.38, 0.28, -0.08, 0.35, -0.3, 0.12][variant];
  const ca = Math.cos(tilt), sa = Math.sin(tilt);
  const point = (t, s) => {
    const wave = Math.sin(t * 2 + variant * 0.65 + phase);
    const radius = 77 + 17 * Math.cos(3 * t + variant * 0.77) + s * 25;
    const x = radius * Math.cos(t) * 1.38;
    const y = radius * Math.sin(t);
    const z = 49 * wave + s * 27 * Math.sin(t * 2 + variant);
    const xx = x * ca - y * sa;
    const yy = x * sa + y * ca;
    return [cx + xx, cy + yy * 0.65 - z * 0.8];
  };
  // Each uninterrupted line is one longitudinal section of the folded ribbon.
  p.stroke('#e5e8df');
  p.strokeWeight(0.95);
  for (let j = 0; j <= 19; j++) {
    const s = -1 + j / 19 * 2;
    p.beginShape();
    for (let k = 0; k <= 156; k++) {
      const v = point(k / 156 * TAU, s);
      p.vertex(v[0], v[1]);
    }
    p.endShape();
  }
  // Sparse transverse seams give the surface an engineered, inspectable scale.
  p.stroke('#676d63');
  p.strokeWeight(0.8);
  for (let k = 0; k < 12; k++) {
    p.beginShape();
    for (let j = 0; j <= 14; j++) {
      const v = point(k / 12 * TAU, -1 + j / 7);
      p.vertex(v[0], v[1]);
    }
    p.endShape();
  }
  const t = 0.65 + variant * 0.66;
  const target = point(t, 0);
  p.stroke('#ff783b');
  p.strokeWeight(1.6);
  p.circle(target[0], target[1], 17);
  p.circle(target[0], target[1], 26);
  p.line(target[0] + 17, target[1], target[0] + 42, target[1]);
  p.line(target[0] + 42, target[1], target[0] + 52, target[1] - 10);
  if (variant === 1 || variant === 4) {
    p.stroke('#caff4b');
    p.strokeWeight(2.1);
    p.beginShape();
    for (let k = 0; k <= 156; k++) {
      const v = point(k / 156 * TAU, 1);
      p.vertex(v[0], v[1]);
    }
    p.endShape();
  }
}
function render(p, seed, time) {
  p.background('#101310');
  p.noFill();
  p.strokeCap(p.SQUARE);
  const x0 = 48, y0 = 44, cellW = 368, cellH = 293.5;
  p.stroke('#3d4539');
  p.strokeWeight(1);
  p.rect(x0, y0, cellW * 3, cellH * 2);
  for (let col = 1; col < 3; col++) p.line(x0 + col * cellW, y0, x0 + col * cellW, y0 + cellH * 2);
  p.line(x0, y0 + cellH, x0 + cellW * 3, y0 + cellH);
  for (let i = 0; i < 6; i++) {
    const x = x0 + i % 3 * cellW, y = y0 + Math.floor(i / 3) * cellH;
    const cx = x + cellW / 2, cy = y + cellH / 2 + 2;
    p.stroke('#313b2b');
    p.strokeWeight(1);
    for (let d = -145; d < 150; d += 12) p.line(cx + d, cy, cx + d + 3, cy);
    for (let d = -112; d < 118; d += 12) p.line(cx, cy + d, cx, cy + d + 3);
    p.stroke('#caff4b');
    p.strokeWeight(1.3);
    p.line(x + 15, y + 29, x + 15, y + 15);
    p.line(x + 15, y + 15, x + 30, y + 15);
    // Unary index bars replace typography.
    for (let k = 0; k <= i; k++) p.line(x + 25 + 6 * k, y + cellH - 17, x + 25 + 6 * k, y + cellH - 23);
    p.stroke('#67725a');
    p.line(x + cellW - 29, y + cellH - 15, x + cellW - 15, y + cellH - 15);
    p.line(x + cellW - 15, y + cellH - 29, x + cellW - 15, y + cellH - 15);
    const phase = Math.sin(time * 0.36 + i * 0.7 + seed * 0.001) * 0.12;
    ribbon(p, cx, cy, i, phase);
  }
}
export function draw(p, seed) { render(p, seed, 0); }
export function animate(p, seed) { render(p, seed, p.millis() / 1000); }
