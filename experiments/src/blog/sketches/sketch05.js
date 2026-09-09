export const title = 'Affinity Pores';
export const description = 'Three amber molecular cages interlock into a porous structure, revealing the spaces where affinity takes shape.';

export function draw(p, seed) {
  const ctx = p.drawingContext;
  p.background(23, 23, 21);
  // A broad, quiet field makes the tiny voids read as the subject.
  const field = ctx.createRadialGradient(605, 338, 70, 605, 338, 650);
  field.addColorStop(0, '#35332b');
  field.addColorStop(1, '#161615');
  ctx.fillStyle = field;
  ctx.fillRect(0, 0, 1200, 675);
  p.randomSeed(seed);
  p.noiseSeed(seed);
  p.stroke(213, 166, 71, 30);
  p.strokeWeight(0.7);
  for (const [x, y] of [[74, 71], [1126, 71], [74, 604], [1126, 604]]) {
    p.line(x - 7, y, x + 7, y);
    p.line(x, y - 7, x, y + 7);
  }
  const tau = Math.PI * 2;
  const rotate = (v, ax, ay, az) => {
    let [x, y, z] = v;
    [y, z] = [y * Math.cos(ax) - z * Math.sin(ax), y * Math.sin(ax) + z * Math.cos(ax)];
    [x, z] = [x * Math.cos(ay) + z * Math.sin(ay), -x * Math.sin(ay) + z * Math.cos(ay)];
    [x, y] = [x * Math.cos(az) - y * Math.sin(az), x * Math.sin(az) + y * Math.cos(az)];
    return [x, y, z];
  };
  const cages = [
    { center: [-104, -14, -12], r: 150, tube: 43, angles: [0.49, -0.39, -0.27], hue: 0 },
    { center: [94, 0, 17], r: 146, tube: 44, angles: [0.91, 0.52, 0.51], hue: 1 },
    { center: [2, 51, 40], r: 146, tube: 39, angles: [-0.85, -0.21, -0.26], hue: 0.45 },
  ];
  const cells = [];
  const U = 66, V = 16;
  const point = (u, v, cage, ci) => {
    const rough = 1 + 0.035 * Math.sin(7 * u + ci) * Math.cos(3 * v + u);
    const tube = cage.tube * rough;
    const ringR = cage.r * (1 + 0.024 * Math.sin(3 * u + ci));
    const out = rotate([(ringR + tube * Math.cos(v)) * Math.cos(u), (ringR + tube * Math.cos(v)) * Math.sin(u), tube * Math.sin(v)], ...cage.angles);
    return out.map((n, i) => n + cage.center[i]);
  };
  const project = ([x, y, z]) => {
    const perspective = 1050 / (1050 - z);
    return [600 + x * 1.35 * perspective, 330 + y * 1.35 * perspective];
  };
  cages.forEach((cage, ci) => {
    for (let i = 0; i < U; i++) {
      for (let j = 0; j < V; j++) {
        const u = tau * (i + 0.5) / U;
        const v = tau * (j + 0.5) / V;
        const du = tau / U, dv = tau / V;
        const uv = [[-0.5, -0.5], [0.5, -0.5], [0.5, 0.5], [-0.5, 0.5]];
        const warp = (a, b) => [u + a * du + 0.13 * du * Math.sin((v + b * dv) * 5 + u * 4), v + b * dv + 0.12 * dv * Math.sin((u + a * du) * 11)];
        const outer = uv.map(([a, b]) => point(...warp(a, b), cage, ci));
        const aperture = 0.61 + 0.14 * p.noise(i * 0.4, j * 0.4, ci * 3);
        const inner = uv.map(([a, b]) => point(...warp(a * aperture, b * aperture), cage, ci));
        const normal = rotate([Math.cos(u) * Math.cos(v), Math.sin(u) * Math.cos(v), Math.sin(v)], ...cage.angles);
        const illumination = Math.max(0, normal[0] * -0.46 + normal[1] * -0.58 + normal[2] * 0.67);
        const front = normal[2] > 0;
        const light = front ? 0.34 + 0.66 * illumination : 0.20 + 0.17 * illumination;
        cells.push({ outer, inner, z: outer.reduce((s, pt) => s + pt[2], 0) / 4, light, hue: cage.hue });
      }
    }
  });
  cells.sort((a, b) => a.z - b.z);
  const path = points => {
    points.forEach((pt, i) => {
      const [x, y] = project(pt);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.closePath();
  };
  for (const cell of cells) {
    const l = cell.light;
    const red = Math.round(83 + 173 * l);
    const green = Math.round(43 + (151 - 45 * cell.hue) * l);
    const blue = Math.round(15 + 33 * l);
    ctx.beginPath();
    path(cell.outer);
    path(cell.inner);
    ctx.fillStyle = `rgb(${red},${green},${blue})`;
    ctx.fill('evenodd');
    // The polished lip gives each aperture a distinct cellular edge.
    if (l > 0.48) {
      ctx.beginPath();
      const lip = cell.inner.slice(0, 3).map(project);
      ctx.moveTo(...lip[0]);
      ctx.lineTo(...lip[1]);
      ctx.lineTo(...lip[2]);
      ctx.strokeStyle = `rgba(255,210,100,${(l - 0.4) * 0.57})`;
      ctx.lineWidth = 0.6;
      ctx.stroke();
    }
  }
  // Instrument-like reference marks are peripheral, leaving the cage unlabelled.
  p.stroke(203, 173, 105, 105);
  p.strokeWeight(1);
  p.line(93, 553, 159, 553);
  for (let i = 0; i <= 6; i++) p.line(93 + i * 11, 553, 93 + i * 11, 553 + (i % 3 ? 4 : 8));
  p.noStroke();
  p.fill(197, 161, 84, 145);
  p.circle(1104, 122, 4);
  p.stroke(197, 161, 84, 55);
  p.noFill();
  p.circle(1104, 122, 17);
}
