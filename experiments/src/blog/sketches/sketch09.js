export const title = 'The Shape of Affinity';
export const description = 'A golden, stippled molecular fold curls around an open binding pocket, suspended in deep violet.';

export function draw(p, seed) {
  p.randomSeed(seed);
  p.noiseSeed(seed);
  p.background('#28113f');
  p.noStroke();

  // A quiet printed-paper field behind the solid, with no raster assets.
  for (let i = 0; i < 1800; i++) {
    p.fill(224, 191, 247, p.random(5, 14));
    p.circle(p.random(1200), p.random(675), p.random(0.5, 1.5));
  }

  const turn = -0.19;
  const tilt = 0.77;
  const swivel = -0.3;
  const project = (x, y, z) => {
    const yy = y * Math.cos(tilt) - z * Math.sin(tilt);
    const zz = y * Math.sin(tilt) + z * Math.cos(tilt);
    const xx = x * Math.cos(swivel) + zz * Math.sin(swivel);
    const depth = -x * Math.sin(swivel) + zz * Math.cos(swivel);
    return {
      x: 603 + xx * Math.cos(turn) - yy * Math.sin(turn),
      y: 343 + xx * Math.sin(turn) + yy * Math.cos(turn),
      z: depth,
    };
  };
  const surface = (u, v) => {
    const tube = 74 + 14 * Math.sin(3 * u + 0.3);
    const pleat = 8 * Math.cos(7 * u + 1.2 * Math.sin(v));
    const radial = 214 + 28 * Math.cos(3 * u + 0.5) + (tube + pleat) * Math.cos(v);
    return project(
      radial * Math.cos(u) * 1.3,
      radial * Math.sin(u),
      48 * Math.sin(2 * u - 0.35) + (tube + pleat) * Math.sin(v) * 1.35,
    );
  };

  // Fine orbital registration marks evoke an old molecular-model plate.
  p.noFill();
  p.stroke(247, 237, 253, 46);
  p.strokeWeight(0.8);
  p.arc(603, 343, 978, 563, 0.13, 1.18);
  p.arc(603, 343, 978, 563, 3.3, 4.18);
  for (const angle of [0.13, 1.18, 3.3, 4.18]) {
    const x = 603 + 489 * Math.cos(angle);
    const y = 343 + 281.5 * Math.sin(angle);
    p.line(x - 4, y, x + 4, y);
    p.line(x, y - 4, x, y + 4);
  }

  const faces = [];
  const nu = 166;
  const nv = 64;
  for (let i = 0; i < nu; i++) {
    for (let j = 0; j < nv; j++) {
      const u = i * Math.PI * 2 / nu;
      const v = j * Math.PI * 2 / nv;
      const du = Math.PI * 2 / nu;
      const dv = Math.PI * 2 / nv;
      const a = surface(u, v);
      const b = surface(u + du, v);
      const c = surface(u + du, v + dv);
      const d = surface(u, v + dv);
      const center = surface(u + du / 2, v + dv / 2);
      const ex = b.x - a.x, ey = b.y - a.y, ez = b.z - a.z;
      const fx = d.x - a.x, fy = d.y - a.y, fz = d.z - a.z;
      let nx = ey * fz - ez * fy;
      let ny = ez * fx - ex * fz;
      let nz = ex * fy - ey * fx;
      const magnitude = Math.hypot(nx, ny, nz);
      nx /= magnitude; ny /= magnitude; nz /= magnitude;
      if (nz < -0.02) continue;
      const light = Math.max(0, -0.44 * nx - 0.58 * ny + 0.69 * nz);
      faces.push({ a, b, c, d, center, light, nz, i, j });
    }
  }
  faces.sort((a, b) => a.center.z - b.center.z);
  p.noStroke();
  for (const f of faces) {
    const t = Math.pow(f.light, 0.75);
    const col = [105 + 148 * t, 50 + 164 * t, 28 + 49 * t];
    p.fill(...col);
    p.beginShape();
    for (const q of [f.a, f.b, f.c, f.d]) p.vertex(q.x, q.y);
    p.endShape(p.CLOSE);
    // Regular halftone freckles bend with the surface coordinates.
    const dot = 0.6 + (1 - t) * 1.65;
    p.fill(48, 19, 60, 105 + 70 * (1 - t));
    p.ellipse(f.center.x, f.center.y, dot * (0.55 + 0.45 * f.nz), dot);
    if (t > 0.84 && (f.i + f.j) % 7 === 0) {
      p.fill(255, 252, 232, 165);
      p.circle(f.center.x + 1.1, f.center.y - 1.1, 0.8);
    }
  }

  // One complementary ligand, a small crystalline interruption in the fold.
  const ligand = [[583, 328], [616, 312], [646, 335], [635, 367], [601, 375], [583, 348]];
  p.stroke('#fff7e6');
  p.strokeWeight(3.2);
  p.noFill();
  p.beginShape();
  ligand.forEach(([x, y]) => p.vertex(x, y));
  p.endShape(p.CLOSE);
  p.line(616, 312, 620, 287);
  p.line(646, 335, 674, 327);
  p.line(601, 375, 588, 399);
  p.noStroke();
  p.fill('#fff7e6');
  for (const [x, y] of [...ligand, [620, 287], [674, 327], [588, 399]]) p.circle(x, y, 9);
}
