export const title = 'Conformation Playground';
export const description = 'A fluid molecular loop folds around a small geometric ligand, with muted blue contours tracing an experimental search through conformations.';

export function draw(p, seed) {
  p.background('#f7f8f5');
  p.noFill();
  p.strokeCap(p.ROUND);
  p.strokeJoin(p.ROUND);

  // A loose, asymmetric protein-like cord: its paired edges remain open.
  const points = [
    [416, 564], [366, 523], [390, 456], [470, 436],
    [532, 463], [553, 522], [627, 553], [709, 528],
    [731, 458], [678, 409], [594, 397], [546, 348],
    [565, 282], [636, 264], [699, 297], [714, 360],
    [775, 391], [860, 361], [887, 281], [851, 205],
    [769, 191], [726, 144], [754, 101], [841, 93],
    [920, 131], [959, 199], [974, 283], [948, 359],
    [971, 427], [1029, 451]
  ];
  const sample = (i, t) => {
    const a = points[Math.max(0, i - 1)];
    const b = points[i];
    const c = points[i + 1];
    const d = points[Math.min(points.length - 1, i + 2)];
    return [0, 1].map(k => 0.5 * ((2 * b[k]) + (-a[k] + c[k]) * t +
      (2 * a[k] - 5 * b[k] + 4 * c[k] - d[k]) * t * t +
      (-a[k] + 3 * b[k] - 3 * c[k] + d[k]) * t * t * t));
  };
  const curve = [];
  for (let i = 0; i < points.length - 1; i++) {
    for (let j = 0; j < 30; j++) curve.push(sample(i, j / 30));
  }
  curve.push(points[points.length - 1]);
  const edge = (index, offset) => {
    const here = curve[index];
    const before = curve[Math.max(0, index - 1)];
    const after = curve[Math.min(curve.length - 1, index + 1)];
    const dx = after[0] - before[0], dy = after[1] - before[1];
    const length = Math.hypot(dx, dy) || 1;
    const width = 1 + 0.18 * Math.sin(index * 0.014 + seed * 0.001);
    return [here[0] - dy / length * offset * width, here[1] + dx / length * offset * width];
  };
  for (const offset of [-13, 13]) {
    p.stroke('#557c98');
    p.strokeWeight(2.6);
    p.beginShape();
    curve.forEach((_, i) => p.vertex(...edge(i, offset)));
    p.endShape();
  }
  // Sparse ribs articulate the cord without shading its interior.
  p.strokeWeight(1.5);
  for (let i = 15; i < curve.length - 15; i += 28) {
    p.line(...edge(i, -13), ...edge(i, 13));
  }
  p.stroke('#292f34');
  p.strokeWeight(2.2);
  for (const i of [0, curve.length - 1]) p.line(...edge(i, -13), ...edge(i, 13));

  // A candidate ligand is held apart from the folding structure.
  p.push();
  p.translate(259, 294);
  p.rotate(-0.19);
  const hex = (cx, cy, r, inset) => {
    p.beginShape();
    for (let k = 0; k < 6; k++) {
      const a = k * Math.PI / 3;
      p.vertex(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    }
    p.endShape(p.CLOSE);
    if (inset) {
      for (let k = 0; k < 6; k += 2) {
        const a = k * Math.PI / 3, b = (k + 1) * Math.PI / 3;
        p.line(cx + Math.cos(a) * (r - 9), cy + Math.sin(a) * (r - 9),
          cx + Math.cos(b) * (r - 9), cy + Math.sin(b) * (r - 9));
      }
    }
  };
  hex(0, 0, 43, true);
  p.line(43, 0, 80, -19);
  p.line(80, -19, 106, 7);
  p.line(-43, 0, -71, -17);
  p.circle(-79, -22, 17);
  p.line(-21.5, 37.24, -30, 69);
  p.circle(-32, 79, 17);
  p.pop();

  // Broken search arcs imply motion, leaving a broad quiet upper-left field.
  p.stroke('#557c98');
  p.strokeWeight(1.8);
  p.bezier(336, 284, 388, 216, 477, 226, 514, 282);
  p.bezier(352, 304, 416, 271, 461, 295, 482, 335);
  p.line(502, 278, 514, 282);
  p.line(514, 282, 512, 270);
  p.stroke('#292f34');
  p.strokeWeight(1.7);
  p.arc(258, 294, 195, 195, 2.45, 3.71);
  p.arc(258, 294, 214, 214, 1.04, 1.68);
}
