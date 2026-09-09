const experimentPath = '/' + location.pathname.slice(import.meta.env.BASE_URL.length).replace(/\/$/, '');
// Keep each import in its own loader so production CSS dependencies follow the route.
const loaders = {
  original: () => import('./single.js'),
  '/experiments/001-3d-m-logo': () => import('./gallery.js'),
  '/experiments/002-blog-thumbnails': () => import('./blog/gallery.js'),
  '/experiments/003-editorial-thumbnails': () => import('./editorial/gallery.js'),
  home: () => import('./home.js'),
};
const key = new URLSearchParams(location.search).get('view') === 'original' ? 'original' : experimentPath;
(loaders[key] || loaders.home)();
