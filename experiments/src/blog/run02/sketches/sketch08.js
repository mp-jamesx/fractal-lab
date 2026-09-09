export const title = 'Conformation Window';
export const description = 'A pale ribbon folds through a dark observation field, its open transverse contours suggesting a computational protein study and a small candidate binding geometry.';

export function draw(p, seed) {
  p.background('#102946');
  p.noFill();
  p.strokeCap(p.ROUND);
  p.strokeJoin(p.ROUND);
  const phase = ((seed % 103) / 103 - 0.5) * 0.16;
  // An open ruled ribbon: its turning edge defines the fold without a surface fill.
  function sheet(t, v) {
    const angle = t * 1.9 + phase;
    const width = 55 + 15 * Math.cos(t * 1.4);
    const x = 140 * t;
    const y = 104 * Math.sin(t * 1.65);
    const z = 56 * Math.cos(t * 1.65);
    const yy = y + v * width * Math.cos(angle);
    const zz = z + v * width * Math.sin(angle);
    return [600 + x + zz * 0.34, 351 + yy - zz * 0.53];
  }
  const start = -2.66;
  const end = 2.66;
  for (let row = 0; row <= 8; row++) {
    const v = -1 + row / 4;
    p.stroke(row === 0 || row === 8 ? '#F1F8FF' : '#9CC6E4');
    p.strokeWeight(row === 0 || row === 8 ? 2.65 : 1.55);
    p.beginShape();
    for (let i = 0; i <= 320; i++) {
      const t = start + (end - start) * i / 320;
      const q = sheet(t, v);
      p.vertex(q[0], q[1]);
    }
    p.endShape();
  }
  // Widely spaced transverse section lines keep the mesh architectural and open.
  p.stroke('#7AA7CC');
  p.strokeWeight(1.5);
  for (let i = 0; i <= 21; i++) {
    const t = start + (end - start) * i / 21;
    const a = sheet(t, -1);
    const b = sheet(t, 1);
    p.line(a[0], a[1], b[0], b[1]);
  }
  // A free small ligand, located in the negative space between the folds.
  p.push();
  p.translate(602, 201);
  p.rotate(-0.22);
  p.stroke('#EEF7FF');
  p.strokeWeight(2.2);
  const r = 25;
  const ring = [];
  for (let i = 0; i < 6; i++) ring.push([r * Math.cos(i * Math.PI / 3), r * Math.sin(i * Math.PI / 3)]);
  p.beginShape();
  ring.forEach(q => p.vertex(q[0], q[1]));
  p.endShape(p.CLOSE);
  for (let i = 0; i < 6; i += 2) {
    const a = ring[i];
    const b = ring[(i + 1) % 6];
    p.line(a[0] * 0.70, a[1] * 0.70, b[0] * 0.70, b[1] * 0.70);
  }
  p.line(25, 0, 43, -12);
  p.line(43, -12, 60, 1);
  p.line(-25, 0, -44, -11);
  p.circle(-51, -15, 13);
  p.line(12.5, 21.65, 15, 40);
  p.circle(16, 48, 12);
  p.pop();
  // Two short observation brackets frame the candidate without typography.
  p.stroke('#7AA7CC');
  p.strokeWeight(1.5);
  p.line(527, 163, 527, 144);
  p.line(527, 144, 546, 144);
  p.line(680, 236, 680, 255);
  p.line(680, 255, 661, 255);
}
