export const title = 'Conformation Space';
export const description = 'A folded molecular ribbon resolves from a luminous point cloud, with spectral fringes tracing its computational possibilities.';

export function draw(p, seed) {
  p.background(5, 7, 10);
  const ctx = p.drawingContext;
  const glow = ctx.createRadialGradient(620, 320, 20, 620, 320, 520);
  glow.addColorStop(0, '#141820');
  glow.addColorStop(1, '#05070a');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 1200, 675);
  const TAU = Math.PI * 2;
  const phase = (seed % 91) * 0.0008;
  const center = t => [
    (2 + .72 * Math.cos(3 * t)) * Math.cos(2 * t),
    (2 + .72 * Math.cos(3 * t)) * Math.sin(2 * t),
    .96 * Math.sin(3 * t)
  ];
  const norm = a => { const d = Math.hypot(...a); return a.map(v => v / d); };
  const cross = (a, b) => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
  function surface(t, u) {
    const c = center(t), d = center(t + .001);
    const tangent = norm(d.map((v,i) => v-c[i]));
    const n = norm(cross(tangent, [0, 0, 1]));
    const b = cross(tangent, n);
    const twist = t * 1.5 + .4 + phase;
    const width = .40 + .13 * Math.sin(t * 3 + .2);
    const v = c.map((q,i) => q + width*u*(Math.cos(twist)*n[i]+Math.sin(twist)*b[i]));
    // A shallow camera angle opens the knot into an extended protein fold.
    const yy = v[1]*.67 - v[2]*.74;
    const zz = v[1]*.74 + v[2]*.67;
    const xx = v[0]*.985 - yy*.174;
    const y = v[0]*.174 + yy*.985;
    return { x: 600 + xx*167, y: 337+y*120, z: zz };
  }
  const steps = 290, bands = 25;
  const cells = [];
  for (let i=0; i<steps; i++) {
    for (let j=0; j<bands; j++) {
      const t=i/steps*TAU, u=j/bands*2-1;
      const a=surface(t,u), b=surface(t+TAU/steps,u);
      const c=surface(t+TAU/steps,u+2/bands), d=surface(t,u+2/bands);
      cells.push({a,b,c,d,t,u,z:(a.z+b.z+c.z+d.z)/4,i,j});
    }
  }
  cells.sort((a,b) => a.z-b.z);
  p.strokeJoin(p.ROUND);
  for (const f of cells) {
    const {a,b,c,d,u,t,j} = f;
    const light = 14 + 27*(.5+.5*Math.sin(t*3+.6)) + 14*(1-u*u);
    p.noStroke();
    p.fill(light*.83,light*.91,light);
    p.quad(a.x,a.y,b.x,b.y,c.x,c.y,d.x,d.y);
    const brightness=80+135*(.5+.5*Math.cos(t*2-1.2));
    p.stroke(brightness,brightness+5,Math.min(255,brightness+13),130);
    p.strokeWeight(j%5===0 ? .85 : .4);
    p.line(a.x,a.y,b.x,b.y);
    if (f.i%5===0) {
      p.stroke(205,224,243,55);
      p.strokeWeight(.45);
      p.line(a.x,a.y,d.x,d.y);
    }
    p.noStroke();
    p.fill(224,237,255,175);
    p.circle(a.x,a.y,j%5===0 ? 1.75 : 1.05);
    if (j===0 || j===bands-1) {
      const side=j===0 ? -1 : 1;
      const cols=[[255,49,47],[61,247,114],[50,106,255]];
      for(let k=0;k<3;k++) {
        const edge=side*(1+.028*k);
        const q=surface(t,edge), r=surface(t+TAU/steps,edge);
        p.stroke(...cols[k],220);
        p.strokeWeight(1.3);
        p.line(q.x,q.y,r.x,r.y);
      }
    }
  }
  // Sparse samples are the uncertain conformations surrounding the resolved surface.
  p.noStroke();
  for(let i=0;i<1300;i++) {
    const t=p.random(TAU), u=p.random(-1.48,1.48);
    if(Math.abs(u)<1.06) continue;
    const q=surface(t,u);
    const fade=(1.5-Math.abs(u))*90;
    p.fill(192,209,231,fade);
    p.circle(q.x+p.random(-2,2),q.y+p.random(-2,2),p.random(.6,1.6));
  }
  // Small calibration marks keep the image in the register of scientific imaging.
  p.stroke(140,156,177,90); p.strokeWeight(.7);
  for(const [x,y,sx,sy] of [[54,54,1,1],[1146,54,-1,1],[54,621,1,-1],[1146,621,-1,-1]]) {
    p.line(x,y,x+14*sx,y); p.line(x,y,x,y+14*sy);
  }
  p.noStroke();
  [[240,56,47],[72,238,122],[58,113,255]].forEach((c,i)=> {p.fill(...c);p.rect(1092+i*15,599,8,3);});
}
