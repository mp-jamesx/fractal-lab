export const title = 'Porous Affinity';
export const description = 'Two cobalt cellular cages interlock like a molecular handshake, their open apertures giving a retro scientific diagram a playful mechanical rhythm.';

export function draw(p, seed) {
  p.background('#ffffff');
  p.noFill();
  p.strokeCap(p.ROUND);
  p.strokeJoin(p.ROUND);
  const TAU = Math.PI * 2;
  const phase = (seed % 71) * 0.014;
  const rings = [
    { x: 488, y: 309, angle: -0.32, rx: 178, ry: 154, color: '#1647da' },
    { x: 709, y: 370, angle: 0.36, rx: 174, ry: 153, color: '#1647da' },
  ];
  function point(ring, t, v) {
    const wave = 1 + 0.014 * Math.sin(5 * t + phase);
    const xx = (ring.rx + v * 42) * Math.cos(t) * wave;
    const yy = (ring.ry + v * 40) * Math.sin(t) * wave;
    return { x: ring.x + xx * Math.cos(ring.angle) - yy * Math.sin(ring.angle),
      y: ring.y + xx * Math.sin(ring.angle) + yy * Math.cos(ring.angle) };
  }
  function inBand(ring, q) {
    const dx = q.x - ring.x, dy = q.y - ring.y;
    const x = dx * Math.cos(ring.angle) + dy * Math.sin(ring.angle);
    const y = -dx * Math.sin(ring.angle) + dy * Math.cos(ring.angle);
    const t = Math.atan2(y / ring.ry, x / ring.rx);
    const wave = 1 + 0.014 * Math.sin(5 * t + phase);
    const outer = (x / ((ring.rx + 45) * wave)) ** 2 + (y / ((ring.ry + 43) * wave)) ** 2;
    const inner = (x / ((ring.rx - 45) * wave)) ** 2 + (y / ((ring.ry - 43) * wave)) ** 2;
    return outer < 1 && inner > 1;
  }
  function path(index, points, color, weight) {
    p.stroke(color); p.strokeWeight(weight);
    let active = false;
    for (const q of points) {
      const hidden = inBand(rings[1 - index], q) && (index === 0 ? q.y > 340 : q.y <= 340);
      if (hidden) { if (active) p.endShape(); active = false; }
      else { if (!active) p.beginShape(); p.vertex(q.x, q.y); active = true; }
    }
    if (active) p.endShape();
  }
  rings.forEach((ring, index) => {
    // Clear perimeter contours describe the open shell, never a shaded mass.
    for (const v of [-1, 1]) {
      const points = [];
      for (let j = 0; j <= 320; j++) points.push(point(ring, j / 320 * TAU, v));
      path(index, points, ring.color, 2.8);
    }
    // Rounded irregular apertures are individually traced in two open rows.
    const count = 19;
    for (let row = 0; row < 2; row++) {
      for (let cell = 0; cell < count; cell++) {
        const t = (cell + row * 0.45) / count * TAU;
        const jitter = 0.035 * Math.sin(cell * 2.41 + row + phase);
        const width = (TAU / count) * (0.39 + 0.035 * Math.sin(cell * 1.7));
        const points = [];
        for (let j = 0; j <= 64; j++) {
          const a = j / 64 * TAU;
          const c = Math.cos(a), s = Math.sin(a);
          const u = Math.sign(c) * Math.pow(Math.abs(c), 0.72);
          const v = Math.sign(s) * Math.pow(Math.abs(s), 0.76);
          points.push(point(ring, t + u * width + jitter * s,
            (row === 0 ? -0.48 : 0.48) + v * 0.35));
        }
        path(index, points, ring.color, 2.15);
      }
    }
  });
  // Sparse black instrument brackets frame the paired cages without labels.
  p.stroke('#16191f'); p.strokeWeight(1.7);
  p.beginShape(); p.vertex(233, 250); p.vertex(233, 169); p.vertex(312, 169); p.endShape();
  p.beginShape(); p.vertex(884, 505); p.vertex(960, 505); p.vertex(960, 426); p.endShape();
  p.line(226, 290, 240, 290);
  p.line(953, 385, 967, 385);
}
