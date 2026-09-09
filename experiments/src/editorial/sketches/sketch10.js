import { drawMolecule } from '../chemistry.js';

export const title = 'Everyday Chemistry, Under Observation';
export const description = 'A rotating caffeine conformer meets an array of assay wells and suspended optical contours: everyday chemistry moving into an experimental workflow.';

function platePoint(u, v, z = 0) {
  return [806 + u * 43 - v * 24, 341 + u * 15 + v * 30 - z];
}

function outline(p, points, close = false) {
  p.beginShape();
  for (const [x, y] of points) p.vertex(x, y);
  p.endShape(close ? p.CLOSE : undefined);
}

function well(p, u, v, radius, lift = 0) {
  const points = [];
  for (let i = 0; i <= 64; i++) {
    const a = i * Math.PI / 32;
    points.push(platePoint(u + radius * Math.cos(a), v + radius * Math.sin(a), lift));
  }
  outline(p, points);
}

function render(p, seed, time) {
  p.background('#080e10');
  p.noFill();
  p.strokeCap(p.ROUND);

  // Sparse registration marks keep the composition open on an editorial page.
  p.stroke('#284247');
  p.strokeWeight(1);
  for (let x = 56; x < 1150; x += 16) {
    p.point(x, 77);
    p.point(x, 605);
  }
  for (const x of [56, 1144]) {
    p.line(x, 77, x, 107);
    p.line(x, 575, x, 605);
  }

  // A generous broken instrument aperture surrounds the molecular specimen.
  p.stroke('#254d51');
  p.strokeWeight(1.1);
  for (let j = 0; j < 4; j++) {
    const points = [];
    for (let i = 0; i <= 110; i++) {
      const a = -2.93 + i / 110 * 4.93;
      points.push([350 + (282 + j * 8) * Math.cos(a), 319 + (207 + j * 5) * Math.sin(a)]);
    }
    outline(p, points);
  }
  p.stroke('#64d9cb');
  p.strokeWeight(1.8);
  for (const a of [-2.5, -.55, 1.56]) {
    p.line(350 + 309 * Math.cos(a), 319 + 228 * Math.sin(a), 350 + 321 * Math.cos(a), 319 + 237 * Math.sin(a));
  }

  drawMolecule(p, 'caffeine', {
    x: 340, y: 308, scale: 67,
    rx: .7, ry: .4 + Math.sin(time * .13) * .34, rz: -.29,
    color: '#e2efec', accent: '#73ecd5', hydrogens: true,
    weight: 2.1, atomRadius: .19,
  });

  // Conceptual microplate, drawn as two offset planes and wire well rims.
  for (const z of [-18, 0]) {
    p.stroke(z === 0 ? '#80aaa9' : '#27494d');
    p.strokeWeight(z === 0 ? 1.5 : 1);
    outline(p, [platePoint(-.7, -.7, z), platePoint(6.7, -.7, z), platePoint(6.7, 4.7, z), platePoint(-.7, 4.7, z)], true);
  }
  p.stroke('#476d70');
  for (const [u, v] of [[-.7,-.7],[6.7,-.7],[6.7,4.7],[-.7,4.7]]) {
    outline(p, [platePoint(u,v),platePoint(u,v,-18)]);
  }
  for (let v = 0; v < 5; v++) {
    for (let u = 0; u < 7; u++) {
      p.stroke('#507f82');
      p.strokeWeight(1.15);
      well(p, u, v, .32);
      p.stroke('#274e53');
      p.strokeWeight(.8);
      well(p, u, v, .23, -8);
    }
  }

  // Optical sampling paths: decorative contours, not a signal chart.
  for (let j = 0; j < 16; j++) {
    p.stroke(j % 4 === 0 ? '#96dcb1' : '#327c77');
    p.strokeWeight(j % 4 === 0 ? 1.3 : .85);
    const path = [];
    for (let i = 0; i <= 100; i++) {
      const t = i / 100;
      const x = 635 + t * 443;
      const y = 189 + j * 4.8 + Math.sin(t * Math.PI * 1.5 + .2) * 37
        + Math.sin(t * Math.PI * 2 + time * .16) * 4;
      path.push([x, y]);
    }
    outline(p, path);
  }
  for (const [u, v] of [[1,1],[3,2],[5,3]]) {
    const [x, y] = platePoint(u, v);
    p.stroke('#4db9ac');
    p.strokeWeight(1);
    for (let yy = y - 14; yy > 284; yy -= 9) p.point(x, yy);
    p.stroke('#9defce');
    p.strokeWeight(1.6);
    well(p, u, v, .34, 3);
    p.line(x - 4, 281, x + 4, 281);
  }
}

export function draw(p, seed) { render(p, seed, 0); }
export function animate(p, seed) { render(p, seed, p.millis() / 1000); }
