export const title = 'The Binding Event';
export const description = 'A stippled molecular cloud resolves into an electric blue field of computational cross-sections.';

export function draw(p, seed) {
  p.randomSeed(seed);
  p.noiseSeed(seed);
  const ink = '#111211', paper = '#e4d9c4', blue = '#1649ff';
  p.background(paper);
  p.noStroke();
  p.fill(ink);
  p.rect(610, 0, 590, 675);

  // A quietly engraved paper surface, left behind by the analog specimen.
  for (let i = 0; i < 2600; i++) {
    p.fill(25, 23, 20, p.random(8, 24));
    p.circle(p.random(610), p.random(675), p.random(0.4, 1.3));
  }

  // Faint registration marks divide the two views without enclosing them.
  p.stroke(ink); p.strokeWeight(1); p.line(42, 87, 566, 87);
  p.stroke(95); p.line(652, 87, 1158, 87);
  p.noStroke(); p.textFont('monospace'); p.textSize(12);
  p.fill(ink); p.text('01 / CONFORMATION', 42,  60);
  p.fill(paper); p.text('02 / AFFINITY FIELD', 652, 60);

  const spheres = [
    [259, 181, 53], [361, 198, 66], [170, 248, 63],
    [438, 269, 62], [271, 280, 83], [363, 324, 84],
    [158, 365, 74], [448, 405, 63], [253, 426, 88],
    [352, 462, 80], [214, 524, 48], [419, 504, 48],
    [301, 551, 48], [204, 328, 47],
  ];
  // Rear bonds keep the cloud legible as one molecular structure.
  p.stroke(ink); p.strokeWeight(18);
  [[0,1],[0,2],[1,3],[2,4],[3,5],[4,5],[4,6],[5,7],[6,8],[8,9],[9,11],[8,10],[9,12]].forEach(([a,b]) => {
    p.line(spheres[a][0], spheres[a][1], spheres[b][0], spheres[b][1]);
  });
  const ctx = p.drawingContext;
  for (const [x,y,r] of spheres) {
    ctx.save();
    const grad = ctx.createRadialGradient(x-r*.34,y-r*.4,r*.04,x,y,r);
    grad.addColorStop(0, '#fffdf4'); grad.addColorStop(.5, '#e7dcc7'); grad.addColorStop(1, '#aa9a7b');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
    ctx.restore();
    p.noFill(); p.stroke(ink); p.strokeWeight(1.3); p.circle(x,y,r*2);
    p.noStroke();
    for(let i=0;i<650;i++) {
      const a=p.random(Math.PI*2), rr=r*Math.sqrt(p.random());
      const dx=Math.cos(a)*rr,dy=Math.sin(a)*rr;
      const shade=(dx+dy)/(r*2)+.35+Math.pow(rr/r,4)*.35;
      if(p.random()<shade) { p.fill(17,18,17,200); p.circle(x+dx,y+dy,p.random(.6,1.9)); }
    }
  }

  // A blue section cuts through the warm molecular cloud.
  p.noFill(); p.stroke(blue); p.strokeWeight(3);
  p.ellipse(299,351,421,114);
  p.strokeWeight(1); p.line(87,351,548,351);
  p.noStroke(); p.fill(blue); p.circle(87,351,8); p.circle(510,351,8);
  p.textSize(12); p.text('A',74,333); p.text('A′',521,333);

  // The right-hand counterpart is a nested, warped family of equipotential
  // contours. Closely spaced bands create optical motion at thumbnail scale.
  p.push(); p.translate(900,348); p.rotate(-.2);
  for (let k=38;k>=0;k--) {
    const t=k/38;
    const radius=37+t*224;
    p.noFill();
    p.stroke(k%8===0 ? '#f9f6ec' : blue);
    p.strokeWeight(k%8===0 ? 1.4 : 3.6);
    p.beginShape();
    for(let j=0;j<=220;j++) {
      const a=j/220*Math.PI*2;
      const wave=1+.135*Math.cos(a*3+t*3.3)+.06*Math.sin(a*5-t*4);
      const r=radius*wave;
      p.vertex(Math.cos(a)*r*.94,Math.sin(a)*r*.91);
    }
    p.endShape(p.CLOSE);
  }
  // Selected ligand: the small bright key inside the solved field.
  p.stroke(paper); p.strokeWeight(7);
  const ligand=[[-25,-8],[3,-27],[31,-9],[21,24],[-10,29]];
  for(let i=0;i<ligand.length;i++) { const a=ligand[i],b=ligand[(i+1)%ligand.length]; p.line(...a,...b); }
  p.noStroke();
  ligand.forEach(([x,y],i)=>{p.fill(i===2?blue:'#fffdf5');p.circle(x,y,i===2?20:13);});
  p.pop();

  // Transfer arrow and minimal section notation bind the paired specimens.
  p.stroke(paper); p.strokeWeight(1);
  p.line(574,351,656,351); p.line(649,345,656,351); p.line(649,357,656,351);
  p.noStroke(); p.fill(ink); p.textSize(11); p.text('A—A′ / MOLECULAR SECTION',42,624);
  p.fill(paper); p.text('BOUND STATE',652,624);
  p.stroke(paper); p.strokeWeight(2); p.line(1080,620,1158,620);
  p.line(1080,615,1080,625); p.line(1158,615,1158,625);
}
