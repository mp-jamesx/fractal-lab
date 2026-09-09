export const title = 'Reciprocal Forms';
export const description = 'Two charged contour families meet at a molecular hinge: a speculative drawing of complementary binding landscapes.';

export function draw(p, seed) {
  p.background('#111217');
  p.noFill();
  p.strokeJoin(p.ROUND);
  p.strokeCap(p.ROUND);
  const cyan = '#89bac1';
  const magenta = '#ce639d';
  const white = '#eeeae3';
  const phase = (seed % 137) / 137 * 0.28;

  // Widely spaced isolines reveal shape without shading either volume.
  function lobe(cx, cy, rx, ry, direction, color) {
    p.stroke(color);
    for (let k = 0; k < 7; k++) {
      const scale = 1 - k * 0.105;
      p.strokeWeight(k === 0 ? 2.7 : 1.7);
      p.beginShape();
      for (let j = 0; j <= 240; j++) {
        const t = j / 240 * Math.PI * 2;
        const radial = 1 + 0.115 * Math.cos(3 * t + phase) + 0.047 * Math.sin(5 * t - k * 0.06);
        const x = cx + rx * scale * radial * Math.cos(t) + direction * 25 * Math.sin(t);
        const y = cy + ry * scale * (1 + 0.09 * Math.sin(3 * t + 1.2)) * Math.sin(t);
        p.vertex(x, y);
      }
      p.endShape(p.CLOSE);
    }
  }

  lobe(645, 205, 229, 130, 1, cyan);
  lobe(558, 461, 222, 136, -1, magenta);

  // A single articulated chemical-like hinge, deliberately unlabelled.
  p.stroke(white);
  p.strokeWeight(2.5);
  const cx = 603, cy = 332, r = 25;
  const vertices = [];
  for (let i = 0; i < 6; i++) {
    const a = Math.PI / 6 + i * Math.PI / 3;
    vertices.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  p.beginShape();
  for (const [x, y] of vertices) p.vertex(x, y);
  p.endShape(p.CLOSE);
  p.line(603, 307, 603, 281);
  p.line(603, 281, 627, 267);
  p.line(603, 357, 580, 371);
  p.line(580, 371, 580, 397);
  for (const i of [0, 2, 4]) {
    const a = vertices[i], b = vertices[(i + 1) % 6];
    p.line(cx + (a[0] - cx) * 0.72, cy + (a[1] - cy) * 0.72,
      cx + (b[0] - cx) * 0.72, cy + (b[1] - cy) * 0.72);
  }

  // Open trajectories make the meeting feel active, without a network grid.
  p.strokeWeight(1.8);
  p.stroke(cyan);
  p.bezier(890, 146, 1008, 189, 948, 312, 825, 347);
  p.bezier(906, 158, 993, 203, 934, 296, 847, 326);
  p.stroke(magenta);
  p.bezier(315, 535, 189, 500, 237, 370, 368, 336);
  p.bezier(300, 522, 205, 481, 253, 388, 346, 359);
  p.stroke(white);
  p.strokeWeight(2);
  p.arc(846, 382, 35, 35, -0.4, 3.55);
  p.arc(346, 282, 24, 24, 2.7, 6.8);
}
