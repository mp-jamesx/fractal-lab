export const title = 'Many clocks, one horizon';
export const description = 'Parallel contour loops share a central aperture, with synchronized accents suggesting orchestration across compute engines and time scales.';

const TAU = Math.PI * 2;
function point(angle, lane, phase) {
  const radius = 1 + lane * 0.0215;
  const warp = 1 + 0.055 * Math.sin(3 * angle + 0.6) + 0.032 * Math.cos(5 * angle - lane * 0.025);
  const x = 173 * radius * warp * Math.cos(angle);
  const y = 98 * radius * warp * Math.sin(angle);
  // A sheared, nested family of abstract paths preserves an open heart.
  return [600 + x + y * 0.42, 337.5 + y - x * 0.095 + Math.sin(angle * 2 + phase) * lane * 0.065];
}
function trace(p, lane, start, end, phase) {
  p.beginShape();
  const steps = Math.ceil((end - start) * 44);
  for (let j = 0; j <= steps; j++) {
    const v = point(start + (end - start) * j / steps, lane, phase);
    p.vertex(v[0], v[1]);
  }
  p.endShape();
}
function frame(p, seed, time) {
  p.background('#061111');
  p.noFill();
  p.strokeCap(p.ROUND);
  const phase = time * 0.085 + (seed % 31) * 0.02;
  // Long contiguous bundles make the multiple workers readable at thumbnail size.
  for (let lane = 0; lane < 86; lane++) {
    const group = Math.floor(lane / 14);
    p.stroke(group % 3 === 0 ? '#478c85' : group % 3 === 1 ? '#62958b' : '#385e58');
    p.strokeWeight(lane % 14 === 0 ? 1.8 : 0.8);
    trace(p, lane, 0, TAU, phase);
    const start = group * 0.79 + time * 0.035;
    p.stroke(group % 3 === 0 ? '#c5efe0' : group % 3 === 1 ? '#66dcc4' : '#8dcc8c');
    p.strokeWeight(lane % 14 === 0 ? 2 : 1.0);
    trace(p, lane, start, start + 0.68, phase);
  }
  // Sparse registration marks provide a technical scale without fabricated data.
  p.stroke('#427069');
  p.strokeWeight(1);
  for (let k = 0; k < 48; k++) {
    const a = k * TAU / 48;
    const v = point(a, 92, phase);
    const w = point(a, k % 6 === 0 ? 96 : 93.5, phase);
    p.line(v[0], v[1], w[0], w[1]);
  }
  // Small unfilled gates travel together, rather than pretending to be atoms.
  for (let k = 0; k < 6; k++) {
    const a = time * 0.035 + k * 0.79 + 0.68;
    const lane = k * 14 + 6;
    const v = point(a, lane, phase);
    const w = point(a, lane + 6, phase);
    p.stroke('#d5f5e8');
    p.strokeWeight(1.6);
    p.line(v[0], v[1], w[0], w[1]);
  }
  // A restrained crosshair leaves the center completely open.
  p.stroke('#41675f');
  p.strokeWeight(1);
  p.line(589, 337.5, 611, 337.5);
  p.line(600, 326.5, 600, 348.5);
}
export function draw(p, seed) { frame(p, seed, 0); }
export function animate(p, seed) { frame(p, seed, p.millis() / 1000); }
