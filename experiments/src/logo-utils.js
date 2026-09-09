import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import svg from './mirror-logo.svg?raw';

export function getLogoShapes() {
  return new SVGLoader().parse(svg.replaceAll('currentColor', '#000000')).paths.flatMap(p => SVGLoader.createShapes(p));
}
export function makeLogoGeometry(depth = 2, bevel = 0.15) {
  const geometry = new THREE.ExtrudeGeometry(getLogoShapes(), { depth, steps: 1, curveSegments: 10, bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 2 });
  geometry.translate(-16, -10, -depth / 2);
  geometry.rotateX(Math.PI);
  return geometry;
}
export function insideLogo(x, y) {
  return outlines.some(points => pointInPolygon(x + 16, 10 - y, points));
}
const outlines = getLogoShapes().map(s => s.getPoints(16));
function pointInPolygon(x, y, points) {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const a = points[i], b = points[j];
    if ((a.y > y) !== (b.y > y) && x < (b.x-a.x)*(y-a.y)/(b.y-a.y)+a.x) inside = !inside;
  }
  return inside;
}
export function seededRandom(seed = 1) {
  return () => { seed = (Math.imul(1664525, seed) + 1013904223) | 0; return (seed >>> 0) / 4294967296; };
}
