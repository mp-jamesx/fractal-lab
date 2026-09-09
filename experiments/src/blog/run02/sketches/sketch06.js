export const title = 'Conformer Column';
export const description = 'Three orbital chambers share a narrow molecular spine, suspended inside a broken perforated frame. Purple, magenta and amber outlines suggest a sequence of computational conformations.';

export function draw(p, seed) {
  p.background('#100e15');
  p.noFill();
  p.strokeCap(p.ROUND);
  p.strokeJoin(p.ROUND);
  const gold = '#efc34c';
  const orange = '#ec7448';
  const pink = '#da5baf';
  const violet = '#8e70cd';
  const phase = (seed % 97) / 97;

  // One open-volume silhouette, pinched between three circular chambers.
  p.push();
  p.translate(638, 337);
  p.rotate(-0.085);
  function shell(inset, color, weight) {
    p.stroke(color);
    p.strokeWeight(weight);
    const ctx = p.drawingContext;
    ctx.strokeStyle = color; ctx.lineWidth = weight;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(0, -264 + inset);
    ctx.bezierCurveTo(119 - inset, -267, 148 - inset, -140, 65 - inset, -97);
    ctx.bezierCurveTo(27, -77, 29, -68, 69 - inset, -49);
    ctx.bezierCurveTo(156 - inset, -7, 143 - inset, 74, 62 - inset, 105);
    ctx.bezierCurveTo(29, 117, 32, 130, 60 - inset, 145);
    ctx.bezierCurveTo(134 - inset, 186, 104 - inset, 263 - inset, 0, 264 - inset);
    ctx.bezierCurveTo(-103 + inset, 266 - inset, -134 + inset, 185, -60 + inset, 145);
    ctx.bezierCurveTo(-32, 130, -29, 117, -62 + inset, 105);
    ctx.bezierCurveTo(-143 + inset, 74, -156 + inset, -7, -69 + inset, -49);
    ctx.bezierCurveTo(-29, -68, -27, -77, -65 + inset, -97);
    ctx.bezierCurveTo(-148 + inset, -140, -119 + inset, -267, 0, -264 + inset);
    ctx.stroke();
  }
  shell(0, violet, 2.3);
  shell(10, pink, 1.8);

  const chambers = [
    { y: -174, r: 72, c: pink, tilt: -0.43 },
    { y: 24, r: 82, c: gold, tilt: 0.43 },
    { y: 202, r: 49, c: orange, tilt: -0.3 },
  ];
  chambers.forEach(({ y, r, c, tilt }) => {
    p.push();
    p.translate(0, y);
    p.stroke(c);
    p.strokeWeight(2.2);
    p.circle(0, 0, r * 2);
    p.rotate(tilt + phase * 0.05);
    // Sparse great circles describe a hollow cage, without a shaded surface.
    p.ellipse(0, 0, r * 2, r * 0.62);
    p.ellipse(0, 0, r * 0.72, r * 2);
    p.rotate(Math.PI * 0.33);
    p.ellipse(0, 0, r * 0.8, r * 2);
    p.pop();
  });
  p.stroke(gold);
  p.strokeWeight(2.2);
  p.bezier(-10, -101, -30, -82, -30, -67, -10, -58);
  p.bezier(10, -101, 30, -82, 30, -67, 10, -58);
  p.stroke(orange);
  p.bezier(-10, 106, -27, 123, -27, 137, -10, 153);
  p.bezier(10, 106, 27, 123, 27, 137, 10, 153);
  p.pop();

  // Fragments of an archival stamp, kept far from the suspended sculpture.
  p.stroke(violet);
  p.strokeWeight(1.7);
  for (const [x, y, direction] of [[324, 108, 1], [922, 467, -1]]) {
    p.line(x, y, x + direction * 67, y);
    for (let i = 0; i < 5; i++) {
      const cy = y + 10 + i * 20;
      p.arc(x, cy, 14, 20, direction === 1 ? -p.HALF_PI : p.HALF_PI,
        direction === 1 ? p.HALF_PI : p.PI + p.HALF_PI);
    }
    p.line(x, y + 100, x, y + 130);
  }
}
