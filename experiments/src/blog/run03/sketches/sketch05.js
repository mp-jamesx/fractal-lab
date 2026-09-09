export const title = 'The Affinity Circuit';
export const description = 'A folded molecular ribbon loops through a precise modular search lattice. Two outlined compounds sit inside its open chambers while a slow conformational breath keeps the circuit alive.';

const TAU = Math.PI * 2;

function hex(p, x, y, r, rotation = 0) {
  p.beginShape();
  for (let j = 0; j < 6; j++) {
    const a = rotation + j * TAU / 6;
    p.vertex(x + Math.cos(a) * r, y + Math.sin(a) * r);
  }
  p.endShape(p.CLOSE);
}

function molecule(p, x, y, r, turn) {
  p.push();
  p.translate(x, y);
  p.rotate(turn);
  p.stroke('#d7d9d9');
  p.strokeWeight(2);
  hex(p, 0, 0, r, Math.PI / 6);
  const dx = Math.sqrt(3) * r;
  hex(p, dx, 0, r, Math.PI / 6);
  p.line(-dx / 2, -r / 2, -dx / 2 - 26, -r / 2 - 16);
  p.circle(-dx / 2 - 35, -r / 2 - 21, 18);
  p.line(dx * 1.5, r / 2, dx * 1.5 + 25, r / 2 + 16);
  p.circle(dx * 1.5 + 34, r / 2 + 21, 18);
  p.strokeWeight(1);
  for (const cx of [0, dx]) {
    p.line(cx - r * .61, -r * .31, cx - r * .61, r * .31);
    p.line(cx - r * .27, r * .64, cx + r * .27, r * .64);
  }
  p.pop();
}

function render(p, seed, time) {
  p.background('#222527');
  p.noFill();
  p.strokeCap(p.ROUND);
  const breathe = Math.sin(time * .42 + (seed % 97) * .01);

  // Sparse hexagonal fragments suggest a combinatorial compound library.
  p.stroke('#555c60');
  p.strokeWeight(.9);
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 7; col++) {
      if ((col + row * 3 + seed) % 5 === 0) continue;
      const x = 65 + col * 31.2 + (row % 2) * 15.6;
      const y = 73 + row * 27;
      hex(p, x, y, 18, Math.PI / 6);
      hex(p, 1200 - x, 675 - y, 18, Math.PI / 6);
    }
  }

  // Fine registration marks remain independent of the living fold.
  p.stroke('#899094');
  p.strokeWeight(1);
  for (const [x, y, sx, sy] of [[45, 43, 1, 1], [1155, 43, -1, 1], [45, 632, 1, -1], [1155, 632, -1, -1]]) {
    p.line(x, y, x + sx * 32, y);
    p.line(x, y, x, y + sy * 32);
  }
  for (let i = 0; i < 15; i++) {
    const x = 502 + i * 14;
    p.line(x, 57, x, 57 + (i % 7 === 0 ? 14 : 5));
    p.line(1200 - x, 618, 1200 - x, 618 - (i % 7 === 0 ? 14 : 5));
  }

  // Parallel contours describe a continuous twisted, figure-eight ribbon.
  // The crossing is cut into the rear branch geometrically, without masks.
  for (let strand = 0; strand < 17; strand++) {
    const v = (strand - 8) / 8;
    p.stroke(strand === 0 || strand === 16 ? '#e2e4e4' : '#a3aaad');
    p.strokeWeight(strand === 0 || strand === 16 ? 1.6 : .85);
    let open = false;
    for (let i = 0; i <= 380; i++) {
      const t = i / 380 * TAU;
      if (Math.abs(t - Math.PI * 1.5) < .115) {
        if (open) p.endShape();
        open = false;
        continue;
      }
      if (!open) { p.beginShape(); open = true; }
      const width = 25 + 31 * (.5 + .5 * Math.sin(t * 2 + .7));
      const x = 600 + 435 * Math.cos(t) + v * width * Math.cos(t * 2 + .35);
      const y = 337.5 + (178 + breathe * 5) * Math.sin(2 * t) + v * width * Math.sin(t * 2 + .35);
      p.vertex(x, y);
    }
    if (open) p.endShape();
  }

  molecule(p, 333, 322, 28, -.25 + breathe * .025);
  molecule(p, 807, 337, 28, .3 - breathe * .025);

  p.stroke('#899094');
  p.strokeWeight(1);
  for (const [x, y] of [[368, 334], [845, 341]]) {
    p.arc(x, y, 190, 190, -.4, .25);
    p.arc(x, y, 190, 190, Math.PI - .4, Math.PI + .25);
    p.line(x - 6, y - 105, x + 6, y - 105);
    p.line(x, y - 111, x, y - 99);
    p.line(x - 6, y + 105, x + 6, y + 105);
    p.line(x, y + 99, x, y + 111);
  }
}

export function draw(p, seed) { render(p, seed, 0); }
export function animate(p, seed) { render(p, seed, p.millis() / 1000); }
