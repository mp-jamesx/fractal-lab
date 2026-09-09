export const title = 'The invariant neighborhood';
export const description = 'A spatial graph turns inside an exploded coordinate scaffold, preserving its edges and neighborhoods as its orientation changes. A conceptual response to EquiformerV3.';

const PHI = (1 + Math.sqrt(5)) / 2;
const vertices = [];
for (const a of [-1, 1]) for (const b of [-1, 1]) {
  vertices.push([0, a, b * PHI], [a, b * PHI, 0], [b * PHI, 0, a]);
}
const edges = [];
for (let i = 0; i < vertices.length; i++) for (let j = i + 1; j < vertices.length; j++) {
  if (Math.abs(Math.hypot(...vertices[i].map((v, k) => v - vertices[j][k])) - 2) < .001) edges.push([i, j]);
}

function frame(p, time) {
  p.background('#eeede6');
  p.noFill();
  p.strokeCap(p.ROUND);
  const turn = .38 + time * .055;
  const project = (v, spin = 0) => {
    const c = Math.cos(spin), s = Math.sin(spin);
    const x = v[0] * c - v[2] * s;
    const z = v[0] * s + v[2] * c;
    return [600 + .86 * x - .51 * z, 338 + .30 * x + .51 * z - .81 * v[1]];
  };
  const line = (a, b) => p.line(...a, ...b);
  const poly = (pts, close = false) => {
    p.beginShape();
    for (const v of pts) p.vertex(...v);
    p.endShape(close ? p.CLOSE : undefined);
  };

  // Exploded coordinate planes carry the architecture around the invariant graph.
  for (const y of [-215, 0, 215]) {
    p.stroke('#b4b3ad'); p.strokeWeight(.9);
    const r = 270;
    poly([[-r,y,-r],[r,y,-r],[r,y,r],[-r,y,r]].map(v => project(v)), true);
    for (let k = -240; k <= 240; k += 40) {
      for (let j = -240; j <= 240; j += 40) {
        const q = project([k,y,j]);
        p.line(q[0]-1.4,q[1],q[0]+1.4,q[1]);
      }
    }
    p.stroke('#555650'); p.strokeWeight(1.2);
    for (const x of [-r,r]) for (const z of [-r,r]) {
      const q = project([x,y,z]);
      p.circle(...q, 7);
    }
  }
  p.stroke('#989992'); p.strokeWeight(.8);
  p.drawingContext.setLineDash([3,8]);
  for (const x of [-270,270]) for (const z of [-270,270]) line(project([x,-215,z]),project([x,215,z]));
  p.drawingContext.setLineDash([]);

  // Three perpendicular great circles describe a rotating coordinate frame.
  for (let axis = 0; axis < 3; axis++) {
    p.stroke(axis === 1 ? '#666861' : '#aaa9a1');
    p.strokeWeight(axis === 1 ? 1.4 : .85);
    const ring = [];
    for (let n = 0; n <= 160; n++) {
      const a = n / 160 * Math.PI * 2;
      const v = [Math.cos(a)*226,Math.sin(a)*226,0];
      if (axis === 1) [v[1],v[2]] = [v[2],v[1]];
      if (axis === 2) [v[0],v[2]] = [v[2],v[0]];
      ring.push(project(v,turn));
    }
    poly(ring);
  }

  // A regular icosahedron is purely mathematical, never chemical.
  const points = vertices.map(v => project(v.map(n => n * 105),turn));
  for (const [a,b] of edges) {
    p.stroke('#242621'); p.strokeWeight(2.0);
    line(points[a],points[b]);
  }
  p.stroke('#161813'); p.strokeWeight(2.0);
  for (const q of points) p.circle(...q,10);

  // Cropped register marks preserve the restrained editorial margin.
  p.stroke('#777970'); p.strokeWeight(1);
  for (const [x,y,sx,sy] of [[66,64,1,1],[1134,64,-1,1],[66,611,1,-1],[1134,611,-1,-1]]) {
    p.line(x,y,x+24*sx,y); p.line(x,y,x,y+24*sy);
  }
  p.stroke('#92938b');
  for (let i=0;i<17;i++) p.line(66+i*8,337,66+i*8,337+(i%4===0?10:4));
  for (let i=0;i<17;i++) p.line(1006+i*8,337,1006+i*8,337-(i%4===0?10:4));
}

export function draw(p, seed) { frame(p,0); }
export function animate(p, seed) { frame(p,p.millis()/1000); }
