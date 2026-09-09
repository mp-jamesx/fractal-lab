import { breadcrumbs } from './breadcrumbs.js';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import briefs from './briefs.json';

export function mount(app) {
  const modules = import.meta.glob('./pieces/piece*.js', { eager: true });

  document.title = '3D M logo — 001';
  app.setAttribute('aria-label', 'Mirror Physics experimental art gallery');
  app.innerHTML = `
    ${breadcrumbs("3D M logo")}
    <section class="gallery" aria-label="Nine 3D art studies"></section>
    <dialog class="detail"><div class="detail-top"><span class="detail-number"></span><button class="close" aria-label="Close study">Close ×</button></div><div class="detail-layout"><div class="detail-viewport" aria-label="Interactive expanded 3D study"></div><aside><p class="eyebrow">FORM STUDY</p><h2></h2><p class="description"></p><div class="recipe"></div><p class="gesture">Drag to orbit · Scroll to zoom</p><button class="reset">Reset view</button></aside></div></dialog>`;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.domElement.className = 'art-canvas';
  renderer.domElement.setAttribute('aria-hidden', 'true');
  app.prepend(renderer.domElement);
  const gallery = app.querySelector('.gallery');
  const dialog = app.querySelector('dialog');
  const detailViewport = app.querySelector('.detail-viewport');
  const studies = [];
  let selected = null;
  let detailCamera, detailControls;
  let dirty = true;

  for (const brief of briefs) {
    const key = `./pieces/piece${String(brief.id).padStart(2, '0')}.js`;
    const mod = modules[key];
    if (!mod) continue;
    const piece = mod.createPiece();
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(piece.background || '#eceae5');
    scene.add(piece.group);
    scene.add(new THREE.HemisphereLight('#ffffff', '#788296', 2.3));
    const light = new THREE.DirectionalLight('#ffffff', 2.5);
    light.position.set(-25, 35, 50); scene.add(light);
    const fill = new THREE.DirectionalLight('#ffffff', 0.7);
    fill.position.set(25, -10, -20); scene.add(fill);
    const box = new THREE.Box3().setFromObject(piece.group);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    piece.group.position.sub(center);
    const radius = Math.max(size.length() / 2, 1);
    const camera = new THREE.OrthographicCamera(-25, 25, 25, -25, 0.1, 2000);
    const direction = new THREE.Vector3().fromArray(piece.camera || [-22, 18, 65]);
    if (Math.abs(direction.x) < direction.z * 0.3) direction.x = -direction.z * 0.34;
    if (Math.abs(direction.y) < direction.z * 0.2) direction.y = direction.z * 0.24;
    camera.position.copy(direction).normalize().multiplyScalar(radius * 4);
    camera.lookAt(0,0,0);
    const card = document.createElement('article');
    card.className = 'study';
    card.innerHTML = `<div class="viewport" role="img" aria-label="${mod.title}: interactive 3D logo sculpture"><span class="study-index">${String(brief.id).padStart(2,'0')}</span></div><button class="study-title"><span>${mod.title}</span><span aria-hidden="true">↗</span></button><div class="provenance"><span>Palette <b>${brief.palette.source}</b></span><span>Structure <b>${brief.structure.source}</b></span><span>Signal <b>${brief.signal.source}</b></span></div>`;
    gallery.appendChild(card);
    const viewport = card.querySelector('.viewport');
    const controls = new OrbitControls(camera, viewport);
    controls.enablePan = false; controls.enableZoom = false;
    controls.update(); controls.saveState();
    controls.addEventListener('change', () => { dirty = true; });
    const study = { ...piece, brief, mod, scene, camera, controls, viewport, radius };
    studies.push(study);
    card.querySelector('button').addEventListener('click', () => openStudy(study));
  }

  function openStudy(study) {
    selected = study;
    app.querySelector('.detail-number').textContent = `STUDY ${String(study.brief.id).padStart(2,'0')} / 09`;
    app.querySelector('h2').textContent = study.mod.title;
    app.querySelector('.description').textContent = study.mod.description;
    app.querySelector('.recipe').innerHTML = ['palette','structure','signal'].map(cat => `<div class="recipe-category"><h3>${cat}<span>REF ${study.brief[cat].source}</span></h3><p>${study.brief[cat].tags.join(' · ')}</p></div>`).join('');
    detailCamera = study.camera.clone();
    detailControls?.dispose();
    detailControls = new OrbitControls(detailCamera, detailViewport);
    detailControls.enablePan = false; detailControls.minZoom = 0.5; detailControls.maxZoom = 3;
    detailControls.update(); detailControls.saveState();
    detailControls.addEventListener('change', () => { dirty = true; });
    dialog.prepend(renderer.domElement);
    dialog.showModal();
    app.classList.add('detail-open');
    document.body.style.overflow = 'hidden';
    dirty = true;
  }
  app.querySelector('.close').addEventListener('click', () => dialog.close());
  app.querySelector('.reset').addEventListener('click', () => { detailControls?.reset(); dirty = true; });
  dialog.addEventListener('close', () => { selected = null; detailControls?.dispose(); detailControls = null; app.classList.remove('detail-open'); app.prepend(renderer.domElement); document.body.style.overflow = ''; dirty = true; });

  // One WebGL context renders all nine tiles, even on devices with low context limits.
  function draw(study, camera, element) {
    const rect = element.getBoundingClientRect();
    if (rect.bottom <= 0 || rect.top >= innerHeight || rect.width === 0) return;
    const aspect = rect.width / rect.height;
    const halfHeight = study.radius * 1.04 / Math.min(aspect, 1);
    camera.left = -halfHeight * aspect; camera.right = halfHeight * aspect;
    camera.top = halfHeight; camera.bottom = -halfHeight;
    camera.updateProjectionMatrix();
    renderer.setViewport(rect.left, innerHeight - rect.bottom, rect.width, rect.height);
    renderer.setScissor(rect.left, Math.max(0, innerHeight - rect.bottom), rect.width, Math.min(rect.bottom, innerHeight) - Math.max(rect.top, 0));
    renderer.render(study.scene, camera);
  }
  function render() {
    if (dirty) {
      dirty = false;
      renderer.setScissorTest(false);
      renderer.setClearColor('#f4f3ef', 0);
      renderer.clear();
      renderer.setScissorTest(true);
      if (selected) draw(selected, detailCamera, detailViewport);
      else studies.forEach(study => draw(study, study.camera, study.viewport));
    }
    frame = requestAnimationFrame(render);
  }
  function resize() { renderer.setSize(innerWidth, innerHeight); dirty = true; }
  window.addEventListener('resize', resize);
  window.addEventListener('scroll', markDirty, { passive: true });
  function markDirty() { dirty = true; }
  const observer = new ResizeObserver(markDirty); observer.observe(app);
  resize();
  let frame = requestAnimationFrame(render);
  return () => {
    cancelAnimationFrame(frame); observer.disconnect();
    window.removeEventListener('resize', resize); window.removeEventListener('scroll', markDirty);
    studies.forEach(study => {
      study.controls.dispose();
      study.scene.traverse(obj => { obj.geometry?.dispose(); if (obj.material) (Array.isArray(obj.material) ? obj.material : [obj.material]).forEach(m => m.dispose()); });
    });
    detailControls?.dispose(); dialog.close(); renderer.dispose(); renderer.domElement.remove(); document.body.style.overflow = '';
  };
}
