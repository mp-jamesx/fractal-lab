export const title = 'Affinity Totem';
export const description = 'Engraved molecular orbitals stack into a quiet cyan sculpture, with a single magenta binding site.';

export function draw(p, seed) {
  p.background('#0b0d0e');
  const ink = '#0b0d0e';
  // A perforated specimen sheet, floating in the dark.
  p.noStroke();
  p.fill('#e8eeea');
  p.rect(347, 33, 506, 609);
  p.fill(ink);
  for (let x = 350; x < 860; x += 21) {
    p.circle(x, 33, 10);
    p.circle(x, 642, 10);
  }
  for (let y = 40; y < 640; y += 21) {
    p.circle(347, y, 10);
    p.circle(853, y, 10);
  }
  p.rect(365, 51, 470, 573);
  p.noFill();
  p.stroke('#334448');
  p.strokeWeight(0.65);
  p.rect(375, 61, 450, 553);
  // The same orbital surface is sampled as latitude and meridian curves.
  // Deliberate overlapping shells make a folded molecular chain.
  const shells = [
    { x: 588, y: 470, r: 104, turn: -0.22, accent: false },
    { x: 642, y: 338, r: 121, turn: 0.32, accent: false },
    { x: 563, y: 191, r: 108, turn: -0.32, accent: false },
  ];
  const project = (s, u, v) => {
    const ring = s.r * (0.76 + 0.265 * Math.cos(v));
    const x = ring * Math.cos(u);
    const z = ring * Math.sin(u);
    const y = s.r * 0.45 * Math.sin(v);
    const py = y * 0.87 + z * 0.44;
    return [s.x + x * Math.cos(s.turn) - py * Math.sin(s.turn), s.y + x * Math.sin(s.turn) + py * Math.cos(s.turn), z * 0.87 - y * 0.44];
  };
  for (let j = 0; j < shells.length - 1; j++) {
    const a = shells[j], b = shells[j + 1];
    p.noFill();
    for (let n = 0; n < 24; n++) {
      p.stroke(104, 154, 158, 85);
      p.strokeWeight(0.65);
      const d = (n - 12) * 1.8;
      p.bezier(a.x + d, a.y - 16, a.x - 40 + d, a.y - 80, b.x + 46 + d, b.y + 74, b.x + d, b.y + 15);
    }
  }
  for (const s of shells) {
    // An opaque orbital silhouette gives the wire engraving weight.
    p.fill(ink); p.noStroke();
    p.beginShape();
    for (let n = 0; n <= 180; n++) {
      const u = n / 180 * Math.PI * 2;
      const x = s.r * 1.03 * Math.cos(u), y = s.r * 0.59 * Math.sin(u);
      p.vertex(s.x + x * Math.cos(s.turn) - y * Math.sin(s.turn), s.y + x * Math.sin(s.turn) + y * Math.cos(s.turn));
    }
    p.endShape(p.CLOSE);
    const curves = [];
    for (let n = 0; n < 44; n++) {
      const v = n / 44 * Math.PI * 2;
      const points = [];
      for (let k = 0; k <= 160; k++) points.push(project(s, k / 160 * Math.PI * 2, v));
      curves.push({ points, depth: points.reduce((t, q) => t + q[2], 0) / points.length });
    }
    curves.sort((a,b) => a.depth-b.depth);
    p.noFill();
    for (const curve of curves) {
      p.stroke(146, 196, 197, 150); p.strokeWeight(0.72);
      p.beginShape(); for (const pt of curve.points) p.vertex(pt[0],pt[1]); p.endShape();
    }
    for (let n = 0; n < 74; n++) {
      const u = n / 74 * Math.PI * 2;
      const front = Math.sin(u);
      p.stroke(193, 226, 220, 55 + 125 * (front + 1) / 2); p.strokeWeight(0.6);
      p.beginShape();
      for (let k = 0; k <= 64; k++) { const pt = project(s,u,k / 64 * Math.PI * 2); p.vertex(pt[0],pt[1]); }
      p.endShape();
    }
  }
  // A small ligand sits in the open pocket of the upper orbital.
  p.stroke('#df408d'); p.strokeWeight(2);
  const ligand = [[539,172],[565,155],[594,169],[593,200],[566,215],[539,201]];
  p.noFill(); p.beginShape(); ligand.forEach(q=>p.vertex(...q)); p.endShape(p.CLOSE);
  p.line(565,155,563,132); p.line(594,169,615,157);
  p.noStroke(); p.fill('#eb529d'); ligand.forEach(q=>p.circle(...q,8)); p.circle(563,132,10); p.circle(615,157,7);
  // Fine registration marks outside the specimen; space remains meditative.
  p.stroke('#526566'); p.strokeWeight(1);
  for (const x of [285,915]) {
    p.line(x,313,x,362); p.line(x-6,337,x+6,337);
    for (let i=0;i<6;i++) p.line(x-3,392+i*7,x+3,392+i*7);
  }
  p.noStroke(); p.fill('#85aeb0');
  for(let i=0;i<5;i++) p.rect(103,556+i*5,44-i*7,1);
  p.fill('#de428d'); p.rect(1053,104,37,4);
  // Very fine paper/print variation, seeded by the host.
  for(let i=0;i<2600;i++) {
    const x=p.random(383,818), y=p.random(70,605);
    p.fill(219,237,226,p.random(4,16)); p.rect(x,y,0.8,0.8);
  }
}
