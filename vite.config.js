import { hydrateTags } from './server/tags.js';
import { createLibraryAPI } from './server/library.js';
import { defineConfig } from 'vite';
import { createReadStream } from 'node:fs';
import { stat, realpath, readFile } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';
const root = import.meta.dirname;
// Keep large originals outside build output and Git; serve them directly on loopback.
const libraryAPI = createLibraryAPI(root);
function libraryFiles(server) {
  server.middlewares.use(libraryAPI);
  server.middlewares.use(async (req, res, next) => {
    let path;
    try { path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); } catch { return next(); }
    if (path !== '/catalog.json' && !path.startsWith('/images/')) return next();
    try {
      if(path==='/catalog.json') {
        const data=await hydrateTags(root,JSON.parse(await readFile(resolve(root,'catalog.json'),'utf8')));
        res.setHeader('Content-Type','application/json');res.setHeader('Cache-Control','no-store');return res.end(JSON.stringify(data));
      }
      const target = await realpath(resolve(root, '.' + path));
      if (!(target === resolve(root, 'catalog.json') || target.startsWith(resolve(root, 'images') + sep))) {res.statusCode = 403; return res.end();}
      if (!(await stat(target)).isFile()) {res.statusCode = 404; return res.end();}
      const mime = {'.json':'application/json', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.webp':'image/webp', '.gif':'image/gif', '.avif':'image/avif', '.svg':'image/svg+xml'};
      res.setHeader('Content-Type', mime[extname(target).toLowerCase()] || 'application/octet-stream');
      res.setHeader('Cache-Control', 'no-cache');
      createReadStream(target).on('error', () => res.destroy()).pipe(res);
    } catch {res.statusCode = path==='/catalog.json'?500:404; res.end(path==='/catalog.json'?'Check the catalog and folder tags.json files.':'Not found');}
  });
}
export default defineConfig({publicDir:false,plugins:[{name:'local-library',configureServer:libraryFiles,configurePreviewServer:libraryFiles}]});
