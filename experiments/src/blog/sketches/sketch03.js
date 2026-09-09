export const title = 'Affinity Islands';
export const description = 'An archipelago of molecular possibility, with computational currents embedded in blue organic fields.';

export function draw(p, seed) {
  p.background('#e3eff6');
  const ctx = p.drawingContext;
  const navy = '#092c58';
  // A specimen is a continuous, lobed envelope rather than a collection of atoms.
  function specimen(x, y, rx, ry, rot, phase, dark = true) {
    p.push();
    p.translate(x, y);
    p.rotate(rot);
    const outline = [];
    for (let i = 0; i < 240; i++) {
      const a = i / 240 * Math.PI * 2;
      const r = 1 + 0.22 * Math.cos(a * 3 + phase) + 0.11 * Math.sin(a * 5 - phase) + 0.045 * Math.cos(a * 7);
      outline.push([Math.cos(a) * rx * r, Math.sin(a) * ry * r]);
    }
    ctx.save();
    ctx.beginPath();
    outline.forEach(([xx, yy], i) => i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy));
    ctx.closePath();
    ctx.fillStyle = dark ? navy : '#ffffff';
    ctx.fill();
    ctx.clip();
    // Flow trajectories suggest a simulated binding-energy field.
    p.noFill();
    for (let j = -60; j < 65; j++) {
      const yy = j * 6.1;
      p.stroke(dark ? '#98c8e7' : '#719bc0');
      p.strokeWeight(j % 7 === 0 ? 1.65 : 0.58);
      p.beginShape();
      for (let xx = -rx * 1.45; xx <= rx * 1.45; xx += 5) {
        const wave = Math.sin(xx / (rx * 0.39) + yy / 91 + phase) * ry * 0.24;
        const funnel = Math.exp(-Math.pow((xx - rx * 0.2) / (rx * 0.36), 2));
        p.vertex(xx, yy + wave + Math.sin(yy / 56) * funnel * ry * 0.35);
      }
      p.endShape();
    }
    // A clipped, procedural micrograph texture gives each island a second scale.
    p.noStroke();
    for (let i = 0; i < 1100; i++) {
      const xx = p.random(-rx * 1.35, rx * 1.35);
      const yy = p.random(-ry * 1.35, ry * 1.35);
      if (p.noise(xx * 0.011 + 40, yy * 0.013 + 30 + phase) > 0.53) {
        p.fill(dark ? 'rgba(239,249,255,0.75)' : 'rgba(21,68,112,0.45)');
        p.circle(xx, yy, p.random(0.8, 2.2));
      }
    }
    // Open cavities interrupt the contour field like molecular binding pockets.
    for (let k = 0; k < 3; k++) {
      const cx = (k - 1) * rx * 0.52;
      const cy = Math.sin(k * 2 + phase) * ry * 0.26;
      p.fill(dark ? navy : '#ffffff');
      p.stroke(dark ? '#d9edf9' : '#092c58');
      p.strokeWeight(1.2);
      p.ellipse(cx, cy, rx * 0.24, ry * 0.25);
      p.noFill();
      p.ellipse(cx, cy, rx * 0.31, ry * 0.33);
      p.noStroke();
      p.fill(dark ? '#ffffff' : navy);
      p.circle(cx, cy, 4);
    }
    ctx.restore();
    p.pop();
  }

  // Sparse field registration marks keep the full-bleed collage precise.
  p.stroke('#b6cddd');
  p.strokeWeight(0.7);
  for (let y = 38; y < 675; y += 60) {
    for (let x = 36; x < 1200; x += 60) {
      p.line(x - 2, y, x + 2, y);
      p.line(x, y - 2, x, y + 2);
    }
  }

  specimen(608, 346, 272, 184, -0.47, 1.15, true);
  specimen(103, 124, 102, 77, 0.4, 0.1, true);
  specimen(1036, 111, 131, 87, -0.25, 2.2, false);
  specimen(1127, 446, 93, 126, 0.7, 3.2, true);
  specimen(177, 558, 148, 99, -0.16, 4, false);
  specimen(805, 666, 102, 80, 0.7, 2.2, true);
  specimen(521, -31, 113, 79, 0.3, 4.2, false);

  // Small candidate ligands float between the much larger receptor surfaces.
  function ligand(x, y, s, angle) {
    p.push(); p.translate(x, y); p.rotate(angle);
    p.stroke(navy); p.strokeWeight(1.8); p.noFill();
    p.beginShape();
    for (let i = 0; i < 6; i++) p.vertex(Math.cos(i * Math.PI / 3) * s, Math.sin(i * Math.PI / 3) * s);
    p.endShape(p.CLOSE);
    p.line(s, 0, s * 1.8, 0);
    p.line(-s / 2, -s * 0.866, -s * 0.8, -s * 1.6);
    p.noStroke(); p.fill(navy);
    p.circle(s * 1.8, 0, 6); p.circle(-s * 0.8, -s * 1.6, 6);
    p.pop();
  }
  ligand(245, 311, 20, 0.1);
  ligand(851, 88, 14, -0.5);
  ligand(949, 548, 17, 0.6);
  p.noStroke(); p.fill(navy); p.textFont('monospace'); p.textSize(9);
  p.text('03 / 128', 234, 352);
  p.text('17 / 128', 934, 592);
  p.text('02 / 128', 841, 128);
}
