export const title = 'The Binding Loop';
export const description = 'A luminous, striated molecular knot folds a continuous computational path into a sculptural binding site.';

export function draw(p, seed) {
  p.background('#100a16');
  const ctx = p.drawingContext;
  const wash = ctx.createRadialGradient(745, 340, 20, 745, 340, 560);
  wash.addColorStop(0, '#291035');
  wash.addColorStop(0.64, '#190c23');
  wash.addColorStop(1, '#100a16');
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, 1200, 675);
  // A sparse precursor orbit establishes the scale of the folded molecule.
  p.noFill();
  p.stroke('#56305d');
  p.strokeWeight(0.8);
  p.push();
  p.translate(663, 351);
  p.rotate(-0.27);
  p.ellipse(0, 0, 996, 386);
  p.pop();
  p.noStroke();
  p.fill('#d74c9e');
  p.circle(180, 390, 7);
  p.fill('#ffc457');
  p.circle(1115, 204, 5);

  const TAU = Math.PI * 2;
  const phase = (seed % 31) * 0.002;
  const norm = v => {
    const d = Math.hypot(...v);
    return v.map(a => a / d);
  };
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const center = t => [(2 + 0.76 * Math.cos(3 * t)) * Math.cos(2 * t), (2 + 0.76 * Math.cos(3 * t)) * Math.sin(2 * t), 0.92 * Math.sin(3 * t)];
  const project = v => {
    const a = -0.30, b = 0.79;
    const y = v[1] * Math.cos(b) - v[2] * Math.sin(b);
    const z = v[1] * Math.sin(b) + v[2] * Math.cos(b);
    return [722 + 120 * (v[0] * Math.cos(a) - y * Math.sin(a)), 335 + 120 * (v[0] * Math.sin(a) + y * Math.cos(a)), z];
  };
  const N = 320, R = 36;
  const grid = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N * TAU + phase;
    const c = center(t), c2 = center(t + 0.001);
    const tangent = norm(c2.map((v, k) => v - c[k]));
    const normal = norm(cross(tangent, [0, 0, 1]));
    const binormal = norm(cross(tangent, normal));
    const row = [];
    for (let j = 0; j <= R; j++) {
      const a = j / R * TAU;
      const radius = 0.27;
      row.push(project(c.map((v, k) => v + radius * (normal[k] * Math.cos(a) + binormal[k] * Math.sin(a)))));
    }
    grid.push(row);
  }
  const faces = [];
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < R; j++) {
      const points = [grid[i][j], grid[i + 1][j], grid[i + 1][j + 1], grid[i][j + 1]];
      faces.push({ points, i, j, z: points.reduce((s, v) => s + v[2], 0) / 4 });
    }
  }
  faces.sort((a, b) => a.z - b.z);
  const palette = [[101, 39, 174], [204, 34, 159], [242, 61, 78], [252, 111, 47], [255, 198, 70]];
  p.strokeWeight(0.45);
  for (const face of faces) {
    const { points, i, j, z } = face;
    const u = (0.5 + 0.5 * Math.sin(i / N * TAU - 0.8)) * 3.999;
    const k = Math.floor(u), f = u - k;
    const light = 0.49 + 0.51 * Math.pow(0.5 + 0.5 * Math.cos(j / R * TAU - 1.05), 0.7);
    const rgb = palette[k].map((v, n) => (v * (1 - f) + palette[k + 1][n] * f) * light);
    p.noStroke();
    p.fill(...rgb);
    p.quad(...points.flatMap(v => [v[0], v[1]]));
    // Longitudinal grooves make the computational trajectory physically legible.
    p.stroke(16, 8, 24, 145);
    p.line(points[0][0], points[0][1], points[1][0], points[1][1]);
  }
  // A tiny coordinate glyph echoes the knot's threefold molecular symmetry.
  p.push();
  p.translate(98, 103);
  p.noFill();
  p.stroke('#fa8e58');
  p.strokeWeight(1.3);
  p.triangle(0, -15, 13, 8, -13, 8);
  p.line(0, -15, 0, 0);
  p.line(13, 8, 0, 0);
  p.line(-13, 8, 0, 0);
  p.pop();
}
