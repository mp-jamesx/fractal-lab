export const title = 'Return to the experiment';
export const description = 'A continuous teal circuit joins an ordered proposal stack to an unfolding test chamber. Its returning pulse suggests computational ideas grounded by physical experiments.';

const TAU = Math.PI * 2;
const project = (x, y, z = 0) => [600 + x * 0.94 - y * 0.53, 392 + x * 0.23 + y * 0.65 - z];

function path(p, points, close = false) {
  p.beginShape();
  for (const a of points) p.vertex(...a);
  p.endShape(close ? p.CLOSE : undefined);
}
function plane(p, x, y, z, size) {
  path(p, [[x-size,y-size,z],[x+size,y-size,z],[x+size,y+size,z],[x-size,y+size,z]].map(v=>project(...v)),true);
}
function circuit(p, phase) {
  // Parallel contours describe one continuous return path, without chemical bonds.
  for (let j = 0; j < 19; j++) {
    const s = j / 18;
    p.stroke(j % 6 === 0 ? '#a2e9d0' : '#286d67');
    p.strokeWeight(j % 6 === 0 ? 1.6 : 0.8);
    const pts = [];
    for (let i=0; i<=240; i++) {
      const u=i/240*TAU;
      const r=29*Math.cos(s*Math.PI);
      const z=24*Math.sin(s*Math.PI)+13*Math.sin(2*u);
      pts.push(project((397+r)*Math.cos(u),(211+r)*Math.sin(u),z));
    }
    path(p,pts);
  }
  for (const offset of [0, Math.PI]) {
    const u=phase*0.11+offset+0.4;
    const pts=[];
    for(let j=0;j<=60;j++) {
      const a=j/60*TAU;
      pts.push(project((397+30*Math.cos(a))*Math.cos(u),(211+30*Math.cos(a))*Math.sin(u),24*Math.sin(a)+13*Math.sin(2*u)));
    }
    p.stroke('#dcf8eb');p.strokeWeight(2);path(p,pts,true);
  }
}
function frame(p, time) {
  p.background('#080e0e');p.noFill();
  // Sparse registration crosses make the negative space feel measured.
  p.stroke('#25413c');p.strokeWeight(1);
  for(let row=0;row<5;row++) for(let col=0;col<11;col++) {
    const x=100+col*100,y=108+row*112;
    if(Math.abs(x-600)<350 && Math.abs(y-350)<180) continue;
    p.line(x-2,y,x+2,y);p.line(x,y-2,x,y+2);
  }
  circuit(p,time);
  // Exploded square layers: the computational proposal.
  const lx=-305,ly=-20;
  for(let layer=0;layer<4;layer++) {
    const z=30+layer*42;
    p.stroke(layer===3?'#e7f0eb':'#467b70');p.strokeWeight(layer===3?1.8:1);
    plane(p,lx,ly,z,74);
    if(layer===3) {
      p.stroke('#78988e');p.strokeWeight(.85);
      for(let n=-2;n<=2;n++) {
        path(p,[project(lx+n*22,ly-66,z),project(lx+n*22,ly+66,z)]);
        path(p,[project(lx-66,ly+n*22,z),project(lx+66,ly+n*22,z)]);
      }
    }
  }
  p.stroke('#39574e');p.strokeWeight(.9);
  for(const [dx,dy] of [[-74,-74],[74,-74],[74,74],[-74,74]]) {
    for(let z=35;z<154;z+=10) path(p,[project(lx+dx,ly+dy,z),project(lx+dx,ly+dy,z+4)]);
  }
  // A physical test is expressed by open contour rings above a small stage.
  const rx=310,ry=14;
  p.stroke('#85b59c');p.strokeWeight(1.4);plane(p,rx,ry,25,87);plane(p,rx,ry,35,87);
  for(let k=0;k<21;k++) {
    const v=k/20;
    const radius=58+15*Math.sin(v*Math.PI)-7*v;
    const points=[];
    for(let i=0;i<=100;i++) {
      const a=i/100*TAU;
      const r=radius+5*Math.sin(a*3+v*2+time*.045)*Math.sin(v*Math.PI);
      points.push(project(rx+r*Math.cos(a),ry+r*Math.sin(a),45+v*176));
    }
    p.stroke(k===20?'#e6f5e9':k%5===0?'#81baa0':'#365e51');
    p.strokeWeight(k===20?2:k%5===0?1.4:.85);path(p,points,true);
  }
  // Two quiet alignment marks connect the stations across the open center.
  p.stroke('#537970');p.strokeWeight(1);
  for(const x of [-128,128]) {
    const a=project(x,0,65);
    p.line(a[0]-7,a[1],a[0]+7,a[1]);p.line(a[0],a[1]-7,a[0],a[1]+7);
  }
}
export function draw(p, seed) { frame(p, 0); }
export function animate(p, seed) { frame(p, p.millis()/1000); }
