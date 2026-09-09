import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, symlink, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer } from 'node:http';
import { createExperimentsFiles } from './experiments.js';

test('experiment build supports nested routes and restricts file serving to the build', async t => {
  const root=await mkdtemp(join(tmpdir(),'fractal-lab-'));
  const build=join(root,'dist-lab');await mkdir(join(build,'assets'),{recursive:true});
  await writeFile(join(build,'index.html'),'<h1>Experiments</h1>');
  await writeFile(join(build,'assets','app.js'),'export const live = true;');
  await writeFile(join(root,'private.txt'),'not public');
  await symlink(join(root,'private.txt'),join(build,'assets','escape.txt'));
  const middleware=createExperimentsFiles(build);
  const server=createServer((req,res)=>middleware(req,res,()=>{res.statusCode=404;res.end();}));
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  t.after(async()=>{server.closeAllConnections();await new Promise(resolve=>server.close(resolve));await rm(root,{recursive:true,force:true});});
  const base=`http://127.0.0.1:${server.address().port}`;
  for(const path of ['/lab-experiments/','/lab-experiments/experiments/003-editorial-thumbnails']){
    const response=await fetch(base+path);assert.equal(response.status,200);assert.equal(await response.text(),'<h1>Experiments</h1>');
  }
  const asset=await fetch(base+'/lab-experiments/assets/app.js');assert.match(asset.headers.get('content-type'),/javascript/);assert.match(await asset.text(),/live/);
  for(const path of ['/lab-experiments/assets/missing.js','/lab-experiments/assets/escape.txt','/lab-experiments/%2e%2e/private.txt'])assert.equal((await fetch(base+path)).status,404);
  const head=await fetch(base+'/lab-experiments/',{method:'HEAD'});assert.equal(head.status,200);assert.equal(await head.text(),'');
  assert.equal((await fetch(base+'/lab-experiments/',{method:'POST'})).status,405);
});
