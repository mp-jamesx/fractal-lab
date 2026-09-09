import * as THREE from 'three';
import { makeLogoGeometry } from '../logo-utils.js';

export const title = 'Index of Echoes';
export const description = 'Nine open contour specimens preserve the M in depth while a single unruly blue filament escapes its measured archive.';

export function createPiece(){
  const group=new THREE.Group();
  const slab=makeLogoGeometry(.06,0);
  const edgeGeo=new THREE.EdgesGeometry(slab,20);
  for(let i=0;i<9;i++){
    const color=i===8?'#f5f2e9':i%2===0?'#7e9caf':'#465d6c';
    const edge=new THREE.LineSegments(edgeGeo,new THREE.LineBasicMaterial({color}));
    edge.position.z=(i-4)*.78;
    edge.position.x=(i-4)*.12;
    group.add(edge);
  }
  // Sparse pale front strips give the contour stack a tangible paper-thin skin.
  const face=new THREE.Mesh(slab,new THREE.MeshStandardMaterial({color:'#dbe1df',roughness:1,transparent:true,opacity:.15,depthWrite:false}));
  face.position.z=3.12;group.add(face);
  const loop=[];
  for(let i=0;i<=340;i++){
    const t=i/340*Math.PI*5;
    const u=i/340;
    loop.push(new THREE.Vector3(-14+28*u+3.5*Math.sin(t),3.8*Math.cos(t)+2*Math.sin(u*Math.PI*2),4.8*Math.sin(t)));
  }
  const filament=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(loop),340,.105,6,false),new THREE.MeshStandardMaterial({color:'#91bad3',roughness:1}));
  group.add(filament);
  const ticks=[];
  for(let x=-16;x<=16;x++) {
    ticks.push(x,-11.2,-3.5,x,-11.2+(x%4===0?.7:.3),-3.5);
  }
  ticks.push(-16,-11.2,-3.5,16,-11.2,-3.5);
  for(let y=-10;y<=10;y+=2)ticks.push(-17,y,-3.5,-16.6,y,-3.5);
  const tickGeo=new THREE.BufferGeometry();tickGeo.setAttribute('position',new THREE.Float32BufferAttribute(ticks,3));
  group.add(new THREE.LineSegments(tickGeo,new THREE.LineBasicMaterial({color:'#83929c'})));
  // Index posts reveal spacing through the stack without closing its open silhouette.
  const rodGeo=new THREE.CylinderGeometry(.07,.07,6.6,7);
  const rodMat=new THREE.MeshStandardMaterial({color:'#b8c4cc',roughness:1});
  for(const [x,y] of [[-14,7],[-2,7],[13,-7],[-2,-7],[-14,-6]]){
    const rod=new THREE.Mesh(rodGeo,rodMat);rod.rotation.x=Math.PI/2;rod.position.set(x,y,0);group.add(rod);
  }
  return {group,background:'#252c32',camera:[25,18,65]};
}
