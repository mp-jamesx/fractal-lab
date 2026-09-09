import React, { useEffect, useRef, useState } from 'react';
import './experiments.css';
import '../experiments/src/home.css';
import '../experiments/src/style.css';
import '../experiments/src/blog/gallery.css';
import '../experiments/src/editorial/gallery.css';
import '../experiments/src/single.css';
const routes = {
  '/experiments': ['home', () => import('../experiments/src/home.js')],
  '/experiments/001-3d-m-logo': ['sculptures', () => import('../experiments/src/gallery.js')],
  '/experiments/002-blog-thumbnails': ['blog', () => import('../experiments/src/blog/gallery.js')],
  '/experiments/003-editorial-thumbnails': ['editorial', () => import('../experiments/src/editorial/gallery.js')],
  '/experiments/original': ['original', () => import('../experiments/src/single.js')],
};
export function Experiments({route}) {
  const host = useRef(null);
  const [error,setError] = useState(false);
  const entry = routes[route];
  useEffect(() => {
    if (!entry) return;
    let cancelled = false, dispose;
    const element = host.current;
    window.scrollTo(0, 0);
    setError(false);
    entry[1]().then(module => {
      if (!cancelled) dispose = module.mount(element);
    }).catch(error => { if (!cancelled) { console.error(error); setError(true); } });
    return () => { cancelled = true; dispose?.(); element.replaceChildren(); document.body.style.overflow = ''; };
  }, [route]);
  if (!entry) return <main><nav className="breadcrumb"><a href="#/experiments">All experiments</a></nav><p>Experiment not found.</p></main>;
  return <main className="experiments-section" aria-label="Experiments">
    {error && <p role="alert">This experiment couldn’t load. Return to <a href="#/experiments">All experiments</a> or reload to try again.</p>}
    <div ref={host} className={`experiment-view experiment-${entry[0]}`}/>
  </main>;
}
