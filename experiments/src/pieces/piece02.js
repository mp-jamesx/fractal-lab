import * as THREE from 'three';
import { insideLogo } from '../logo-utils.js';

export const title = 'Quiet Voltage';
export const description = 'A blue folded membrane breathes beneath a precise constellation of white ceramic pinpoints.';

export function createPiece() {
  const group = new THREE.Group();
  const positions = [];
  const dots = [];
  const step = 0.38;
  const surface = (x, y) => 1.8 * Math.sin((x + y) * 0.51) + 0.7 * Math.cos(y * 0.43) + 0.12 * x;
  function vertex(x, y) { positions.push(x, y, surface(x, y)); }
  for (let y = -10; y < 10; y += step) {
    for (let x = -16; x < 16; x += step) {
      const corners = [[x,y],[x+step,y],[x+step,y+step],[x,y+step]];
      if (!corners.every(([a,b]) => insideLogo(a,b))) continue;
      vertex(x,y); vertex(x+step,y); vertex(x+step,y+step);
      vertex(x,y); vertex(x+step,y+step); vertex(x,y+step);
      dots.push([x+step/2,y+step/2,surface(x+step/2,y+step/2)+0.07]);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.computeVertexNormals();
  const membrane = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({color:'#154dff', roughness:0.95, metalness:0, side:THREE.DoubleSide}));
  group.add(membrane);
  const pinpoints = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.055,0), new THREE.MeshStandardMaterial({color:'#f9fcff',roughness:1}), dots.length);
  const dummy = new THREE.Object3D();
  dots.forEach(([x,y,z],i)=>{dummy.position.set(x,y,z);dummy.updateMatrix();pinpoints.setMatrixAt(i,dummy.matrix);});
  group.add(pinpoints);
  // The separate lower skin makes each fold visibly float above its own silhouette.
  const lower = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({color:'#0834ab',roughness:1,side:THREE.DoubleSide}));
  lower.position.z = -0.65;
  group.add(lower);
  group.rotation.set(-0.10,0.1,0);
  return {group, background:'#e9effc',camera:[6,5,45],update(time){group.rotation.y=0.1+Math.sin(time*0.18)*0.075;}};
}
