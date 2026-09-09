export const title = 'Orbital Affinity';
export const description = 'A golden molecular fold hovers above a curved computational horizon, its open contours suggesting a possible binding site.';

export function draw(p, seed) {
  p.background('#271745');
  p.noFill();
  p.strokeCap(p.ROUND);
  p.strokeJoin(p.ROUND);
  const gold = '#F2C54B';
  const white = '#E9E3F4';
  const violet = '#806695';
  const path = (fn, n = 150) => {
    p.beginShape();
    for (let i = 0; i <= n; i++) {
      const a = fn(i / n);
      p.vertex(a[0], a[1]);
    }
    p.endShape();
  };

  // Widely spaced geodesic construction, pitched diagonally across the frame.
  p.push();
  p.translate(796, 1101);
  p.rotate(-0.25);
  p.stroke(white);
  p.strokeWeight(2.1);
  path(t => {
    const a = -2.65 + t * 2.25;
    return [880 * Math.cos(a), 880 * Math.sin(a)];
  });
  p.stroke(violet);
  p.strokeWeight(1.5);
  for (let j = 1; j <= 4; j++) {
    const r = 880 - j * 82;
    path(t => {
      const a = -2.65 + t * 2.25;
      return [r * Math.cos(a), r * Math.sin(a)];
    });
  }
  for (let j = -4; j <= 4; j++) {
    const start = j * 178;
    const top = -Math.sqrt(880 * 880 - start * start);
    path(t => [start * (1 - 0.31 * t * t), top + 640 * t + 90 * t * t]);
  }
  p.pop();

  // A small split toroidal fold: cross-sections remain separate and airy.
  p.push();
  p.translate(538, 251);
  p.rotate(-0.39);
  const project = (a, b) => {
    const major = 83 + 9 * Math.cos(3 * a);
    const tube = 24 + 6 * Math.sin(2 * a);
    const x = (major + tube * Math.cos(b)) * Math.cos(a);
    const y = (major + tube * Math.cos(b)) * Math.sin(a);
    const z = tube * Math.sin(b) + 19 * Math.sin(2 * a);
    return [x, y * 0.67 + z * 0.73];
  };
  p.stroke(gold);
  p.strokeWeight(2.1);
  for (let j = 0; j < 11; j++) {
    const a = 0.42 + j * 0.49;
    path(t => project(a, t * Math.PI * 2), 60);
  }
  for (const b of [0, Math.PI * 0.5, Math.PI, Math.PI * 1.5]) {
    path(t => project(0.42 + t * 4.9, b), 110);
  }
  // A free ligand fits the interruption in the fold.
  p.stroke(white);
  p.strokeWeight(2.2);
  p.push();
  p.translate(101, -9);
  p.rotate(0.18);
  p.beginShape();
  for (let i = 0; i < 6; i++) {
    const a = i * Math.PI / 3;
    p.vertex(19 * Math.cos(a), 19 * Math.sin(a));
  }
  p.endShape(p.CLOSE);
  p.line(19, 0, 42, 0);
  p.line(42, 0, 52, -17);
  p.line(42, 0, 53, 17);
  p.line(-9.5, -16.45, -20, -35);
  p.pop();
  p.pop();

  // Open registration brackets give a computational scale without labels.
  p.stroke(gold);
  p.strokeWeight(1.7);
  for (const [x,y,s] of [[401,155,1],[693,327,-1]]) {
    p.line(x, y, x + 19 * s, y);
    p.line(x, y, x, y + 19 * s);
  }
  p.stroke(white);
  p.strokeWeight(1.5);
  p.line(184, 478, 215, 461);
  p.line(198, 456, 204, 483);
}
