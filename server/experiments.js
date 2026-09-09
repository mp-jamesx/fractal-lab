import { createReadStream } from 'node:fs';
import { realpath, stat } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';

// Serve only the experiment build, never its source or neighboring workspace files.
export function createExperimentsFiles(directory) {
  return async (req,res,next) => {
    let pathname;
    try {pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{return next();}
    if(!pathname.startsWith('/lab-experiments/'))return next();
    if(!['GET','HEAD'].includes(req.method)){res.statusCode=405;return res.end();}
    try {
      const base=await realpath(directory);
      const relative=pathname.slice('/lab-experiments/'.length);
      const requested=resolve(base,relative||'index.html');
      if(!requested.startsWith(base+sep)){res.statusCode=403;return res.end();}
      const target=await realpath(extname(relative)?requested:resolve(base,'index.html'));
      if(!target.startsWith(base+sep)||!(await stat(target)).isFile()){res.statusCode=404;return res.end();}
      const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.ttf':'font/ttf','.woff2':'font/woff2'};
      res.setHeader('Content-Type',mime[extname(target)]||'application/octet-stream');
      res.setHeader('Cache-Control','no-cache');
      res.setHeader('X-Content-Type-Options','nosniff');
      if(req.method==='HEAD')return res.end();
      createReadStream(target).on('error',()=>res.destroy()).pipe(res);
    }catch{res.statusCode=404;res.end('Experiments are not built yet. Run npm run build:experiments in the Fractal Lab project.');}
  };
}
