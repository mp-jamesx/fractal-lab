export const title = 'Affinity Well';
export const description = 'Silver computational contours fold around a molecular binding pocket, locating a single candidate within a vast search space.';

export function draw(p, seed) {
  p.background('#101112');
  p.noFill();
  p.strokeCap(p.ROUND);
  const cx = 600, cy = 338;
  const phase = (seed % 101) / 101;
  // Every closed path is an independently sampled energy contour.
  const contour = (i, a) => {
    const t = i / 43;
    const r = 116 + 228 * t;
    const ripple = 1 + (0.085 + t * 0.095) * Math.cos(a * 3 + 0.8 + phase)
      + 0.054 * Math.sin(a * 5 - t * 2.4) + 0.02 * Math.cos(a * 9 + t * 4);
    return [cx + r * ripple * Math.cos(a) * 1.40 + 16 * Math.sin(t * 4),
      cy + r * ripple * Math.sin(a) * 0.77 + 11 * Math.cos(t * 5)];
  };
  for (let i = 43; i >= 0; i--) {
    p.stroke(i % 8 === 0 ? '#eeeeeb' : i % 3 === 0 ? '#b6b8b9' : '#696c70');
    p.strokeWeight(i % 8 === 0 ? 1.8 : 0.85);
    p.beginShape();
    for (let k = 0; k < 360; k++) {
      const q = contour(i, k * Math.PI * 2 / 360);
      p.vertex(...q);
    }
    p.endShape(p.CLOSE);
  }
  // Sparse transverse correspondences make the folds read as a computed surface.
  p.stroke('#74787b'); p.strokeWeight(0.6);
  for (let n = 0; n < 15; n++) {
    const a = n * Math.PI * 2 / 15 + 0.19;
    p.beginShape();
    for (let i = 17; i <= 43; i++) p.vertex(...contour(i, a));
    p.endShape();
  }
  // Molecular candidate, deliberately suspended in the empty center.
  const hex = (x, y, r) => {
    const pts = Array.from({ length: 6 }, (_, i) => [x + r * Math.cos(i * Math.PI / 3), y + r * Math.sin(i * Math.PI / 3)]);
    p.beginShape(); pts.forEach(q => p.vertex(...q)); p.endShape(p.CLOSE); return pts;
  };
  p.stroke('#f6f6ef'); p.strokeWeight(2.2);
  const h = hex(588, 333, 29);
  p.line(h[0][0], h[0][1], 646, 333);
  p.line(646, 333, 663, 306);
  p.line(h[3][0], h[3][1], 542, 306);
  p.line(h[2][0], h[2][1], 557, 382);
  p.circle(668, 298, 13); p.circle(538, 299, 11); p.circle(552, 390, 11);
  p.strokeWeight(1); p.circle(588, 333, 38);
  // Measurement ticks articulate the silence outside the biological contour.
  p.stroke('#5a5e62'); p.strokeWeight(1);
  for (let x = 90; x <= 1110; x += 15) {
    p.line(x, 58, x, 58 + (x % 90 === 0 ? 10 : 4));
    p.line(x, 617, x, 617 - (x % 90 === 0 ? 10 : 4));
  }
  p.stroke('#a0a4a6');
  for (const [x, y, dir] of [[72, 100, 1], [1128, 100, -1], [72, 575, 1], [1128, 575, -1]]) {
    p.line(x, y, x + 22 * dir, y); p.line(x, y - 11, x, y + 11);
  }
}
