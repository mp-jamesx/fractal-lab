import { drawMolecule } from '../chemistry.js';

export const title = 'Coordinated Search';
export const description = 'A three-dimensional metronidazole conformer floats above computational planes. Ordered routes converge around it, suggesting Axon coordinating Rowan’s chemistry tools.';

function polygon(p, points) {
  p.beginShape();
  points.forEach(([x, y]) => p.vertex(x, y));
  p.endShape(p.CLOSE);
}

function frame(p, time) {
  p.background('#242628');
  p.noFill();
  p.strokeCap(p.ROUND);
  // A quiet pixel register anchors the otherwise open editorial composition.
  p.stroke('#515457');
  p.strokeWeight(1);
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 9; col++) {
      const x = 77 + col * 17, y = 78 + row * 17;
      p.line(x - 1, y, x + 1, y);
    }
  }

  // Exploded isometric instrument planes. These are abstract workflow geometry.
  const corners = [[386, 441], [707, 347], [1030, 441], [708, 536]];
  for (let level = 2; level >= 0; level--) {
    const drop = level * 41;
    p.stroke(level === 0 ? '#9b9fa1' : '#54585b');
    p.strokeWeight(level === 0 ? 1.45 : 1);
    polygon(p, corners.map(([x, y]) => [x, y + drop]));
    for (let line = 1; line < 10; line++) {
      const t = line / 10;
      p.stroke(level === 0 ? '#494d50' : '#3d4144');
      p.line(386 + 321 * t, 441 - 94 * t + drop, 708 + 322 * t, 536 - 95 * t + drop);
    }
  }
  p.stroke('#73787b');
  p.strokeWeight(1);
  for (const [x, y] of corners) {
    for (let d = 6; d < 82; d += 10) p.line(x, y + d, x, y + d + 3);
  }

  // Parallel tool routes stop at a common boundary rather than becoming chemical bonds.
  for (let i = 0; i < 7; i++) {
    const y = 212 + i * 35;
    const endY = 218 + i * 30;
    const elbow = 215 + i * 17;
    p.stroke(i === 3 ? '#d3d6d7' : '#777d81');
    p.strokeWeight(i === 3 ? 1.8 : 1.1);
    p.beginShape();
    p.vertex(78, y);
    p.vertex(elbow, y);
    p.vertex(elbow + 78, endY);
    p.vertex(403, endY);
    p.endShape();
    p.rect(68, y - 5, 10, 10);
    p.circle(411, endY, 9);
    const u = (time * .055 + i / 7) % 1;
    const tickX = 95 + u * (elbow - 107);
    p.line(tickX, y - 5, tickX, y + 5);
  }

  // Open rails distinguish the inspection volume from the molecule itself.
  p.stroke('#747a7e');
  p.strokeWeight(1.3);
  p.line(465, 397, 465, 150);
  p.line(465, 150, 645, 97);
  p.line(853, 115, 983, 153);
  p.line(983, 153, 983, 350);
  p.line(465, 398, 497, 408);
  p.line(950, 360, 983, 350);
  p.stroke('#a4aaad');
  p.line(641, 91, 649, 103);
  p.line(849, 121, 857, 109);

  drawMolecule(p, 'metronidazole', {
    x: 713, y: 267, scale: 66,
    rx: .58, ry: .54 + Math.sin(time * .075) * .24,
    rz: -.24 + Math.sin(time * .05) * .04,
    color: '#e1e3e4', accent: '#ffffff',
    hydrogens: true, weight: 2.2, atomRadius: .155,
  });

  // Offset calibration strokes at the edge of the workspace.
  p.stroke('#747b80');
  p.strokeWeight(1);
  for (let i = 0; i < 15; i++) {
    const x = 1007 + i * 5;
    p.line(x, 544 - i * 1.48, x, 551 - i * 1.48);
  }
}

export function draw(p, seed) { frame(p, 0); }
export function animate(p, seed) { frame(p, p.millis() / 1000); }
