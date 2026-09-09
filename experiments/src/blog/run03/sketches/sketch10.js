export const title = 'Selective Current';
export const description = 'A molecular membrane becomes a pleated stream: closely spaced fibers twist through two narrow selection gates, with a hexagonal scaffold and small computational registration marks. Black, charcoal and off-white translate reflective flow into pure line rhythm.';

// A ruled, twisted surface. Every visible element is an unfilled path.
function surface(u, v, time, seed) {
  const phase = (seed % 97) / 970;
  const a = 2 * Math.PI * u - 0.72;
  const x = -130 + 1460 * u;
  const y = 322 + 164 * Math.sin(a);
  const slope = 164 * 2 * Math.PI * Math.cos(a) / 1460;
  const n = Math.sqrt(1 + slope * slope);
  const twist = Math.cos(2 * Math.PI * u + 0.32);
  const breadth = (116 + 30 * Math.sin(Math.PI * u)) * twist;
  const breathing = Math.sin(u * 9 + time * 0.42 + phase) * 3;
  return [
    x - slope / n * v * breadth + 19 * Math.sin(v * Math.PI) * Math.sin(a),
    y + v * breadth / n + 22 * v * v * Math.sin(a * 1.4) + breathing,
  ];
}

function render(p, seed, time) {
  p.background('#101111');
  p.noFill();
  p.strokeCap(p.ROUND);
  p.strokeJoin(p.ROUND);

  // An open hexagonal substrate, interrupted before it meets the membrane.
  p.stroke('#303333');
  p.strokeWeight(0.85);
  const r = 23;
  for (let row = -2; row < 15; row++) {
    for (let col = -1; col < 28; col++) {
      const x = col * r * 1.5;
      const y = row * r * Math.sqrt(3) + (col % 2) * r * Math.sqrt(3) / 2;
      if (!((x < 410 && y < 245 - x * 0.28) || (x > 890 && y > 480 + (x - 890) * 0.2))) continue;
      p.beginShape();
      for (let k = 0; k <= 6; k++) {
        const a = k * Math.PI / 3;
        p.vertex(x + r * Math.cos(a), y + r * Math.sin(a));
      }
      p.endShape();
    }
  }

  // Fine transverse seams disclose the folded material's computational origin.
  p.stroke('#555956');
  p.strokeWeight(0.7);
  for (let j = 0; j <= 66; j++) {
    const u = j / 66;
    p.beginShape();
    for (let k = 0; k <= 22; k++) {
      const q = surface(u, -1 + k / 11, time, seed);
      p.vertex(q[0], q[1]);
    }
    p.endShape();
  }

  p.stroke('#e9e7dc');
  for (let strand = 0; strand <= 68; strand++) {
    const v = -1 + strand / 34;
    p.strokeWeight(strand === 0 || strand === 68 ? 1.7 : 0.82);
    p.beginShape();
    for (let j = 0; j <= 160; j++) {
      const q = surface(j / 160, v, time, seed);
      p.vertex(q[0], q[1]);
    }
    p.endShape();
  }

  // Two gate readings hover outside the fibers rather than decorating them.
  p.stroke('#e9e7dc');
  p.strokeWeight(1);
  for (const [u, direction] of [[0.224, -1], [0.724, 1]]) {
    const q = surface(u, 0, time, seed);
    const gy = q[1] + direction * 73;
    p.line(q[0], q[1] + direction * 20, q[0], gy);
    p.line(q[0] - 35, gy, q[0] + 35, gy);
    p.circle(q[0], gy + direction * 16, 8);
    for (let k = -3; k <= 3; k++) {
      p.line(q[0] + k * 10, gy, q[0] + k * 10, gy - direction * (k === 0 ? 9 : 5));
    }
  }
  // Sparse, angular registration devices supply the editorial collage rhythm.
  p.stroke('#777b75');
  p.strokeWeight(1);
  for (const [x, y, dx, dy] of [[46, 48, 1, 1], [1154, 627, -1, -1]]) {
    p.line(x, y, x + dx * 78, y);
    p.line(x, y, x, y + dy * 28);
    p.line(x + dx * 86, y, x + dx * 95, y);
  }
}

export function draw(p, seed) {
  render(p, seed, 0);
}

export function animate(p, seed) {
  // Slow, tiny material displacement; geometry stays deterministic and readable.
  render(p, seed, p.millis() / 1000);
}
