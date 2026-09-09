import * as THREE from 'three';
import { insideLogo, seededRandom } from '../logo-utils.js';

export const title = 'Antenna Herbarium';
export const description = 'Golden curved filaments and porcelain nodes reconstruct the mark as a suspended scientific specimen.';

export function createPiece() {
  const group = new THREE.Group();
  const random = seededRandom(3019);
  const nodes = [];
  for(let y=-9.6; y<10; y+=0.92) {
    for(let x=-15.6; x<16; x+=0.92) {
      const px=x+(random()-0.5)*0.24, py=y+(random()-0.5)*0.24;
      if(insideLogo(px,py)) nodes.push(new THREE.Vector3(px,py,1.5*Math.sin(px*0.25-py*0.2)));
    }
  }
  const filaments=[];
  function arc(a,b,lift) {
    const middle=a.clone().add(b).multiplyScalar(0.5); middle.z+=lift;
    const curve=new THREE.QuadraticBezierCurve3(a,middle,b);
    const points=curve.getPoints(6);
    for(let i=0;i<6;i++)filaments.push(...points[i].toArray(),...points[i+1].toArray());
  }
  nodes.forEach((a,i)=>{
    for(let j=i+1;j<nodes.length;j++){
      const b=nodes[j];
      if(a.distanceTo(b)<1.55) arc(a,b,0.22+random()*0.7);
    }
  });
  // Each circular hub fans into nearby lattice nodes like a magnified network sample.
  const hubs=[new THREE.Vector3(-12,-6,2.4),new THREE.Vector3(-6,0,2.8),new THREE.Vector3(6,0,2.8)];
  hubs.forEach((hub,index)=>{
    const radius=index===0?2.1:2.8;
    for(let k=0;k<60;k++){
      const theta=k/60*Math.PI*2, next=(k+1)/60*Math.PI*2;
      const a=new THREE.Vector3(hub.x+Math.cos(theta)*radius,hub.y+Math.sin(theta)*radius,hub.z);
      const b=new THREE.Vector3(hub.x+Math.cos(next)*radius,hub.y+Math.sin(next)*radius,hub.z);
      filaments.push(...a.toArray(),...b.toArray());
      if(k%5===0) {
        const nearest=nodes.reduce((best,n)=>n.distanceTo(a)<best.distanceTo(a)?n:best,nodes[0]);
        arc(a,nearest,1.1);
      }
    }
  });
  const lines=new THREE.BufferGeometry();lines.setAttribute('position',new THREE.Float32BufferAttribute(filaments,3));
  group.add(new THREE.LineSegments(lines,new THREE.LineBasicMaterial({color:'#e6b947'})));
  const points=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.10,1),new THREE.MeshStandardMaterial({color:'#fff7d8',roughness:1,metalness:0}),nodes.length);
  const dummy=new THREE.Object3D();nodes.forEach((node,i)=>{dummy.position.copy(node);dummy.scale.setScalar(i%11===0?1.65:1);dummy.updateMatrix();points.setMatrixAt(i,dummy.matrix);});
  group.add(points);
  return {group,background:'#24163f',camera:[4,3,44],update(time){group.rotation.y=Math.sin(time*0.15)*0.09;}};
}
