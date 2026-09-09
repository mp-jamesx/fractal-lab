export const title = 'Separating the Signal';
export const description = 'Three suspended data fields separate tangled traces into ordered bands, suggesting curation, principled dataset splits, and evaluation.';

const project = (u, v, z) => [600 + (u - v) * 0.93, 346 + (u + v) * 0.35 - z];
function segment(p, a, b) { p.line(...a, ...b); }
function plane(p, z, index, time) {
  const u0 = -265, u1 = 265, v0 = -170, v1 = 170;
  const corners = [[u0,v0],[u1,v0],[u1,v1],[u0,v1]];
  p.stroke('#606568'); p.strokeWeight(1);
  // A sparse scaffold makes the independent evaluation fields legible.
  for (let u = -265; u <= 265; u += 53) {
    segment(p, project(u,v0,z), project(u,v1,z));
  }
  for (let v = -170; v <= 170; v += 34) {
    segment(p, project(u0,v,z), project(u1,v,z));
  }
  p.stroke('#c7cdcc'); p.strokeWeight(1.7);
  p.beginShape();
  corners.forEach(([u,v])=>p.vertex(...project(u,v,z)));
  p.endShape(p.CLOSE);
  // Each suspended field contains its own unconnected signal paths.
  for (let lane = 0; lane < 15; lane++) {
    const v = -143 + lane * 20.4;
    p.stroke(lane % 4 === 0 ? '#eef0eb' : '#9aabaa');
    p.strokeWeight(lane % 4 === 0 ? 2.0 : 1.05);
    p.beginShape();
    for (let step = 0; step <= 110; step++) {
      const u = u0 + step * (530/110);
      const envelope = Math.sin(Math.PI * step/110);
      const wandering = index === 2 ? 26 : index === 1 ? 13 : 5;
      const phase = u*.023 + lane*.7 + time*.13;
      const lift = 7 + envelope * (wandering*(.6+.4*Math.sin(phase)) + 3*Math.sin(phase*2.7));
      p.vertex(...project(u,v,z+lift));
    }
    p.endShape();
    if (lane % 3 === 0) {
      p.stroke('#dedfd9'); p.strokeWeight(1.1);
      const q = project(u1,v,z+7);
      p.circle(q[0],q[1],5);
    }
  }
  // Bold cut marks articulate the split at each corner.
  p.stroke('#eff1ed'); p.strokeWeight(3);
  for (const [u,v] of corners) {
    segment(p,project(u,v,z),project(u-Math.sign(u)*25,v,z));
    segment(p,project(u,v,z),project(u,v-Math.sign(v)*25,z));
  }
}
function render(p) {
  const time = p.millis()/1000;
  p.background('#252a2c'); p.noFill();
  // Broken construction uprights link the stack without merging its traces.
  p.stroke('#697173'); p.strokeWeight(1);
  for (const [u,v] of [[-265,-170],[265,-170],[-265,170],[265,170]]) {
    for(let z=-156;z<172;z+=13) segment(p,project(u,v,z),project(u,v,z+4));
  }
  plane(p,-132,0,time); plane(p,0,1,time); plane(p,132,2,time);
  // Rhythmic reference marks remain peripheral, like a quiet plotting frame.
  p.stroke('#8f999a'); p.strokeWeight(1);
  for(let i=0;i<12;i++) {
    const x=89+i*13;
    p.line(x,575,x,575+(i%4===0?16:6));
    const xr=1111-i*13;
    p.line(xr,95,xr,95-(i%4===0?16:6));
  }
}
export function draw(p, seed) { render(p); }
export function animate(p, seed) { render(p); }
