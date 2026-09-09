export const title = 'Conformation Vessel';
export const description = 'A sculptural molecular envelope unfolds into nested contours, with suspended wire spheres suggesting candidate compounds moving through a computed landscape.';

export function draw(p, seed) {
  p.background('#F5EFDF');
  p.noFill();
  p.strokeCap(p.ROUND);
  p.strokeJoin(p.ROUND);
  const teal = '#164F50';
  const coral = '#DF624F';
  const orange = '#CB813D';
  const phase = (seed % 97) * 0.002;
  const cx = 624;
  const cy = 332;

  // Smooth sectional rings of an imagined multi-lobed molecular envelope.
  // Each contour is a discrete open-space structural section, never a tone.
  function point(t, layer) {
    const s = 1 - layer * 0.070;
    const r = 1 + 0.205 * Math.cos(3 * t + 0.56)
      + 0.077 * Math.sin(5 * t - 0.4 + phase);
    const x = 273 * s * r * Math.cos(t);
    const y = 208 * s * r * Math.sin(t);
    const a = -0.25;
    return [cx + Math.cos(a) * x - Math.sin(a) * y + layer * 3.2,
      cy + Math.sin(a) * x + Math.cos(a) * y - layer * 3.4];
  }
  for (let layer = 0; layer < 11; layer++) {
    p.stroke(layer < 3 ? teal : layer < 8 ? coral : orange);
    p.strokeWeight(layer === 0 ? 2.9 : 1.8);
    p.beginShape();
    for (let i = 0; i <= 240; i++) {
      const pt = point(i / 240 * p.TWO_PI, layer);
      p.vertex(pt[0], pt[1]);
    }
    p.endShape(p.CLOSE);
  }

  // Sparse transverse ribs articulate volume without building a shaded mesh.
  p.stroke(teal);
  p.strokeWeight(1.6);
  for (let i = 0; i < 13; i++) {
    const t = i / 13 * p.TWO_PI + 0.08;
    p.beginShape();
    for (let j = 0; j <= 50; j++) {
      const layer = j / 5;
      const pt = point(t + 0.105 * Math.sin(layer * 0.24), layer);
      p.vertex(pt[0], pt[1]);
    }
    p.endShape();
  }

  function sphere(x, y, r, color, angle) {
    p.push();
    p.translate(x, y);
    p.rotate(angle);
    p.stroke(color);
    p.strokeWeight(2.1);
    p.circle(0, 0, 2 * r);
    p.strokeWeight(1.6);
    p.ellipse(0, 0, r * 0.64, r * 2);
    p.ellipse(0, 0, r * 1.47, r * 2);
    p.ellipse(0, 0, r * 2, r * 0.57);
    p.pop();
  }
  sphere(235, 451, 54, coral, -0.34);
  sphere(961, 180, 39, teal, 0.55);
  sphere(936, 481, 23, orange, -0.3);

  // Short orbit fragments add the suspended cadence of a sampled conformation.
  p.stroke(coral);
  p.strokeWeight(1.8);
  p.arc(235, 451, 150, 150, 2.9, 4.7);
  p.stroke(teal);
  p.arc(961, 180, 116, 116, -0.35, 1.35);
}
