import * as THREE from 'three';
import { insideLogo, seededRandom } from '../logo-utils.js';

export const title = 'Anatomy of a Signal';
export const description = 'Cobalt molecular beads become open cross-sections as the M passes between two specimen columns.';

export function createPiece() {
  const group = new THREE.Group(), random = seededRandom(808);
  const samples = [];
  for(let y=-9.6;y<10;y+=1.02) for(let x=-15.5;x<16;x+=1.02) {
    if(insideLogo(x,y)) samples.push([x,y]);
  }
  const sphereGeometry = new THREE.SphereGeometry(.49,12,8);
  const beadMaterial = new THREE.MeshStandardMaterial({color:'#194ae5',roughness:1,metalness:0});
  const beads = new THREE.InstancedMesh(sphereGeometry,beadMaterial,samples.length * 2);
  const dummy = new THREE.Object3D(); let n=0;
  const ringSamples=[];
  for(const [x,y] of samples){
    const depth= .9 + 1.1 * Math.sin((x-y)*.19);
    if(x < 0){
      for(const layer of [-1,1]){
        dummy.position.set(x-.35,y,layer*depth*.65);
        const s=.86+random()*.2; dummy.scale.setScalar(s); dummy.updateMatrix();
        beads.setMatrixAt(n++,dummy.matrix);
      }
    } else {
      ringSamples.push([x+.35,y,depth*.65]);
      dummy.position.set(x+.35,y,-depth*.65); dummy.scale.setScalar(.7); dummy.updateMatrix();
      beads.setMatrixAt(n++,dummy.matrix);
    }
  }
  beads.count=n; group.add(beads);
  const rings=new THREE.InstancedMesh(new THREE.TorusGeometry(.405,.065,5,16),new THREE.MeshStandardMaterial({color:'#10131a',roughness:1}),ringSamples.length);
  ringSamples.forEach(([x,y,z],i)=>{dummy.position.set(x,y,z+.7);dummy.rotation.set(.08,0,0);dummy.scale.setScalar(1);dummy.updateMatrix();rings.setMatrixAt(i,dummy.matrix);});group.add(rings);
  const linePoints=[];
  // Sparse registration ticks describe a specimen plate without replacing the sculptural silhouette.
  for(const x of [-17.4,17.4])for(let y=-10;y<=10;y+=2)linePoints.push(x,y,-2,x+(x<0?.4:-.4),y,-2);
  linePoints.push(0,-11,-2,0,11,-2);
  const lines=new THREE.BufferGeometry();lines.setAttribute('position',new THREE.Float32BufferAttribute(linePoints,3));
  group.add(new THREE.LineSegments(lines,new THREE.LineBasicMaterial({color:'#929aa9'})));
  return {group,background:'#f3f1e9',camera:[2,1,49]};
}
