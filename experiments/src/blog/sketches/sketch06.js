export const title = 'Soft Affinity';
export const description = 'A fluid molecular loop bends around an empty binding pocket, its soft blue atoms held together by tapered computational bonds.';

export function draw(p, seed) {
  p.push();
  p.randomSeed(seed);
  p.noiseSeed(seed);
  p.background('#7f99aa');
  const ctx = p.drawingContext;
  const bg = ctx.createLinearGradient(0, 0, 1200, 675);
  bg.addColorStop(0, '#aabecb');
  bg.addColorStop(0.56, '#819baD');
  bg.addColorStop(1, '#657e90');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1200, 675);

  // Quiet plate texture gives the scientific model an ink-on-paper surface.
  p.noStroke();
  for (let i = 0; i < 6000; i++) {
    p.fill(i % 3 ? 247 : 32, i % 3 ? 250 : 45, i % 3 ? 251 : 56, p.random(5, 16));
    p.circle(p.random(1200), p.random(675), p.random(0.5, 1.8));
  }

  const angle = -0.38;
  const world = (x, y) => ({ x: 600 + x * Math.cos(angle) - y * Math.sin(angle), y: 340 + x * Math.sin(angle) + y * Math.cos(angle) });
  const nodes = [];
  for (let i = 0; i < 9; i++) {
    const t = i / 9 * Math.PI * 2;
    const q = world(380 * Math.cos(t), 157 * Math.sin(t));
    nodes.push({ ...q, r: [49, 63, 58, 75, 54, 48, 60, 54, 67][i], t });
  }

  // The elliptical orbit remains visible through the center as a fine hypothesis.
  p.noFill();
  p.stroke(236, 244, 249, 95);
  p.strokeWeight(1);
  p.beginShape();
  for (let i = 0; i <= 240; i++) {
    const t = i / 240 * Math.PI * 2;
    const q = world(467 * Math.cos(t), 238 * Math.sin(t));
    p.vertex(q.x, q.y);
  }
  p.endShape();
  for (let i = 0; i < 48; i++) {
    const t = i / 48 * Math.PI * 2;
    const q = world(467 * Math.cos(t), 238 * Math.sin(t));
    const q2 = world((i % 4 === 0 ? 478 : 472) * Math.cos(t), (i % 4 === 0 ? 249 : 243) * Math.sin(t));
    p.line(q.x, q.y, q2.x, q2.y);
  }

  function bond(a, b) {
    const dx = b.x - a.x, dy = b.y - a.y;
    const len = Math.hypot(dx, dy), nx = -dy / len, ny = dx / len;
    const midx = (a.x + b.x) / 2, midy = (a.y + b.y) / 2;
    const w1 = a.r * 0.57, w2 = b.r * 0.57;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(a.x + nx * w1, a.y + ny * w1);
    ctx.bezierCurveTo(midx + nx * 10, midy + ny * 10, midx + nx * 10, midy + ny * 10, b.x + nx * w2, b.y + ny * w2);
    ctx.lineTo(b.x - nx * w2, b.y - ny * w2);
    ctx.bezierCurveTo(midx - nx * 10, midy - ny * 10, midx - nx * 10, midy - ny * 10, a.x - nx * w1, a.y - ny * w1);
    ctx.closePath();
    const shade = ctx.createLinearGradient(midx + nx * 34, midy + ny * 34, midx - nx * 34, midy - ny * 34);
    shade.addColorStop(0, '#263843');
    shade.addColorStop(0.42, '#8fa8b8');
    shade.addColorStop(0.74, '#e6eef2');
    shade.addColorStop(1, '#9cb2c0');
    ctx.fillStyle = shade;
    ctx.fill();
    ctx.clip();
    p.noStroke();
    for (let j = 0; j < 500; j++) {
      const u = p.random(), v = p.random(-50, 50);
      p.fill(23, 38, 47, p.random(12, 44));
      p.circle(a.x + dx * u + nx * v, a.y + dy * u + ny * v, p.random(0.5, 1.7));
    }
    ctx.restore();
  }

  for (let i = 0; i < nodes.length; i++) bond(nodes[i], nodes[(i + 1) % nodes.length]);

  function atom(x, y, r, dark = false) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    const g = ctx.createRadialGradient(x - r * 0.4, y - r * 0.46, r * 0.03, x + r * 0.12, y + r * 0.1, r * 1.17);
    g.addColorStop(0, dark ? '#abc0ce' : '#ffffff');
    g.addColorStop(0.27, dark ? '#5f7a8c' : '#f0f5f7');
    g.addColorStop(0.65, dark ? '#293b47' : '#a4bac8');
    g.addColorStop(1, '#243640');
    ctx.fillStyle = g;
    ctx.fill();
    ctx.clip();
    p.noStroke();
    for (let j = 0; j < r * 17; j++) {
      const u = p.random(-1, 1), v = p.random(-1, 1);
      if (u * u + v * v > 1) continue;
      const shadow = (u + v + 2) / 4;
      p.fill(15, 31, 42, p.random(6, 38) * shadow);
      p.circle(x + u * r, y + v * r, p.random(0.6, 1.7));
    }
    ctx.restore();
  }
  nodes.forEach((n, i) => atom(n.x, n.y, n.r, i === 5 || i === 6));

  // A darker, small candidate molecule approaches the loop's white pocket.
  const ligand = [{ x: 624, y: 313, r: 26 }, { x: 682, y: 328, r: 18 }, { x: 709, y: 283, r: 15 }];
  bond(ligand[0], ligand[1]);
  bond(ligand[1], ligand[2]);
  ligand.forEach(n => atom(n.x, n.y, n.r, true));
  p.stroke(248, 252, 255, 140);
  p.strokeWeight(1);
  ctx.setLineDash([2, 6]);
  p.line(574, 337, 514, 389);
  ctx.setLineDash([]);
  p.noFill();
  p.circle(501, 400, 25);
  p.line(501, 381, 501, 389);
  p.line(501, 411, 501, 419);
  p.line(482, 400, 490, 400);
  p.line(512, 400, 520, 400);

  atom(1052, 461, 23);
  atom(1090, 432, 8, true);
  atom(181, 176, 11);
  p.pop();
}
