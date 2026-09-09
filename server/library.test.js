import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdtemp, writeFile, readFile, stat, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createLibraryAPI } from './library.js';
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a0p8AAAAASUVORK5CYII=','base64');
async function fixture(t) {
  const root=await mkdtemp(join(tmpdir(),'moodboard-api-'));
  await writeFile(join(root,'catalog.json'),JSON.stringify({version:1,boards:[],references:[]}));
  const api=createLibraryAPI(root);const server=createServer((req,res)=>api(req,res,()=>{res.statusCode=404;res.end();}));
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const base=`http://127.0.0.1:${server.address().port}`;
  t.after(async()=>{server.closeAllConnections();await new Promise(resolve=>server.close(resolve));await rm(root,{recursive:true,force:true});});
  const post=async(path,body,headers={})=>{const response=await fetch(base+path,{method:'POST',headers:{'X-Moodboard-Request':'1',...headers},body});return {status:response.status,...await response.json()};};
  const board=name=>post('/api/boards',JSON.stringify({name}));
  return {root,post,board};
}
test('Creates local folders, preserves names, and resolves duplicate names safely',async t=>{
  const f=await fixture(t);const a=await f.board('Mirror branding'),b=await f.board('Mirror branding'),c=await f.board('../../ Design / ideas');
  assert.equal(a.status,201);assert.equal(a.board.id,'mirror-branding');assert.equal(b.board.id,'mirror-branding-2');assert.equal(c.board.name,'../../ Design / ideas');
  assert((await stat(join(f.root,'images',c.board.id))).isDirectory());
  assert.equal((await f.board(' ')).status,400);
});
test('Concurrent uploads preserve original bytes and every catalog entry without filename collisions',async t=>{
  const f=await fixture(t);const a=await f.board('Test');
  const results=await Promise.all(Array.from({length:5},()=>f.post(`/api/boards/${a.board.id}/images`,png,{'X-File-Name':'same.png'})));
  assert(results.every(r=>r.status===201));
  const data=JSON.parse(await readFile(join(f.root,'catalog.json'),'utf8'));
  assert.equal(data.references.length,5);assert.equal(new Set(data.references.map(r=>r.path)).size,5);
  for(const r of data.references)assert.deepEqual(await readFile(join(f.root,r.path)),png);
});
test('Rejects foreign origins, unsupported images, missing boards, oversized uploads, and symlink destinations',async t=>{
  const f=await fixture(t);await f.board('Test');
  assert.equal((await f.post('/api/boards',JSON.stringify({name:'Bad'}),{Origin:'https://example.com'})).status,403);
  assert.equal((await f.post('/api/boards/test/images',Buffer.from('<svg/>'))).status,400);
  assert.equal((await f.post('/api/boards/missing/images',png)).status,404);
  assert.equal((await f.post('/api/boards/test/images',Buffer.alloc(50*1024*1024+1))).status,413);
  await rm(join(f.root,'images/test'),{recursive:true});await symlink(tmpdir(),join(f.root,'images/test'));
  assert.equal((await f.post('/api/boards/test/images',png)).status,400);
  assert.equal(JSON.parse(await readFile(join(f.root,'catalog.json'),'utf8')).references.length,0);
});

test('Folder tag maps are initialized, preserve edits on upload, and drive the rendered catalog',async t=>{
  const {hydrateTags}=await import('./tags.js');
  const f=await fixture(t);const created=await f.board('Tagged board');
  const path=join(f.root,'images',created.board.id,'tags.json');
  assert.deepEqual(JSON.parse(await readFile(path,'utf8')),{});
  const first=await f.post(`/api/boards/${created.board.id}/images`,png);
  const filename=first.reference.path.split('/').at(-1);
  assert.deepEqual(JSON.parse(await readFile(path,'utf8')),{[filename]:[]});
  await writeFile(path,JSON.stringify({[filename]:['organic forms','orange']}));
  const second=await f.post(`/api/boards/${created.board.id}/images`,png);
  assert.equal(second.status,201);
  assert.deepEqual(second.catalog.references[0].tags,['organic forms','orange']);
  assert.deepEqual(second.catalog.references[1].tags,[]);
  const stored=JSON.parse(await readFile(join(f.root,'catalog.json'),'utf8'));
  assert.equal(stored.references[0].tags,undefined);
  await writeFile(path,JSON.stringify({[filename]:['updated by agent']}));
  assert.deepEqual((await hydrateTags(f.root,stored)).references[0].tags,['updated by agent']);
  await writeFile(path,'invalid json');
  await assert.rejects(()=>hydrateTags(f.root,stored),/Cannot read/);
  assert.equal((await f.post(`/api/boards/${created.board.id}/images`,png)).status,500);
  assert.equal(await readFile(path,'utf8'),'invalid json');
});


test('Fresh clones initialize an empty library without overwriting existing local data',async t=>{
  const root=await mkdtemp(join(tmpdir(),'moodboard-empty-'));
  t.after(()=>rm(root,{recursive:true,force:true}));
  createLibraryAPI(root);
  assert.deepEqual(JSON.parse(await readFile(join(root,'catalog.json'),'utf8')),{version:1,boards:[],references:[]});
  assert((await stat(join(root,'images/inbox'))).isDirectory());
  const content=JSON.stringify({version:1,boards:[{id:'personal',name:'Personal'}],references:[]});
  await writeFile(join(root,'catalog.json'),content);
  createLibraryAPI(root);
  assert.equal(await readFile(join(root,'catalog.json'),'utf8'),content);
});
