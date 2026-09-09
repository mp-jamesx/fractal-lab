import { breadcrumbs } from './breadcrumbs.js';
import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import logoSvg from './mirror-logo.svg?raw';
import './single.css';

const container = document.querySelector('#app');
container.insertAdjacentHTML('afterbegin', breadcrumbs('Original M logo'));
const scene = new THREE.Scene();
scene.background = new THREE.Color('#ffffff');
const camera = new THREE.OrthographicCamera(-32, 32, 20, -20, 0.1, 100);
camera.position.set(-24, 18, 55);
camera.lookAt(0, 0, 0);

try {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.domElement.setAttribute('role', 'img');
  renderer.domElement.setAttribute('aria-label', '3D Mirror Physics M logo. Drag to orbit, scroll to zoom.');
  container.appendChild(renderer.domElement);

  // Preserve the source SVG's three separate, rounded outlines as real meshes.
  const logo = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({ color: '#b8bcc3', roughness: 1, metalness: 0 });
  const wireMaterial = new THREE.LineBasicMaterial({ color: '#374151', transparent: true, opacity: 0.45 });
  const wires = [];
  const { paths } = new SVGLoader().parse(logoSvg.replaceAll('currentColor', '#000000'));
  for (const path of paths) {
    for (const shape of SVGLoader.createShapes(path)) {
      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: 4, steps: 1, curveSegments: 12,
        bevelEnabled: true, bevelThickness: 0.25, bevelSize: 0.25, bevelSegments: 3,
      });
      geometry.translate(-16, -10, -2);
      // Rotate rather than reflect, preserving outward-facing triangle winding.
      geometry.rotateX(Math.PI);
      const mesh = new THREE.Mesh(geometry, material);
      const wire = new THREE.LineSegments(new THREE.WireframeGeometry(geometry), wireMaterial);
      wire.visible = false;
      mesh.add(wire);
      wires.push(wire);
      logo.add(mesh);
    }
  }
  scene.add(logo);
  scene.add(new THREE.HemisphereLight('#ffffff', '#7a808c', 2.2));
  const keyLight = new THREE.DirectionalLight('#ffffff', 2.5);
  keyLight.position.set(-20, 30, 45);
  scene.add(keyLight);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.minZoom = 0.5;
  controls.maxZoom = 3;
  controls.update();
  controls.saveState();

  const toolbar = document.createElement('div');
  toolbar.className = 'toolbar';
  toolbar.innerHTML = '<span>Drag to orbit · Scroll to zoom</span><button type="button" aria-pressed="false">Wireframe</button><button type="button">Reset view</button>';
  container.appendChild(toolbar);
  const [wireButton, resetButton] = toolbar.querySelectorAll('button');
  wireButton.addEventListener('click', () => {
    const enabled = wireButton.getAttribute('aria-pressed') !== 'true';
    wireButton.setAttribute('aria-pressed', String(enabled));
    wires.forEach(wire => { wire.visible = enabled; });
    render();
  });
  resetButton.addEventListener('click', () => { controls.reset(); render(); });

  function render() {
    const { width, height } = container.getBoundingClientRect();
    if (!width || !height) return;
    const aspect = width / height;
    // Fit the complete mark with generous whitespace in either orientation.
    const viewHeight = Math.max(48, 64 / aspect);
    camera.left = -viewHeight * aspect / 2;
    camera.right = viewHeight * aspect / 2;
    camera.top = viewHeight / 2;
    camera.bottom = -viewHeight / 2;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.render(scene, camera);
  }

  const resizeObserver = new ResizeObserver(render);
  controls.addEventListener('change', render);
  resizeObserver.observe(container);
  render();

  if (import.meta.hot) import.meta.hot.dispose(() => {
    resizeObserver.disconnect();
    controls.dispose();
    toolbar.remove();
    wires.forEach(wire => wire.geometry.dispose());
    wireMaterial.dispose();
    logo.children.forEach(mesh => mesh.geometry.dispose());
    material.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  });
} catch (error) {
  container.textContent = 'Unable to start the 3D renderer. Enable WebGL and reload.';
  console.error(error);
}
