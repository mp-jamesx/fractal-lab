export const title = 'Conformer Census';
export const description = 'Six folded molecular ribbons are catalogued in a precise monochrome specimen grid. Fine silver contours breathe around white targeting apertures, turning a search through conformations into a living atlas.';

const TAU = Math.PI * 2;

function ribbonPoint(t, lane, variant, clock, seed) {
  const phase = variant * 0.82 + (seed % 997) / 997;
  const pulse = Math.sin(clock + phase) * 0.035;
  const radial = 68 + 17 * Math.cos(3 * t + phase) + lane * 2.05;
  const x = radial * Math.cos(t) + 25 * Math.cos(2 * t + phase);
  const y = radial * Math.sin(t) * (0.63 + variant * 0.025) + 25 * Math.sin(2 * t + phase);
  const z = 43 * Math.sin(2 * t + phase + pulse) + lane * 1.15 * Math.sin(t * 3 + phase);
  const a = -0.5 + variant * 0.22 + pulse;
  return [x * Math.cos(a) - y * Math.sin(a), (x * Math.sin(a) + y * Math.cos(a)) * 0.85 + z * 0.55];
}

function render(p, seed, clock) {
  p.background('#101112');
  p.noFill();
  p.strokeCap(p.SQUARE);
  // A specimen plate with intentionally generous gutters.
  p.stroke('#414346');
  p.strokeWeight(1);
  p.line(66, 76, 1134, 76);
  p.line(66, 599, 1134, 599);
  for (let col = 0; col <= 3; col++) {
    const x = 66 + col * 356;
    p.line(x, 76, x, 599);
  }
  p.line(66, 337.5, 1134, 337.5);
  // Discrete registration strokes replace textual annotations.
  p.stroke('#bec0c3');
  for (let i = 0; i < 16; i++) {
    const x = 69 + i * 7;
    p.line(x, 51, x, 51 - (i % 5 === 0 ? 11 : 5));
  }
  p.stroke('#63666a');
  for (let i = 0; i < 8; i++) p.line(1020 + i * 15, 48, 1028 + i * 15, 48);

  for (let index = 0; index < 6; index++) {
    const col = index % 3;
    const row = Math.floor(index / 3);
    const cx = 244 + col * 356;
    const cy = 205 + row * 261.5;
    p.push();
    p.translate(cx, cy);
    // Open circular targeting corners, and dashed measuring axes.
    p.stroke('#343639');
    p.strokeWeight(1);
    for (let j = -15; j <= 15; j++) {
      if (Math.abs(j) > 10) p.line(j * 10, 0, j * 10 + 2, 0);
    }
    for (let j = -10; j <= 10; j++) {
      if (Math.abs(j) > 7) p.line(0, j * 10, 0, j * 10 + 2);
    }
    // Each uninterrupted curve is one cross section of a folded ribbon.
    for (let band = 0; band < 19; band++) {
      const lane = band - 9;
      p.stroke(band % 6 === 0 ? '#fafafa' : '#989ca1');
      p.strokeWeight(band % 6 === 0 ? 1.25 : 0.7);
      p.beginShape();
      for (let step = 0; step <= 144; step++) {
        const t = step / 144 * TAU;
        const q = ribbonPoint(t, lane, index, clock, seed);
        p.vertex(q[0], q[1]);
      }
      p.endShape(p.CLOSE);
    }
    // A white aperture follows the same material point through the atlas.
    const focus = ribbonPoint(0.8 + index * 0.61, 0, index, clock, seed);
    p.stroke('#ffffff');
    p.strokeWeight(1.3);
    p.circle(focus[0], focus[1], 12);
    p.line(focus[0] - 13, focus[1], focus[0] - 8, focus[1]);
    p.line(focus[0] + 8, focus[1], focus[0] + 13, focus[1]);
    p.line(focus[0], focus[1] - 13, focus[0], focus[1] - 8);
    p.line(focus[0], focus[1] + 8, focus[0], focus[1] + 13);
    p.stroke('#777b80');
    p.strokeWeight(1);
    p.line(-156, -109, -142, -109);
    p.line(-156, -109, -156, -95);
    for (let mark = 0; mark <= index; mark++) p.line(-133 + mark * 5, -109, -133 + mark * 5, -104);
    for (let mark = 0; mark < 9; mark++) {
      const x = 75 + mark * 8;
      p.line(x, 109, x, mark % 4 === 0 ? 102 : 106);
    }
    p.pop();
  }
  p.stroke('#777b80');
  p.strokeWeight(1);
  p.line(66, 623, 206, 623);
  p.line(66, 619, 66, 627);
  p.line(206, 619, 206, 627);
  for (let i = 0; i < 4; i++) p.rect(1101 + i * 9, 619, 4, 8);
}

export function draw(p, seed) { render(p, seed, 0); }
export function animate(p, seed) {
  if (p.frameCount % 3 === 0) render(p, seed, p.millis() * 0.00028);
}
