export const title = 'Controlled Permeability';
export const description = 'An open, folded perimeter admits a small bundle of paths into a sealed inner chamber: an abstract view of the infrastructure protecting pharmaceutical research.';

const TAU = Math.PI * 2;
function project(x, y, z, t) {
  const az = -0.19, ax = 0.47 + Math.sin(t * 0.12) * 0.025;
  const yy = y * Math.cos(ax) - z * Math.sin(ax);
  const zz = y * Math.sin(ax) + z * Math.cos(ax);
  const xx = x * Math.cos(az) - yy * Math.sin(az);
  const y2 = x * Math.sin(az) + yy * Math.cos(az);
  const perspective = 1000 / (1000 + zz);
  return [720 + xx * perspective, 338 + y2 * perspective];
}
function path(p, points) {
  p.beginShape();
  for (const v of points) p.vertex(...v);
  p.endShape();
}
function shellPoint(u, v, t) {
  const radius = 217 + 76 * Math.cos(v);
  return project(radius * Math.cos(u), radius * Math.sin(u), 92 * Math.sin(v), t);
}
function frame(p, seed, t) {
  p.background('#202223');
  p.noFill();
  p.strokeCap(p.ROUND);
  // The broad C-shaped ribbon is an abstract controlled perimeter.
  const start = -Math.PI + 0.39;
  const end = Math.PI - 0.39;
  for (let k = 0; k < 44; k++) {
    const v = TAU * k / 44;
    p.stroke(k % 11 === 0 ? '#e0e1dc' : '#969b9b');
    p.strokeWeight(k % 11 === 0 ? 1.7 : 0.72);
    const pts = [];
    for (let j = 0; j <= 180; j++) pts.push(shellPoint(start + (end - start) * j / 180, v, t));
    path(p, pts);
  }
  // Deliberately sparse cross-sections articulate the thickness of the boundary.
  for (let k = 0; k <= 18; k++) {
    const u = start + (end - start) * k / 18;
    p.stroke(k === 0 || k === 18 ? '#e9eae4' : '#626969');
    p.strokeWeight(k === 0 || k === 18 ? 1.8 : 0.65);
    const pts = [];
    for (let j = 0; j <= 90; j++) pts.push(shellPoint(u, TAU * j / 90, t));
    path(p, pts);
  }
  // A precise inner volume: structural geometry, not chemical bonds.
  const r = 75;
  const corners = [[-r,-r,-r],[r,-r,-r],[r,r,-r],[-r,r,-r],[-r,-r,r],[r,-r,r],[r,r,r],[-r,r,r]];
  const edges = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
  p.stroke('#d8ddd7'); p.strokeWeight(1.6);
  for (const [a,b] of edges) p.line(...project(...corners[a],t),...project(...corners[b],t));
  p.stroke('#929c99'); p.strokeWeight(0.7);
  for (let i = 1; i < 12; i++) {
    const z = -r + 2 * r * i / 12;
    path(p, [[-r,-r,z],[r,-r,z],[r,r,z],[-r,r,z],[-r,-r,z]].map(v => project(...v,t)));
  }
  // Incoming channels stay disciplined as they approach the narrow entrance.
  for (let i = 0; i < 7; i++) {
    const y = 228 + i * 32;
    const target = project(-r, -34 + i * 11, 0, t);
    p.stroke(i === 3 ? '#eef0e9' : '#777f7f');
    p.strokeWeight(i === 3 ? 2 : 0.95);
    p.bezier(82,y,280,y,355,target[1],target[0]-18,target[1]);
    p.circle(82,y,5);
  }
  // Registration marks give the image a restrained instrument-like precision.
  p.stroke('#6c7674'); p.strokeWeight(1);
  for (const [x,y,sx,sy] of [[60,66,1,1],[1140,66,-1,1],[60,609,1,-1],[1140,609,-1,-1]]) {
    p.line(x,y,x+20*sx,y); p.line(x,y,x,y+20*sy);
  }
  p.stroke('#9aa3a0');
  for (let i = 0; i < 13; i++) {
    const x = 622 + i * 16;
    p.line(x,583,x,583+(i%3===0?10:4));
  }
}
export function draw(p, seed) { frame(p, seed, 0); }
export function animate(p, seed) { frame(p, seed, p.millis() / 1000); }
