import * as THREE from 'three';
import { insideLogo, seededRandom } from '../logo-utils.js';

export const title = 'Chromatic Chainmail';
export const description = 'Interlocking ceramic rings turn the mark into a porous, restless cellular organism.';

export function createPiece() {
  const group = new THREE.Group();
  const random = seededRandom(1701);
  const locations = [];
  for (let y = -9.5, row = 0; y <= 9.5; y += 1.25, row++) {
    for (let x = -15.5 + (row % 2) * 0.68; x < 16; x += 1.35) {
      if (insideLogo(x, y)) locations.push([x, y, row]);
    }
  }
  const material = new THREE.MeshStandardMaterial({ roughness: 1, metalness: 0 });
  const mesh = new THREE.InstancedMesh(new THREE.TorusGeometry(0.73, 0.19, 6, 18), material, locations.length * 2);
  const dummy = new THREE.Object3D();
  const palette = ['#eceae1', '#ff4338', '#3572f5', '#50ba71'];
  locations.forEach(([x, y, row], i) => {
    for (let layer = 0; layer < 2; layer++) {
      const index = i * 2 + layer;
      dummy.position.set(x, y, (layer - 0.5) * 1.15 + Math.sin(x * 0.33 + y * 0.27) * 1.1);
      dummy.rotation.set((layer ? -1 : 1) * (0.28 + random() * 0.35), ((i + row) % 2 ? 1 : -1) * 0.46, random() * 0.25);
      const size = 0.86 + random() * 0.25;
      dummy.scale.setScalar(size);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
      mesh.setColorAt(index, new THREE.Color(palette[(Math.floor((x + 16) / 4) + row + layer) % palette.length]));
    }
  });
  group.add(mesh);
  group.rotation.set(-0.12, 0.13, -0.03);
  return { group, background: '#151719', camera: [7, 6, 45], update(time) { mesh.rotation.y = Math.sin(time * 0.2) * 0.06; } };
}
