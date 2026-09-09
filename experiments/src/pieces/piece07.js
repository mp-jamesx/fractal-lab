import * as THREE from 'three';
import { insideLogo } from '../logo-utils.js';

export const title = 'Ember Atlas';
export const description = 'A folded M is woven from amber contour ribbons and a suspended field of charcoal dust.';

export function createPiece() {
  const group = new THREE.Group();
  const surface = [], colors = [], contours = [], points = [];
  const gold = new THREE.Color('#fcbf42'), orange = new THREE.Color('#e66b23');
  const z = (x, y) => 1.8 * Math.sin(x * .23 + y * .21) + .7 * Math.cos(y * .65) + .5 * Math.sin(x * .6);
  const step = .22, pitch = .58, width = .32;
  const vertex = (x,y) => {
    surface.push(x,y,z(x,y));
    const c = orange.clone().lerp(gold, .5 + .5 * Math.sin(y * .21 + x * .14));
    colors.push(c.r,c.g,c.b);
  };
  for (let y = -9.85; y < 10; y += pitch) {
    for (let x = -16; x < 16; x += step) {
      if (![ [x,y],[x+step,y],[x,y+width],[x+step,y+width] ].every(([a,b])=>insideLogo(a,b))) continue;
      vertex(x,y); vertex(x+step,y); vertex(x+step,y+width);
      vertex(x,y); vertex(x+step,y+width); vertex(x,y+width);
      contours.push(x,y+width,z(x,y+width)+.025,x+step,y+width,z(x+step,y+width)+.025);
      points.push(x,y,z(x,y)-.32);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(surface,3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors,3));
  geometry.computeVertexNormals();
  group.add(new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({vertexColors:true,roughness:1,metalness:0,side:THREE.DoubleSide})));
  const contourGeometry = new THREE.BufferGeometry();
  contourGeometry.setAttribute('position',new THREE.Float32BufferAttribute(contours,3));
  group.add(new THREE.LineSegments(contourGeometry,new THREE.LineBasicMaterial({color:'#ffdb72'})));
  const fringe = new THREE.LineSegments(contourGeometry,new THREE.LineBasicMaterial({color:'#b8481d'}));
  fringe.position.set(.07,-.07,-.17); group.add(fringe);
  const pointGeometry = new THREE.BufferGeometry();
  pointGeometry.setAttribute('position',new THREE.Float32BufferAttribute(points,3));
  group.add(new THREE.Points(pointGeometry,new THREE.PointsMaterial({color:'#94754b',size:.065,sizeAttenuation:true})));
  group.rotation.set(-.13,.1,-.03);
  return {group,background:'#171715',camera:[2,1,48]};
}
