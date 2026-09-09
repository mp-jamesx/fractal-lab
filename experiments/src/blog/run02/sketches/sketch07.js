export const title = 'A Fold in the Search Space';
export const description = 'A suspended molecular ribbon turns through an open computational lattice, its folds described entirely by ivory, taupe and black linework.';

export function draw(p, seed) {
  p.background('#F3EFE5');
  p.noFill();
  p.strokeCap(p.ROUND);
  p.strokeJoin(p.ROUND);
  const phase = (seed % 103) * 0.0009;
  // An abstract folding coordinate: a broad sheet twisting around a
  // softly wandering backbone. Projection keeps the end sections open.
  const surface = (t, v) => {
    const theta = t * Math.PI * 3.05 - 0.85 + phase;
    const width = 79 + 31 * Math.sin(Math.PI * t);
    const x = -363 + 726 * t;
    const y = 50 * Math.sin(t * Math.PI * 2 - 0.5);
    const z = 45 * Math.cos(t * Math.PI * 2 + 0.35);
    const sy = y + width * v * Math.cos(theta);
    const sz = z + width * v * Math.sin(theta);
    return [600 + x + sz * 0.40, 335 + sy + sz * 0.77 - x * 0.16];
  };
  const trace = (fn, count) => {
    p.beginShape();
    for (let i = 0; i <= count; i++) {
      const q = fn(i / count);
      p.vertex(q[0], q[1]);
    }
    p.endShape();
  };
  // Widely separated meridians expose the folds without tonal hatching.
  for (let j = 0; j <= 8; j++) {
    const v = -1 + j / 4;
    p.stroke(j === 0 || j === 8 ? '#24221F' : '#9B8C7B');
    p.strokeWeight(j === 0 || j === 8 ? 2.8 : 1.8);
    trace(t => surface(t, v), 340);
  }
  p.stroke('#3B352F');
  p.strokeWeight(1.65);
  for (let i = 0; i <= 24; i++) {
    const t = i / 24;
    trace(v => surface(t, v * 2 - 1), 24);
  }
  // A single black backbone follows the ribbon's central conformation.
  p.stroke('#24221F');
  p.strokeWeight(2.5);
  trace(t => surface(t, 0), 280);
  // Unconnected contour fragments suggest nearby candidate conformations.
  p.stroke('#B1A391');
  p.strokeWeight(1.7);
  for (let k = 0; k < 3; k++) {
    trace(s => {
      const t = 0.15 + s * 0.27;
      const q = surface(t, -1);
      return [q[0] - 7 * (k + 1), q[1] - 24 * (k + 1)];
    }, 100);
  }
}
