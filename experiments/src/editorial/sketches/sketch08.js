import { drawMolecule } from '../chemistry.js';

export const title = 'One Candidate, Many Lenses';
export const description = 'A three-dimensional aspirin conformer sits between analytical apertures. Isometric frames and repeated calibration marks suggest a candidate seen through several property models.';

const ivory = '#e8e5db';
const charcoal = '#424340';

function ellipsePath(p, x, y, a, b, start = 0, end = Math.PI * 2) {
  p.beginShape();
  for (let i = 0; i <= 120; i++) {
    const t = start + (end - start) * i / 120;
    p.vertex(x + Math.cos(t) * a, y + Math.sin(t) * b);
  }
  p.endShape();
}

function frame(p, x, y, r, time, upper) {
  // An abstract isometric instrument plane, not a molecular field.
  const h = r * .355;
  p.stroke(charcoal);
  p.strokeWeight(1);
  for (let k = -3; k <= 3; k++) {
    const q = k / 4;
    p.line(x + q * r, y - h * (1 - Math.abs(q)), x + q * r, y + h * (1 - Math.abs(q)));
  }
  p.stroke(ivory);
  p.strokeWeight(1.5);
  p.beginShape();
  p.vertex(x - r, y); p.vertex(x, y - h);
  p.vertex(x + r, y); p.vertex(x, y + h);
  p.endShape(p.CLOSE);
  ellipsePath(p, x, y, r * .66, h * .67);
  ellipsePath(p, x, y, r * .72, h * .73);
  for (let i = 0; i < 32; i++) {
    const a = i * Math.PI / 16;
    const long = i % 4 === 0;
    const v = long ? .84 : .79;
    p.strokeWeight(long ? 1.6 : .75);
    p.line(x + Math.cos(a) * r * .75, y + Math.sin(a) * h * .76,
      x + Math.cos(a) * r * v, y + Math.sin(a) * h * (v + .01));
  }
  const phase = time * .10 + (upper ? 0 : Math.PI);
  p.strokeWeight(3);
  ellipsePath(p, x, y, r * .69, h * .70, phase, phase + .60);
  p.strokeWeight(1);
  [-1, 1].forEach(side => {
    p.rect(x + side * (r + 15) - 4, y - 4, 8, 8);
    p.line(x + side * (r + 28), y, x + side * (r + 65), y);
  });
}

function render(p, seed, time) {
  p.background('#121310');
  p.noFill();
  p.strokeCap(p.SQUARE);
  // A quiet pixel registration field grounds the exploded instrument.
  p.stroke('#2d2e2a');
  p.strokeWeight(.8);
  for (let x = 80; x <= 1120; x += 32) {
    for (let y = 82; y <= 594; y += 32) {
      if (x > 270 && x < 946 && y > 125 && y < 565) continue;
      p.line(x - 1, y, x + 1, y);
      p.line(x, y - 1, x, y + 1);
    }
  }
  // Open vertical rails deliberately leave the candidate unobscured.
  p.stroke('#62645c');
  p.strokeWeight(1);
  const rails = [[290, 171, 335, 486], [905, 171, 950, 486]];
  for (const [x1,y1,x2,y2] of rails) {
    for (let t = 0; t < 1; t += .035) {
      const s = Math.min(1, t + .012);
      p.line(x1 + (x2-x1)*t, y1+(y2-y1)*t, x1+(x2-x1)*s, y1+(y2-y1)*s);
    }
  }
  frame(p, 592, 173, 304, time, true);
  frame(p, 637, 502, 304, time, false);
  // A third lens is seen edge-on, its two arcs leaving a clear aperture.
  p.stroke('#85867d');
  p.strokeWeight(1.1);
  ellipsePath(p, 615, 338, 301, 103, -.66, .66);
  ellipsePath(p, 615, 338, 301, 103, Math.PI-.66, Math.PI+.66);
  ellipsePath(p, 615, 338, 312, 109, -.55, .55);
  ellipsePath(p, 615, 338, 312, 109, Math.PI-.55, Math.PI+.55);
  drawMolecule(p, 'aspirin', {
    x: 615, y: 336, scale: 44,
    rx: .8, ry: .85 + Math.sin(time * .12) * .22, rz: -.15,
    color: ivory, accent: '#ffffff', hydrogens: true,
    weight: 2.1, atomRadius: .19,
  });
  // Unnumbered geometric registration marks, not property values.
  p.stroke(ivory);
  p.strokeWeight(1.2);
  for (const [x, y, side] of [[156, 337, 1], [1080, 337, -1]]) {
    p.line(x, y - 40, x, y + 40);
    p.line(x, y - 40, x + side * 24, y - 40);
    p.line(x, y + 40, x + side * 24, y + 40);
    p.line(x, y, x + side * 75, y);
    p.circle(x + side * 84, y, 10);
  }
}

export function draw(p, seed) { render(p, seed, 0); }
export function animate(p, seed) { render(p, seed, p.millis() / 1000); }
