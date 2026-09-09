export const title = 'Beyond the Measuring Frame';
export const description = 'A calibrated open frame encounters an expanding contour field. Orange outlines mark the threshold into territory beyond existing bioinformatics benchmarks.';

function render(p, time) {
  p.background('#080909');
  p.noFill();
  p.strokeCap(p.SQUARE);

  // A quiet specimen field provides a fixed reference for the free contours.
  p.stroke('#383a38');
  p.strokeWeight(1);
  for (let x = 110; x <= 1090; x += 28) {
    p.point(x, 337.5);
  }
  for (let y = 85; y <= 590; y += 14) {
    p.point(608, y);
  }
  for (let x = 124; x <= 488; x += 52) {
    for (let y = 129; y <= 546; y += 52) {
      p.line(x - 3, y, x + 3, y);
      p.line(x, y - 3, x, y + 3);
    }
  }

  // Nested contours remain disciplined on the left and open into a broad,
  // unmeasured lobe on the right. Nothing here represents a molecule.
  for (let ring = 0; ring < 30; ring++) {
    const r = ring / 29;
    const wide = 85 + r * 336;
    const high = 32 + r * 211;
    p.stroke(ring % 7 === 0 ? '#faf8ed' : '#93968d');
    p.strokeWeight(ring % 7 === 0 ? 1.9 : 1.05);
    p.beginShape();
    for (let n = 0; n <= 240; n++) {
      const a = n / 240 * Math.PI * 2;
      const organic = (1 + Math.cos(a)) / 2;
      const wave = Math.sin(a * 3 + time * 0.12) * organic;
      const x = 685 + wide * Math.cos(a) + 27 * r * wave;
      const y = 336 + high * Math.sin(a) * (0.68 + 0.32 * organic)
        + 39 * r * Math.sin(a * 2) + 8 * r * wave;
      p.vertex(x, y);
    }
    p.endShape(p.CLOSE);
  }

  // The measuring apparatus deliberately has an open right edge.
  p.stroke('#ff6b2c');
  p.strokeWeight(3);
  p.beginShape();
  p.vertex(608, 159);
  p.vertex(608, 95);
  p.vertex(184, 95);
  p.vertex(184, 580);
  p.vertex(608, 580);
  p.vertex(608, 514);
  p.endShape();
  p.strokeWeight(1.4);
  for (let i = 0; i <= 24; i++) {
    const y = 105 + i * 19.3;
    p.line(184, y, 184 + (i % 4 === 0 ? 25 : 11), y);
  }
  for (let i = 1; i <= 19; i++) {
    const x = 184 + i * 21;
    const length = i % 4 === 0 ? 18 : 8;
    p.line(x, 95, x, 95 + length);
    p.line(x, 580, x, 580 - length);
  }

  // Open circular fiducial: a focal point beyond the bounded specimen area.
  p.strokeWeight(2.2);
  p.circle(982, 335, 24);
  p.line(961, 335, 970, 335);
  p.line(994, 335, 1003, 335);
  p.line(982, 314, 982, 323);
  p.line(982, 347, 982, 356);
  p.strokeWeight(1.1);
  p.line(1034, 552, 1102, 552);
  p.line(1102, 552, 1102, 484);
  p.line(1034, 122, 1102, 122);
  p.line(1102, 122, 1102, 190);
}

export function draw(p, seed) {
  render(p, 0);
}

export function animate(p, seed) {
  render(p, p.millis() / 1000);
}
