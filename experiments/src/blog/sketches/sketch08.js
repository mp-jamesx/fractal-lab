export const title = 'Beyond the Binding Horizon';
export const description = 'A coral molecular constellation hovers over a gridded teal horizon, tracing the next possible binding state.';

export function draw(p, seed) {
  p.randomSeed(seed);
  p.noiseSeed(seed);
  const ctx = p.drawingContext;
  const cream = '#f5eedc';
  const teal = '#123f43';
  p.background(cream);

  // An immense, oblique energy landscape, seen at the scale of a planet.
  p.push();
  p.translate(786, 1407);
  p.rotate(-0.27);
  p.noStroke();
  p.fill('#e66c4e');
  p.ellipse(0, 0, 2610, 2215);
  p.fill('#ee9a62');
  p.ellipse(0, 22, 2610, 2215);
  p.fill(teal);
  p.ellipse(0, 42, 2610, 2215);
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(0, 42, 1305, 1107.5, 0, 0, Math.PI * 2);
  ctx.clip();
  p.noFill();
  p.stroke(245, 238, 220, 42);
  p.strokeWeight(0.7);
  // Projected longitude / latitude arcs, deliberately broad and quiet.
  for (let x = -1800; x <= 1800; x += 80) {
    p.beginShape();
    for (let y = -1250; y < 100; y += 20) {
      p.vertex(x * (0.52 + 0.48 * (y + 1250) / 1350), y);
    }
    p.endShape();
  }
  for (let k = 0; k < 24; k++) {
    p.ellipse(0, 42, 2610 + k * 90, 2215 + k * 67);
  }
  ctx.restore();
  p.pop();

  // Orbital construction lines locate the candidate in a field of possibilities.
  p.noFill();
  p.stroke(18, 63, 67, 33);
  p.strokeWeight(0.7);
  p.line(175, 398, 1010, 132);
  p.line(286, 97, 835, 499);
  p.push();
  p.translate(565, 288);
  p.rotate(-0.31);
  p.ellipse(0, 0, 410, 133);
  p.ellipse(0, 0, 454, 164);
  p.pop();

  const atoms = [
    {x: 475, y: 284, r: 30},
    {x: 521, y: 233, r: 40},
    {x: 589, y: 243, r: 37},
    {x: 624, y: 297, r: 44},
    {x: 586, y: 351, r: 35},
    {x: 523, y: 344, r: 33},
    {x: 668, y: 236, r: 23},
    {x: 697, y: 193, r: 17},
    {x: 454, y: 366, r: 20},
  ];
  const bonds = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[3,6],[6,7],[5,8]];
  p.strokeCap(p.ROUND);
  for (const [i,j] of bonds) {
    const a = atoms[i], b = atoms[j];
    p.stroke('#c65343');
    p.strokeWeight(15);
    p.line(a.x,a.y,b.x,b.y);
    p.stroke('#f3a574');
    p.strokeWeight(5);
    p.line(a.x-2,a.y-3,b.x-2,b.y-3);
  }
  for (const a of atoms) {
    const grad = ctx.createRadialGradient(a.x-a.r*.36,a.y-a.r*.4,1,a.x,a.y,a.r);
    grad.addColorStop(0,'#ffd3a0');
    grad.addColorStop(.42,'#f28e61');
    grad.addColorStop(.8,'#e26550');
    grad.addColorStop(1,'#b94b42');
    ctx.fillStyle=grad;
    ctx.beginPath();
    ctx.arc(a.x,a.y,a.r,0,Math.PI*2);
    ctx.fill();
    // Fine stippling preserves a printed, almost powdery surface.
    p.noStroke();
    for (let i=0;i<350;i++) {
      const theta=p.random(Math.PI*2), rr=Math.sqrt(p.random())*a.r;
      const x=Math.cos(theta)*rr, y=Math.sin(theta)*rr;
      p.fill(y+x>0 ? '#9f484231' : '#fff0c94a');
      p.circle(a.x+x,a.y+y,p.random(.35,1));
    }
  }
  // Ghost coordinates imply a computational search beyond the material object.
  p.stroke(18,63,67,102);
  p.strokeWeight(.8);
  for (const a of [{x:371,y:325},{x:792,y:212},{x:889,y:175}]) {
    p.noFill();
    p.circle(a.x,a.y,9);
    p.line(a.x-8,a.y,a.x+8,a.y);
    p.line(a.x,a.y-8,a.x,a.y+8);
  }
  p.stroke(18,63,67,64);
  ctx.setLineDash([2,6]);
  p.line(709,190,889,175);
  ctx.setLineDash([]);

  // Sparse registration marks keep the expansive composition editorial.
  p.stroke(18,63,67,100);
  p.line(49,48,74,48);
  p.line(49,48,49,73);
  p.line(1150,48,1125,48);
  p.line(1150,48,1150,73);
  p.noStroke();
  p.fill(cream);
  for(let i=0;i<6;i++) p.circle(1080+i*10,616,2);
}
