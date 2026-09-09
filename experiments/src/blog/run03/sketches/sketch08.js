export const title = 'The Catalytic Aperture';
export const description = 'An immense, breathing pocket of molecular possibility. Teal and white contour filaments fold around an unresolved green ligand, combining an organic binding cavity with the precision of a future instrument.';

const TAU = Math.PI * 2;

function contour(a, q, time, phase) {
  const turn = a + 0.23 * Math.sin(q * Math.PI) + 0.017 * Math.sin(time);
  const lobe = 1 + (0.07 + q * 0.075) * Math.cos(3 * a + q * 2.4 + phase)
    + 0.045 * Math.sin(5 * a - q * 1.7 + 0.13 * Math.sin(time));
  const x = (112 + 327 * q) * Math.cos(turn) * lobe;
  const y = (70 + 183 * q) * Math.sin(turn) * lobe;
  return [600 + x + 26 * q * Math.sin(2 * a + q * 3),
    337.5 + y + 24 * q * Math.cos(2 * a - q * 2)];
}

function trace(p, q, time, phase, start = 0, end = TAU) {
  const count = Math.ceil((end - start) * 34);
  p.beginShape();
  for (let i = 0; i <= count; i++) {
    const pt = contour(start + (end - start) * i / count, q, time, phase);
    p.vertex(pt[0], pt[1]);
  }
  p.endShape();
}

function render(p, seed, time) {
  p.background('#060d0c');
  p.noFill();
  p.strokeCap(p.ROUND);
  p.strokeJoin(p.ROUND);
  const phase = (seed % 997) / 997;

  // Quiet hard-edged instrument geometry frames the soft aperture.
  p.stroke('#25443e');
  p.strokeWeight(1);
  for (const [x, y, sx, sy] of [[60, 54, 1, 1], [1140, 54, -1, 1],
    [60, 621, 1, -1], [1140, 621, -1, -1]]) {
    p.line(x, y, x + sx * 66, y);
    p.line(x, y, x, y + sy * 47);
  }
  for (let i = 0; i < 9; i++) {
    const y = 289 + i * 12;
    p.line(68, y, i === 4 ? 90 : 78, y);
    p.line(1132, y, i === 4 ? 1110 : 1122, y);
  }

  // Individually drawn contours bunch, open and fold like a conformer ensemble.
  for (let i = 0; i < 43; i++) {
    const q = Math.pow(i / 42, 0.88);
    p.stroke(i % 7 === 0 ? '#dbebe3' : i % 3 === 0 ? '#337c70' : '#63c3ab');
    p.strokeWeight(i % 7 === 0 ? 1.45 : 0.9);
    trace(p, q, time, phase);
  }

  // A pair of displaced wavefronts creates the overlapping, irregular lip.
  p.push();
  p.translate(12 * Math.sin(time * 0.35), -6);
  p.stroke('#84dcaf');
  p.strokeWeight(1.2);
  for (let i = 0; i < 8; i++) {
    const q = 0.23 + i * 0.041;
    trace(p, q, -time * 0.5, phase + 0.67, 3.62, 6.03);
  }
  p.pop();

  // The unfilled candidate scaffold is suspended in the central negative space.
  p.push();
  p.translate(600, 337.5);
  p.rotate(-0.19 + 0.028 * Math.sin(time * 0.63));
  p.stroke('#b6ec76');
  p.strokeWeight(2);
  const r = 24;
  const hex = Array.from({ length: 6 }, (_, i) => [r * Math.cos(i * TAU / 6), r * Math.sin(i * TAU / 6)]);
  p.beginShape();
  hex.forEach(([x, y]) => p.vertex(x, y));
  p.endShape(p.CLOSE);
  p.line(24, 0, 44, -12);
  p.line(44, -12, 63, -1);
  p.circle(69, 3, 10);
  p.line(-24, 0, -45, 12);
  p.line(-45, 12, -62, 2);
  p.circle(-68, -1, 10);
  for (const i of [0, 2, 4]) {
    const a = hex[i], b = hex[(i + 1) % 6];
    p.line(a[0] * 0.71, a[1] * 0.71, b[0] * 0.71, b[1] * 0.71);
  }
  p.pop();

  // Two small travelling outlines read as observations, rather than decoration.
  p.stroke('#d6f0df');
  p.strokeWeight(1.5);
  for (let i = 0; i < 2; i++) {
    const [x, y] = contour(0.85 + i * Math.PI + time * 0.075, 0.79, time, phase);
    p.circle(x, y, 9);
  }
}

export function draw(p, seed) {
  render(p, seed, 0);
}

export function animate(p, seed) {
  if (p.frameCount % 3 === 0) render(p, seed, p.millis() * 0.00035);
}
