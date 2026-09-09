export const title = 'Binding Field';
export const description = 'A cobalt molecular envelope resolves into a luminous computational mesh as satellite ligands approach its folded surface.';

export function draw(p, seed) {
  p.background(246, 247, 248);
  const ctx = p.drawingContext;
  const blue = [16, 53, 229];
  const phase = (seed % 1000) * 0.0005;
  // A sampled molecular envelope: radial lobes create pockets between domains.
  function surface(u, v) {
    const sx = Math.sin(v) * Math.cos(u);
    const sy = Math.cos(v);
    const sz = Math.sin(v) * Math.sin(u);
    const radius = 1 + 0.23 * Math.sin(3 * u + phase) * Math.pow(Math.sin(v), 2)
      + 0.19 * Math.cos(4 * v + 0.6) + 0.105 * Math.sin(5 * u - 2 * v) * Math.sin(v);
    const x = sx * radius * 289;
    const y = sy * radius * 239;
    const z = sz * radius * 235;
    const tilt = -0.34;
    return { x: 586 + x * Math.cos(tilt) - y * Math.sin(tilt),
      y: 341 + x * Math.sin(tilt) + y * Math.cos(tilt), z };
  }
  // Fine registration marks establish the scale of the central specimen.
  p.stroke(18, 22, 29, 42); p.strokeWeight(0.7);
  for (let y = 78; y <= 604; y += 13) p.line(55, y, y % 2 ? 61 : 66, y);
  p.line(83, 611, 1118, 611);
  for (let x = 83; x <= 1118; x += 23) p.line(x, 611, x, 616);
  p.noFill(); p.stroke(16, 53, 229, 25);
  p.ellipse(585, 344, 919, 416);
  p.ellipse(585, 344, 935, 432);
  p.stroke(15, 20, 28, 50);
  p.line(934, 128, 1107, 128); p.line(1107, 128, 1107, 286);
  p.line(115, 498, 115, 551); p.line(115, 551, 241, 551);
  p.noStroke(); p.fill(17, 21, 30);
  p.textFont('monospace'); p.textSize(10);
  p.text('04 / SURFACE AFFINITY', 84, 51);
  p.text('ENVELOPE  →  POCKET', 923, 641);
  p.text('r = 0.82', 956, 111);

  const rows = 66, cols = 108;
  const grid = Array.from({length: rows + 1}, (_, j) =>
    Array.from({length: cols + 1}, (_, i) => surface(i / cols * p.TWO_PI, j / rows * Math.PI)));
  const faces = [];
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const q = [grid[j][i], grid[j][i+1], grid[j+1][i+1], grid[j+1][i]];
    faces.push({q, z: q.reduce((s, a) => s+a.z, 0)/4, j, i});
  }
  faces.sort((a,b) => a.z-b.z);
  p.strokeWeight(0.6);
  for (const {q, z, j, i} of faces) {
    const a=q[0], b=q[1], c=q[3];
    const ux=b.x-a.x, uy=b.y-a.y, uz=b.z-a.z;
    const vx=c.x-a.x, vy=c.y-a.y, vz=c.z-a.z;
    let nx=uy*vz-uz*vy, ny=uz*vx-ux*vz, nz=ux*vy-uy*vx;
    const mag=Math.hypot(nx,ny,nz)||1;
    const light=Math.max(0,(-nx*0.45-ny*0.65+nz*0.65)/mag);
    const shade=0.3+light*0.7;
    p.fill(blue[0]*shade, blue[1]*shade, blue[2]*(0.45+0.55*shade));
    p.stroke(130,163,255,z > 0 ? 110 : 25);
    p.beginShape(); for(const v of q) p.vertex(v.x,v.y); p.endShape(p.CLOSE);
    if (z>55 && j%4===0) {
      p.stroke(245,250,255,190); p.strokeWeight(1);
      p.line(a.x,a.y,b.x,b.y); p.strokeWeight(0.6);
    }
    if(z>100 && j%7===0 && i%9===0){
      p.noStroke();p.fill(255);p.circle(a.x,a.y,2.3);
    }
  }
  // Free ligands use the same contour language, suspended around the envelope.
  function satellite(x,y,r) {
    ctx.save();
    const grad = ctx.createRadialGradient(x-r*.35,y-r*.45,0,x,y,r);
    grad.addColorStop(0,'#f5f8ff'); grad.addColorStop(.22,'#8facff');
    grad.addColorStop(.57,'#1445ee'); grad.addColorStop(1,'#03164b');
    ctx.fillStyle=grad;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
    ctx.clip();
    p.noFill();p.stroke(255,255,255,110);p.strokeWeight(.8);
    for(let k=-6;k<=6;k++){
      const dy=k*r/7, w=Math.sqrt(r*r-dy*dy);
      p.ellipse(x,y+dy,w*2,w*.3);
    }
    ctx.restore();
  }
  p.stroke(16,53,229,65);p.strokeWeight(1);p.noFill();
  ctx.setLineDash([3,6]);p.bezier(851,414,1000,460,1056,348,1026,243);ctx.setLineDash([]);
  satellite(1026,227,62);
  satellite(934,461,25);
  satellite(202,201,33);
  satellite(301,529,13);
  p.noFill();p.stroke(16,53,229,130);p.strokeWeight(1);
  p.circle(1026,227,153);
  p.line(1101,227,1115,227);p.line(1026,144,1026,158);
  p.noStroke();p.fill(12,20,33);p.textSize(10);
  p.text('LIGAND / 03',963,337);
  p.fill(16,53,229);p.rect(84,637,36,4);
  p.fill(13,20,32);p.text('10 nm',133,644);
}
