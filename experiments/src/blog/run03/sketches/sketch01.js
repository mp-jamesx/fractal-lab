export const title = 'The Affinity Engine';
export const description = 'An exploded isometric assay machine brings molecular candidates through three precise computational planes. Coral bonds converge on a teal binding site above a quiet pixel lattice.';

export function draw(p, seed) {
  p.background('#10171b');
  p.noFill();
  p.strokeCap(p.ROUND);
  p.strokeJoin(p.ROUND);
  const white = '#d9e3e5', teal = '#6ed4c8', coral = '#ff806e', lavender = '#a5a9df';
  const project = (x,y,z) => [600 + (x-y)*0.87, 455+(x+y)*0.36-z];
  const edge = (a,b,c=white,w=1) => {p.stroke(c);p.strokeWeight(w); p.line(...project(...a),...project(...b));};
  const path = (v,c,w=1,close=false) => {p.stroke(c);p.strokeWeight(w);p.beginShape();v.forEach(a=>p.vertex(...project(...a)));p.endShape(close?p.CLOSE:undefined);};
  const circle = (x,y,z,r,c,w=1) => {
    const v=[]; for(let i=0;i<65;i++){const a=i*Math.PI/32;v.push([x+r*Math.cos(a),y+r*Math.sin(a),z]);}path(v,c,w);
  };
  // Registration geometry surrounds the suspended assembly.
  p.stroke('#435358');p.strokeWeight(1);
  for(const [x,y,sx,sy] of [[62,54,1,1],[1138,54,-1,1],[62,621,1,-1],[1138,621,-1,-1]]){
    p.line(x,y,x+32*sx,y);p.line(x,y,x,y+32*sy);
  }
  for(let i=0;i<11;i++) {p.line(80+i*9,326,80+i*9,326+(i%5===0?22:8));p.line(1030+i*9,326,1030+i*9,326+(i%5===0?22:8));}
  // Deliberately sparse registration columns reveal the exploded spacing.
  for(const [x,y] of [[-210,-210],[210,-210],[210,210],[-210,210]]){
    for(let z=8;z<290;z+=12)edge([x,y,z],[x,y,z+4],'#435358',0.8);
  }
  for(let layer=0;layer<3;layer++){
    const z=layer*106, color=[lavender,white,teal][layer];
    path([[-210,-210,z],[210,-210,z],[210,210,z],[-210,210,z]],color,1.5,true);
    path([[-224,-224,z],[224,-224,z],[224,224,z],[-224,224,z]],'#435358',0.8,true);
    // Pixel-grid is expressed as isolated open square cells, never filled pixels.
    for(let x=-180;x<=180;x+=45)for(let y=-180;y<=180;y+=45){
      if(Math.abs(x)<92&&Math.abs(y)<92)continue;
      const s=layer===0?11:6;
      path([[x-s,y-s,z],[x+s,y-s,z],[x+s,y+s,z],[x-s,y+s,z]],layer===0?'#546174':'#3c6264',0.7,true);
    }
    circle(0,0,z,87,color,1.3);circle(0,0,z,99,'#435358',0.8);
    for(let i=0;i<12;i++){
      const a=i*Math.PI/6;
      edge([102*Math.cos(a),102*Math.sin(a),z],[113*Math.cos(a),113*Math.sin(a),z],color,1);
    }
  }
  // Threaded candidate trajectories meet inside the central aperture.
  for(let strand=0;strand<6;strand++){
    const v=[];
    for(let i=0;i<=130;i++){
      const z=i*2, a=i/130*Math.PI*1.6+strand*Math.PI/3;
      const r=48+15*Math.cos(z/45);
      v.push([r*Math.cos(a),r*Math.sin(a),z]);
    }
    path(v,strand%2?lavender:coral,strand%2?1:1.6);
  }
  // A single molecular constellation is resolved above the top plane.
  const nodes=[];
  for(let i=0;i<6;i++){
    const a=i*Math.PI/3;nodes.push([73*Math.cos(a),73*Math.sin(a),292+10*Math.sin(a)]);
  }
  nodes.push([132,5,310],[166,-40,328],[-109,-62,303],[-130,-113,316]);
  for(let i=0;i<6;i++)edge(nodes[i],nodes[(i+1)%6],coral,2.2);
  [[0,6],[6,7],[3,8],[8,9]].forEach(([a,b])=>edge(nodes[a],nodes[b],coral,2.2));
  nodes.forEach((n,i)=>{p.stroke(i===7?teal:white);p.strokeWeight(1.6);p.circle(...project(...n),i===7?16:10);});
  circle(0,0,275,105,teal,1);
  // Side leaders and stepped electronic traces keep the scene editorial, not diagrammatic.
  [[-210,110,212],[210,-110,106],[-210,-40,0]].forEach((v,i)=>{
    const [x,y]=project(...v), dir=i===1?1:-1;
    p.stroke(i===1?lavender:teal);p.strokeWeight(1);
    p.line(x,y,x+dir*55,y);p.line(x+dir*55,y,x+dir*80,y-25);p.line(x+dir*80,y-25,x+dir*128,y-25);
    p.circle(x+dir*128,y-25,7);
  });
}
