import { breadcrumbs } from './breadcrumbs.js';
import * as THREE from 'three';
import { makeLogoGeometry } from './logo-utils.js';
import experiments from './experiments.json';
import './home.css';

document.title = 'Experiments';
const app = document.querySelector('#app');
app.setAttribute('aria-label', 'Experiments');
app.innerHTML = breadcrumbs() + '<h1>Experiments</h1><section class="experiment-grid" aria-label="Experiment library"></section>';
const grid = app.querySelector('.experiment-grid');
const cleanups = [];
for (const experiment of experiments) {
  const link = document.createElement('a');
  link.className = 'experiment-card collection-link';
  link.href = import.meta.env.BASE_URL + experiment.path.replace(/^\//, '');
  link.setAttribute('aria-label', `${experiment.name}, experiment ${experiment.id}`);
  const preview = document.createElement('div');
  preview.className = 'experiment-preview';
  const caption = document.createElement('div');
  caption.className = 'experiment-caption';
  const name = document.createElement('h2'); name.textContent = experiment.name;
  const number = document.createElement('span'); number.textContent = experiment.id;
  caption.append(name, number); link.append(preview, caption); grid.append(link);
  if (['blog-thumbnail','editorial-thumbnail'].includes(experiment.preview)) {
    let disposed = false, instance;
    cleanups.push(() => { disposed = true; instance?.remove(); });
    Promise.all([import('p5'), experiment.preview === 'editorial-thumbnail' ? import('./editorial/sketches/sketch01.js') : import('./blog/sketches/sketch01.js')]).then(([{ default: p5 }, sketch]) => {
      if (disposed) return;
      instance = new p5(p => {
        p.setup = () => {
          p.createCanvas(1200,675).elt.setAttribute('aria-hidden','true'); p.pixelDensity(1);
          p.randomSeed(27300); p.noiseSeed(27300); p.noLoop(); sketch.draw(p,27300);
        };
      }, preview);
    });
    preview.classList.add('blog-preview');
    continue;
  }
  if (experiment.preview !== 'mirror-logo') continue;
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.domElement.setAttribute('aria-hidden', 'true');
  preview.append(renderer.domElement);
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#eeefed');
  const geometry = makeLogoGeometry(4, .25);
  const material = new THREE.MeshStandardMaterial({ color: '#b6bbc3', roughness: 1, metalness: 0 });
  scene.add(new THREE.Mesh(geometry, material));
  scene.add(new THREE.HemisphereLight('#ffffff', '#727b8c', 2.3));
  const light = new THREE.DirectionalLight('#ffffff', 2.5); light.position.set(-20,30,45); scene.add(light);
  const camera = new THREE.OrthographicCamera(-27,27,20,-20,.1,200);
  camera.position.set(-24,18,55); camera.lookAt(0,0,0);
  const observer = new ResizeObserver(() => {
    const { width, height } = preview.getBoundingClientRect();
    if (!width || !height) return;
    const aspect = width / height, halfHeight = Math.max(19,25/aspect);
    camera.left = -halfHeight*aspect; camera.right = halfHeight*aspect;
    camera.top = halfHeight; camera.bottom = -halfHeight; camera.updateProjectionMatrix();
    renderer.setSize(width,height); renderer.render(scene,camera);
  });
  observer.observe(preview);
  cleanups.push(() => { observer.disconnect(); geometry.dispose(); material.dispose(); renderer.dispose(); });
}
if (import.meta.hot) import.meta.hot.dispose(() => cleanups.forEach(cleanup => cleanup()));
