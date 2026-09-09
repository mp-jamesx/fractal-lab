import * as THREE from 'three';

export const title = 'Chromatic Organ';
export const description = 'Paired, swollen lobes turn the M into a playful anatomical specimen with dark seams and sunset flesh.';

export function createPiece() {
  const group=new THREE.Group();
  const geometry=new THREE.SphereGeometry(1,32,24);
  const positions=geometry.attributes.position;
  const colors=[];
  const purple=new THREE.Color('#67249d'), magenta=new THREE.Color('#d9448e'), orange=new THREE.Color('#fb683d'), yellow=new THREE.Color('#ffc858');
  for(let i=0;i<positions.count;i++){
    const t=(positions.getY(i)+1)/2;
    const c=t<.36?purple.clone().lerp(magenta,t/.36):t<.72?magenta.clone().lerp(orange,(t-.36)/.36):orange.clone().lerp(yellow,(t-.72)/.28);
    colors.push(c.r,c.g,c.b);
  }
  geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
  const material=new THREE.MeshStandardMaterial({vertexColors:true,roughness:1,metalness:0});
  const dark=new THREE.MeshStandardMaterial({color:'#241126',roughness:1});
  const lobe=(x,y,scale,angle,phase)=>{
    const cluster=new THREE.Group();cluster.position.set(x,y,0);cluster.rotation.z=angle;
    // Two touching inflated chambers share a narrow waist along each diagonal stroke.
    for(const side of [-1,1]){
      const outer=new THREE.Mesh(geometry,dark);outer.position.set(0,side*.9,-.19);outer.scale.set(scale[0]*1.035,scale[1]*1.035,scale[2]);cluster.add(outer);
      const body=new THREE.Mesh(geometry,material);body.position.set(.025,side*.9,.1);body.scale.set(...scale);body.rotation.y=phase+side*.25;cluster.add(body);
    }
    group.add(cluster);
  };
  // The two long diagonal strokes and their detached lower-left terminal retain the original mark.
  for(let k=0;k<5;k++){
    const t=k/4;
    lobe(-13+13.9*t,7-14*t,[2.62,1.58,2.15],Math.PI/4,.1+k*.05);
    lobe(-1+13.9*t,7-14*t,[2.62,1.58,2.15],Math.PI/4,-.15+k*.04);
  }
  lobe(-12.5,-6.5,[2.65,1.7,2.25],Math.PI/4,.25);
  group.rotation.set(-.07,.1,0);
  return {group,background:'#211525',camera:[1,1,49]};
}
