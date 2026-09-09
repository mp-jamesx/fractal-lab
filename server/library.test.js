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

test('Deleting an image removes bytes, shared references, and only its tag entry',async t=>{
  const f=await fixture(t);await f.board('One');await f.board('Two');
  const first=await f.post('/api/boards/one/images',png);const second=await f.post('/api/boards/one/images',png);
  const catalogPath=join(f.root,'catalog.json'),tagsPath=join(f.root,'images/one/tags.json');
  const data=JSON.parse(await readFile(catalogPath,'utf8'));data.references[0].boards.push('two');
  await writeFile(catalogPath,JSON.stringify(data));
  await writeFile(tagsPath,JSON.stringify({[first.reference.path.split('/').at(-1)]:['palette: blue'],[second.reference.path.split('/').at(-1)]:['keep']}));
  const result=await f.post('/api/boards/two/images/delete',JSON.stringify({path:first.reference.path}));
  assert.equal(result.status,200);assert.equal(result.catalog.references.length,1);
  assert.deepEqual(result.catalog.references[0].tags,['keep']);
  await assert.rejects(readFile(join(f.root,first.reference.path)),{code:'ENOENT'});
  assert.deepEqual(await readFile(join(f.root,second.reference.path)),png);
  assert.deepEqual(JSON.parse(await readFile(tagsPath,'utf8')),{[second.reference.path.split('/').at(-1)]:['keep']});
  assert.equal((await f.post('/api/boards/two/images/delete',JSON.stringify({path:first.reference.path}))).status,404);
});

test('Deletion rejects foreign origins, paths outside the board, traversal, and symlink images',async t=>{
  const f=await fixture(t);await f.board('One');await f.board('Two');
  const upload=await f.post('/api/boards/one/images',png);const path=upload.reference.path;
  assert.equal((await f.post('/api/boards/one/images/delete',JSON.stringify({path}),{Origin:'https://evil.example'})).status,403);
  assert.equal((await f.post('/api/boards/two/images/delete',JSON.stringify({path}))).status,404);
  for(const path of ['../catalog.json','images/one/../../outside.png','images/one/tags.json','/tmp/outside.png'])assert.equal((await f.post('/api/boards/one/images/delete',JSON.stringify({path}))).status,400);
  const external=join(f.root,'external.png');await writeFile(external,png);await rm(join(f.root,path));await symlink(external,join(f.root,path));
  assert.equal((await f.post('/api/boards/one/images/delete',JSON.stringify({path}))).status,400);
  assert.deepEqual(await readFile(external),png);
  assert.equal(JSON.parse(await readFile(join(f.root,'catalog.json'),'utf8')).references.length,1);
});

test('Failed file deletion restores metadata; malformed tags leave original bytes untouched',async t=>{
  const {mkdir}=await import('node:fs/promises');
  const f=await fixture(t);await f.board('One');const upload=await f.post('/api/boards/one/images',png);const path=upload.reference.path;
  const tagsPath=join(f.root,'images/one/tags.json');
  await writeFile(tagsPath,'broken');
  assert.equal((await f.post('/api/boards/one/images/delete',JSON.stringify({path}))).status,500);
  assert.deepEqual(await readFile(join(f.root,path)),png);
  const tags={[path.split('/').at(-1)]:['keep']};await writeFile(tagsPath,JSON.stringify(tags));
  await rm(join(f.root,path));await mkdir(join(f.root,path));
  assert.equal((await f.post('/api/boards/one/images/delete',JSON.stringify({path}))).status,500);
  assert.equal(JSON.parse(await readFile(join(f.root,'catalog.json'),'utf8')).references[0].path,path);
  assert.deepEqual(JSON.parse(await readFile(tagsPath,'utf8')),tags);
});

test('Concurrent deletion and upload preserve surviving records and files',async t=>{
  const f=await fixture(t);await f.board('One');const uploads=await Promise.all(Array.from({length:3},()=>f.post('/api/boards/one/images',png)));
  const results=await Promise.all([...uploads.map(u=>f.post('/api/boards/one/images/delete',JSON.stringify({path:u.reference.path}))),f.post('/api/boards/one/images',png)]);
  assert.deepEqual(results.map(r=>r.status),[200,200,200,201]);
  const data=JSON.parse(await readFile(join(f.root,'catalog.json'),'utf8'));assert.equal(data.references.length,1);
  assert.deepEqual(await readFile(join(f.root,data.references[0].path)),png);
  for(const u of uploads)await assert.rejects(readFile(join(f.root,u.reference.path)),{code:'ENOENT'});
});

test('Copies selections from several boards into independent files with metadata and tags',async t=>{
  const f=await fixture(t);for(const name of ['A','B','C'])await f.board(name);
  const a=await f.post('/api/boards/a/images',png,{'X-File-Name':'first.png'}),b=await f.post('/api/boards/b/images',png);
  await writeFile(join(f.root,'images/a/tags.json'),JSON.stringify({[a.reference.path.split('/').at(-1)]:['palette: blue']}));
  const result=await f.post('/api/boards/c/images/transfer',JSON.stringify({mode:'copy',items:[{path:a.reference.path,sourceBoards:['a']},{path:b.reference.path,sourceBoards:['b']}]}));
  assert.equal(result.status,200);assert.equal(result.count,2);assert.equal(result.catalog.references.length,4);
  assert.equal(result.added.length,2);assert.equal(result.moved.length,0);
  for(const path of [a.reference.path,b.reference.path,...result.added])assert.deepEqual(await readFile(join(f.root,path)),png);
  assert.deepEqual(result.catalog.references.find(r=>r.path===result.added[0]).tags,['palette: blue']);
  assert.deepEqual(result.catalog.references.find(r=>r.path===result.added[0]).boards,['c']);
  await f.post('/api/boards/c/images/delete',JSON.stringify({path:result.added[0]}));
  assert.deepEqual(await readFile(join(f.root,a.reference.path)),png);
});

test('Cut moves originals and tags while preserving memberships not selected as sources',async t=>{
  const f=await fixture(t);for(const name of ['A','B','C','D'])await f.board(name);
  const a=await f.post('/api/boards/a/images',png),b=await f.post('/api/boards/b/images',png);
  const data=JSON.parse(await readFile(join(f.root,'catalog.json'),'utf8'));data.references[0].boards.push('d');await writeFile(join(f.root,'catalog.json'),JSON.stringify(data));
  const result=await f.post('/api/boards/c/images/transfer',JSON.stringify({mode:'cut',items:[{path:a.reference.path,sourceBoards:['a']},{path:b.reference.path,sourceBoards:['b']}]}));
  assert.equal(result.status,200);assert.equal(result.catalog.references.length,2);assert.equal(result.moved.length,2);
  assert.deepEqual(result.catalog.references[0].boards,['d','c']);assert.deepEqual(result.catalog.references[1].boards,['c']);
  for(const move of result.moved){await assert.rejects(readFile(join(f.root,move.from)),{code:'ENOENT'});assert.deepEqual(await readFile(join(f.root,move.to)),png);}
  assert.deepEqual(JSON.parse(await readFile(join(f.root,'images/a/tags.json'),'utf8')),{});
  const same=await f.post('/api/boards/c/images/transfer',JSON.stringify({mode:'cut',items:[{path:result.moved[0].to,sourceBoards:['c']}]}));
  assert.equal(same.status,200);assert.equal(same.moved[0].from,same.moved[0].to);assert.equal(same.catalog.references.length,2);
});

test('Transfers validate the entire selection before moving any file',async t=>{
  const f=await fixture(t);await f.board('A');await f.board('B');const a=await f.post('/api/boards/a/images',png);
  const item={path:a.reference.path,sourceBoards:['a']};
  for(const items of [[item,{path:'images/a/missing.png',sourceBoards:['a']}],[item,item],[{...item,sourceBoards:['b']}]]){
    const result=await f.post('/api/boards/b/images/transfer',JSON.stringify({mode:'cut',items}));assert(result.status>=400);
    assert.deepEqual(await readFile(join(f.root,a.reference.path)),png);assert.equal(JSON.parse(await readFile(join(f.root,'catalog.json'),'utf8')).references[0].path,a.reference.path);
  }
  const result=await f.post('/api/boards/b/images/transfer',JSON.stringify({mode:'copy',items:[item]}),{Origin:'https://evil.example'});assert.equal(result.status,403);
});
