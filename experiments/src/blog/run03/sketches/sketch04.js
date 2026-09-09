export const title = 'Assay Relay';
export const description = 'An exploded isometric assay: a coral candidate passes through lavender computation into a teal field of possible binding sites. Fine wire geometry and traveling signals make the discovery stack quietly live.';

const C = { bg: '#10171d', white: '#edf2ed', dim: '#36434e', lavender: '#aaa1df', teal: '#5cc5bc', coral: '#ff816f', blue: '#708ed0' };
function scene(p, seed, time) {
  p.background(C.bg);
  p.noFill();
  p.strokeJoin(p.ROUND);
  p.strokeCap(p.ROUND);
  const iso = (u, v, h = 0) => [600 + (u - v) * 1.12, 470 + (u + v) * .47 - h];
  const line = (a, b) => p.line(...a, ...b);
  const path = (pts, close = false) => { p.beginShape(); pts.forEach(q => p.vertex(...q)); p.endShape(close ? p.CLOSE : undefined); };
  const square = (x,y,size,h) => path([iso(x-size,y-size,h),iso(x+size,y-size,h),iso(x+size,y+size,h),iso(x-size,y+size,h)],true);
  const corners = [[-178,-178],[178,-178],[178,178],[-178,178]];

  // The expanded machine's quiet registration marks.
  p.stroke(C.dim); p.strokeWeight(1);
  for (let x = 85; x <= 1120; x += 28) {
    p.line(x, 624, x + 5, 624);
    if (x < 260 || x > 930) p.line(x, 52, x + 5, 52);
  }
  [[70,74],[1130,74],[70,600],[1130,600]].forEach(([x,y],i) => {
    const dx = i%2 ? -22 : 22, dy = i<2 ? 22 : -22;
    p.line(x,y,x+dx,y); p.line(x,y,x,y+dy);
  });
  for (const [u,v] of corners) {
    const a=iso(u,v,0), b=iso(u,v,280);
    for (let t=0;t<1;t+=.035) line([a[0],a[1]+(b[1]-a[1])*t],[a[0],a[1]+(b[1]-a[1])*(t+.012)]);
  }

  // Three wire-only assay plates; base lattice, computation channels, candidate.
  [0,132,264].forEach((h, layer) => {
    p.stroke(layer===0?C.teal:layer===1?C.lavender:C.white); p.strokeWeight(1.15);
    path(corners.map(([u,v])=>iso(u,v,h)),true);
    p.stroke(C.dim);
    path(corners.map(([u,v])=>iso(u,v,h-8)),true);
    corners.forEach(([u,v])=>line(iso(u,v,h),iso(u,v,h-8)));
    if (layer===0) {
      for (let q=-150;q<=150;q+=30) { line(iso(q,-165,h),iso(q,165,h)); line(iso(-165,q,h),iso(165,q,h)); }
    }
    // Offset short telemetry rails give each deck its own rhythm.
    p.stroke(layer===0?C.teal:layer===1?C.lavender:C.coral);
    for(let n=0;n<11;n++) line(iso(-160+n*12,185,h),iso(-155+n*12,185,h));
  });

  // Small outlined receptor sockets, with one active site lifted off its lattice.
  for(let a=-2;a<=2;a++) for(let b=-2;b<=2;b++) {
    const u=a*58, v=b*58, active=a===0&&b===0;
    p.stroke(active?C.coral:C.teal); p.strokeWeight(active?2:1);
    const lift=active ? 16+3*Math.sin(time) : 0;
    const pts=[];
    for(let k=0;k<6;k++){const t=k*Math.PI/3;pts.push(iso(u+15*Math.cos(t),v+15*Math.sin(t),lift));}
    path(pts,true);
    if(active){line(iso(u-15,v,0),iso(u-15,v,lift));line(iso(u+15,v,0),iso(u+15,v,lift));}
  }

  // Routing through a computational interposer, all angular, all open.
  p.stroke(C.lavender); p.strokeWeight(1.2);
  for(let i=0;i<7;i++) {
    const q=-138+i*46;
    path([iso(-163,q,132),iso(-90,q,132),iso(-42,q*.37,132)]);
    path([iso(163,q,132),iso(90,q,132),iso(42,q*.37,132)]);
    square(-150,q,4,132); square(150,q,4,132);
  }
  square(0,0,40,132); square(0,0,29,132);
  p.stroke(C.blue);
  for(let i=0;i<5;i++){
    const u=-24+i*12;
    line(iso(u,-65,132),iso(u,-40,132));line(iso(u,40,132),iso(u,65,132));
  }

  // Skeletal ligand in the top tray. Its ring rises like a crown above the device.
  const bob=2.8*Math.sin(time*.7);
  const atoms=[];
  for(let k=0;k<6;k++){
    const a=k*Math.PI/3+.15;
    atoms.push(iso(74*Math.cos(a),74*Math.sin(a),303+bob+13*Math.sin(a)));
  }
  p.stroke(C.coral);p.strokeWeight(2.5);
  for(let k=0;k<6;k++){
    const a=atoms[k],b=atoms[(k+1)%6];line(a,b);
    if(k%2===0){const c=iso(0,0,303+bob); line([a[0]*.85+c[0]*.15,a[1]*.85+c[1]*.15],[b[0]*.85+c[0]*.15,b[1]*.85+c[1]*.15]);}
  }
  [[0,140,-16,315],[2,-98,137,310],[4,-104,-133,300]].forEach(([idx,u,v,h])=>{
    const a=iso(u,v,h+bob);line(atoms[idx],a);
    p.circle(a[0],a[1],11);
    const b=iso(u*1.2,v*1.2,h+19+bob);line(a,b);p.circle(b[0],b[1],17);
  });
  p.strokeWeight(1.3);atoms.forEach(a=>p.circle(a[0],a[1],8));

  // Energetic descending connections and traveling empty signal rings.
  const tracks=[[-112,-88],[105,83]];
  tracks.forEach(([u,v],i)=>{
    const a=iso(u,v,258),b=iso(u,v,144),c=iso(u,v,12);
    p.stroke(i?C.teal:C.coral); p.strokeWeight(1.1);
    line(a,b);line(iso(u,v,122),c);
    [0,1].forEach(segment=>{
      const f=(time*.19+i*.47+segment*.21)%1;
      const point=iso(u,v,(segment?122:258)-f*110);
      p.circle(point[0],point[1],7);
    });
  });
}
export function draw(p, seed) { scene(p, seed, 0); }
export function animate(p, seed) { scene(p, seed, p.millis()/1000); }
