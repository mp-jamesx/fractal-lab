import * as THREE from 'three';
import { insideLogo, seededRandom } from '../logo-utils.js';

export const title = 'Orbital Bloom';
export const description = 'A pale molecular M gathers along a tilted blue orbit, its soft joints swelling into strange celestial fruit.';

export function createPiece() {
  const group = new THREE.Group();
  const random = seededRandom(404);
  const nodes = [];
  const step = 1.18;
  for (let y = -9.5; y <= 10; y += step) {
    for (let x = -15.5; x <= 16; x += step) {
      if (!insideLogo(x, y)) continue;
      const z = 0.9 * Math.sin(x * 0.32 + y * 0.23) + 0.3 * Math.cos(y);
      nodes.push({ x, y, z, radius: 0.58 + random() * 0.28 });
    }
  }
  const spheres = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 10, 7), new THREE.MeshStandardMaterial({ color: '#d8eafa', roughness: 1 }), nodes.length);
  const dummy = new THREE.Object3D();
  nodes.forEach((node, i) => {
    dummy.position.set(node.x, node.y, node.z);
    dummy.scale.setScalar(node.radius);
    dummy.updateMatrix();
    spheres.setMatrixAt(i, dummy.matrix);
    spheres.setColorAt(i, new THREE.Color(i % 13 === 0 ? '#355d8a' : i % 5 === 0 ? '#a0c4e3' : '#edf4f8'));
  });
  group.add(spheres);
  const joins = [];
  nodes.forEach((a, i) => {
    for (let j = i + 1; j < nodes.length; j++) {
      const b = nodes[j];
      const distance = Math.hypot(a.x-b.x, a.y-b.y);
      if (distance < step * 1.05) joins.push([a,b]);
    }
  });
  const links = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.22, 0.38, 1, 7), new THREE.MeshStandardMaterial({ color: '#abcde8', roughness: 1 }), joins.length);
  const up = new THREE.Vector3(0,1,0);
  joins.forEach(([a,b],i) => {
    const start = new THREE.Vector3(a.x,a.y,a.z);
    const end = new THREE.Vector3(b.x,b.y,b.z);
    const delta = end.clone().sub(start);
    dummy.position.copy(start.add(end).multiplyScalar(0.5));
    dummy.quaternion.setFromUnitVectors(up,delta.clone().normalize());
    dummy.scale.set(1,delta.length(),1);
    dummy.updateMatrix(); links.setMatrixAt(i,dummy.matrix);
  });
  group.add(links);
  const orbitPoints = [];
  for (let i=0;i<=160;i++) {
    const t=i/160*Math.PI*2;
    orbitPoints.push(new THREE.Vector3(16.1*Math.cos(t),6.1*Math.sin(t),3.1*Math.sin(t)));
  }
  const orbit = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(orbitPoints),160,0.14,6,false), new THREE.MeshStandardMaterial({color:'#284f7b',roughness:1}));
  orbit.rotation.z = 0.33;
  group.add(orbit);
  const fruit = new THREE.Mesh(new THREE.SphereGeometry(1.9,20,12),new THREE.MeshStandardMaterial({color:'#f8faf6',roughness:1}));
  fruit.position.set(11.8,7.4,2.2); group.add(fruit);
  const moon = new THREE.Mesh(new THREE.SphereGeometry(0.85,14,10),new THREE.MeshStandardMaterial({color:'#335e87',roughness:1}));
  moon.position.set(-13.9,-6.5,1.9);group.add(moon);
  return { group, background:'#86aac8', camera:[25,19,62] };
}
