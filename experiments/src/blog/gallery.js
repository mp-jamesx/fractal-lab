import { breadcrumbs } from '../breadcrumbs.js';
import p5 from 'p5';
import run01Briefs from './briefs.json';
import run02Briefs from './run02/briefs.json';
import run03Briefs from './run03/briefs.json';

export function mount(app) {
  const modules = import.meta.glob(['./sketches/sketch*.js', './run02/sketches/sketch*.js', './run03/sketches/sketch*.js'], { eager: true });
  const runs = [
    { id: '03', name: 'Futuristic and lines', briefs: run03Briefs, prefix: './run03/sketches/' },
    { id: '02', name: 'Line drawings', briefs: run02Briefs, prefix: './run02/sketches/' },
    { id: '01', name: 'Initial explorations', briefs: run01Briefs, prefix: './sketches/' },
  ];
  document.title = 'Blog thumbnails — 002';

  app.setAttribute('aria-label', 'Blog thumbnail experiments');
  app.innerHTML = `${breadcrumbs("Blog thumbnails")}<div class="runs"></div><dialog aria-labelledby="detail-title"><div class="dialog-bar"><span class="detail-number"></span><button class="close" aria-label="Close thumbnail">Close ×</button></div><div class="detail-layout"><div class="full-image"></div><aside><h2 id="detail-title"></h2><p class="description"></p><div class="recipe"></div><p class="dimensions">1200 × 675</p></aside></div></dialog>`;
  const runsContainer = app.querySelector('.runs');
  const dialog = app.querySelector('dialog');
  const instances = [];
  const motionUpdates = [];
  const observers = [];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let disposed = false;
  const updateMotion = () => { if (!disposed) motionUpdates.forEach(update => update()); };
  reducedMotion.addEventListener('change', updateMotion);
  let activeCanvas = null;
  function restoreCanvas() {
    if (activeCanvas) { activeCanvas.stage.append(activeCanvas.canvas); activeCanvas = null; }
  }

  for (const run of runs) {
    const section = document.createElement('section');
    section.className = 'run'; section.id = `run-${run.id}`;
    section.setAttribute('aria-labelledby', `run-title-${run.id}`);
    section.innerHTML = `<h2 class="run-heading" id="run-title-${run.id}">Run ${run.id}<span>${run.name}</span></h2><div class="thumbnail-grid" aria-label="Run ${run.id} thumbnails"></div>`;
    runsContainer.append(section);
    const grid = section.querySelector('.thumbnail-grid');
    for (const brief of run.briefs) {
      const mod = modules[`${run.prefix}sketch${String(brief.id).padStart(2,'0')}.js`];
      if (!mod) continue;
      const card = document.createElement('article');
      card.innerHTML = `<button class="thumbnail" aria-label="Open ${mod.title}"><span class="loading">Rendering…</span></button><button class="caption"><span>${mod.title}</span><span class="number">${String(brief.id).padStart(2,'0')}</span></button><div class="sources">Palette ${brief.palette.source}<span>Structure ${brief.structure.source}</span><span>Signal ${brief.signal.source}</span></div>`;
      grid.append(card);
      const stage = card.querySelector('.thumbnail');
      let canvas, visible = true;
      const instance = new p5(p => {
        p.setup = () => {
          if (disposed) return;
          canvas = p.createCanvas(1200,675).elt;
          p.pixelDensity(1);
          p.frameRate(24);
          canvas.setAttribute('aria-hidden','true');
          p.randomSeed(brief.seed); p.noiseSeed(brief.seed);
          if (!mod.animate) p.noLoop();
          try { mod.draw(p, brief.seed); card.querySelector('.loading').remove(); }
          catch (error) { card.querySelector('.loading').textContent = 'Unable to render this sketch'; console.error(mod.title, error); }
        };
        if (mod.animate) p.draw = () => mod.animate(p, brief.seed);
      }, stage);
      instances.push(instance);
      if (mod.animate) {
        const sync = () => {
          const shouldAnimate = !reducedMotion.matches && (activeCanvas?.canvas === canvas || (visible && !dialog.open));
          if (shouldAnimate) instance.loop(); else instance.noLoop();
        };
        motionUpdates.push(sync);
        const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); });
        observer.observe(stage); observers.push(observer);
      }
      function open() {
        if (!canvas) return;
        restoreCanvas();
        activeCanvas = { canvas, stage };
        app.querySelector('.full-image').append(canvas);
        app.querySelector('.detail-number').textContent = `RUN ${run.id} · THUMBNAIL ${String(brief.id).padStart(2,'0')} / 10`;
        app.querySelector('#detail-title').textContent = mod.title;
        app.querySelector('.description').textContent = mod.description;
        app.querySelector('.recipe').innerHTML = ['palette','structure','signal'].map(cat => `<div><h3>${cat}<span>REF ${brief[cat].source}</span></h3><p>${brief[cat].tags.join(' · ')}</p></div>`).join('');
        dialog.showModal(); document.body.style.overflow = 'hidden'; updateMotion();
      }
      stage.addEventListener('click',open); card.querySelector('.caption').addEventListener('click',open);
    }
  }
  app.querySelector('.close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => { restoreCanvas(); document.body.style.overflow = ''; updateMotion(); });
  return () => { disposed = true; observers.forEach(observer => observer.disconnect()); reducedMotion.removeEventListener('change', updateMotion); dialog.close(); instances.forEach(instance => instance.remove()); };
}
