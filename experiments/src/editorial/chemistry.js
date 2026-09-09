import conformers from './data/conformers.json';
export { conformers };
// Orthographic projection of rigid 3D coordinates. No 2D chemical-layout generation.
export function project3D(point, {x=600,y=337.5,scale=70,rx=.6,ry=.7,rz=-.2}={}) {
  let [a,b,c]=point;
  [b,c]=[b*Math.cos(rx)-c*Math.sin(rx),b*Math.sin(rx)+c*Math.cos(rx)];
  [a,c]=[a*Math.cos(ry)+c*Math.sin(ry),-a*Math.sin(ry)+c*Math.cos(ry)];
  [a,b]=[a*Math.cos(rz)-b*Math.sin(rz),a*Math.sin(rz)+b*Math.cos(rz)];
  return [x+a*scale,y+b*scale,c];
}
export function drawMolecule(p,name,options={}) {
  const molecule=conformers[name];
  if(!molecule)throw Error(`Unknown conformer: ${name}`);
  const {color='#d5dce0',accent=color,hydrogens=true,weight=1.3,atomRadius=.14}=options;
  const projected=molecule.atoms.map(atom=>project3D(atom.position,options));
  p.push();p.noFill();p.strokeCap(p.ROUND);
  const segments=[];
  for(const bond of molecule.bonds){
    const a=molecule.atoms[bond.a],b=molecule.atoms[bond.b];
    if(!hydrogens&&(a.element==='H'||b.element==='H'))continue;
    const start=projected[bond.a],end=projected[bond.b];
    segments.push({a:start,b:end,color,weight:a.element==='H'||b.element==='H'?weight*.55:weight});
  }
  // Three actual great circles describe each atom's wire sphere.
  molecule.atoms.forEach((atom,i)=>{
    if(!hydrogens&&atom.element==='H')return;
    const r=atomRadius*(atom.element==='H'?.62:1);
    for(let plane=0;plane<3;plane++)for(let j=0;j<24;j++){
      const point=t=>{const q=[...atom.position];q[plane]+=r*Math.cos(t);q[(plane+1)%3]+=r*Math.sin(t);return project3D(q,options);};
      segments.push({a:point(j*Math.PI/12),b:point((j+1)*Math.PI/12),color:['C','H'].includes(atom.element)?color:accent,weight:weight*.7});
    }
  });
  segments.sort((a,b)=>(a.a[2]+a.b[2])-(b.a[2]+b.b[2]));
  const depth=Math.max(1,...projected.map(a=>Math.abs(a[2])));
  for(const s of segments){const c=p.color(s.color);c.setAlpha(110+140*((s.a[2]+s.b[2])/(4*depth)+.5));p.stroke(c);p.strokeWeight(s.weight);p.line(s.a[0],s.a[1],s.b[0],s.b[1]);}
  p.pop();return projected;
}
