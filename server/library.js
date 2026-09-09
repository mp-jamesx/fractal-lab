import { readTags, writeJSON, hydrateTags } from './tags.js';
import { realpathSync, mkdirSync, writeFileSync } from 'node:fs';
import { readFile, writeFile, rename, mkdir, realpath, unlink, rmdir } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { randomUUID } from 'node:crypto';
const MAX_IMAGE = 50 * 1024 * 1024;
const fail = (message, status = 400) => Object.assign(new Error(message), {status});
async function body(req, limit) {
  if (Number(req.headers['content-length']) > limit) throw fail('Image exceeds the 50 MB limit.', 413);
  const chunks = []; let length = 0;
  for await (const chunk of req) {length += chunk.length; if(length > limit) throw fail('Upload is too large.', 413); chunks.push(chunk);}
  return Buffer.concat(chunks);
}
function extension(bytes) {
  if(bytes.length > 8 && bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) return 'png';
  if(bytes.length > 3 && bytes[0]===255 && bytes[1]===216 && bytes[2]===255) return 'jpg';
  if(['GIF87a','GIF89a'].includes(bytes.subarray(0,6).toString())) return 'gif';
  if(bytes.subarray(0,4).toString()==='RIFF' && bytes.subarray(8,12).toString()==='WEBP') return 'webp';
  if(bytes.subarray(4,8).toString()==='ftyp' && /avif|avis/.test(bytes.subarray(8,32).toString())) return 'avif';
  throw fail('Use a PNG, JPEG, WebP, GIF, or AVIF image.');
}
export function createLibraryAPI(root) {
  root = realpathSync(root);
  const catalogPath = resolve(root,'catalog.json');
  // A clone starts empty; exclusive creation never replaces an existing library.
  mkdirSync(resolve(root,'images','inbox'),{recursive:true});
  try {writeFileSync(catalogPath,JSON.stringify({version:1,boards:[],references:[]},null,2)+'\n',{flag:'wx'});}
  catch(error){if(error.code!=='EEXIST')throw error;}

  let queue = Promise.resolve();
  const serial = action => {const result=queue.then(action); queue=result.catch(()=>{});return result;};
  async function save(data) {
    const temp = `${catalogPath}.${randomUUID()}.tmp`;
    try {await writeFile(temp,JSON.stringify(data,null,2)+'\n');await rename(temp,catalogPath);}
    finally {await unlink(temp).catch(()=>{});}
  }
  async function imageRoot() {
    await mkdir(resolve(root,'images'),{recursive:true});
    const target = await realpath(resolve(root,'images'));
    if(target !== resolve(root,'images')) throw fail('The images folder must be local to this library.',400);
    return target;
  }
  return async (req,res,next) => {
    const path = new URL(req.url,'http://localhost').pathname;
    if(!path.startsWith('/api/')) return next();
    const respond = (status,value) => {res.statusCode=status;res.setHeader('Content-Type','application/json');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify(value));};
    try {
      if(req.method!=='POST') throw fail('Method not allowed.',405);
      // Custom header plus same-origin enforcement prevents other websites writing to the library.
      if(req.headers['x-moodboard-request']!=='1') throw fail('Invalid local request.',403);
      if(!/^(127\.0\.0\.1|localhost)(:\d+)?$/.test(req.headers.host || '')) throw fail('Local access only.',403);
      if(req.headers.origin && req.headers.origin !== `http://${req.headers.host}`) throw fail('Invalid origin.',403);
      if(path==='/api/boards') {
        let input;try {input=JSON.parse((await body(req,4096)).toString());}catch(e){if(e.status) throw e;throw fail('Invalid board details.');}
        const name=typeof input.name==='string'?input.name.trim():'';
        if(!name || name.length>120) throw fail('Enter a moodboard name of 1–120 characters.');
        const result = await serial(async()=>{
          const data=JSON.parse(await readFile(catalogPath,'utf8'));
          const base=name.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,64) || 'moodboard';
          const images=await imageRoot();
          let id=base, suffix=2;
          for(;;) {
            if((data.boards||[]).some(b=>b.id===id)){id=`${base}-${suffix++}`;continue;}
            try {await mkdir(resolve(images,id));break;}catch(e){if(e.code!=='EEXIST')throw e;id=`${base}-${suffix++}`;}
          }
          const board={id,name,description:''};data.boards??=[];data.boards.push(board);
          try {await writeJSON(resolve(images,id,'tags.json'),{});await save(data);}catch(error){await unlink(resolve(images,id,'tags.json')).catch(()=>{});await rmdir(resolve(images,id));throw error;}return {board,catalog:await hydrateTags(root,data)};
        });
        return respond(201,result);
      }
      const match=path.match(/^\/api\/boards\/([a-z0-9-]+)\/images$/);
      if(!match) throw fail('Not found.',404);
      const bytes=await body(req,MAX_IMAGE);const ext=extension(bytes);
      let title='Image';try {title=decodeURIComponent(req.headers['x-file-name']||'Image').replace(/\.[^.]+$/,'').replace(/[\x00-\x1f]/g,'').slice(0,160)||'Image';}catch{}
      const result=await serial(async()=>{
        const data=JSON.parse(await readFile(catalogPath,'utf8'));
        const board=data.boards?.find(b=>b.id===match[1]);if(!board)throw fail('Moodboard not found.',404);
        const images=await imageRoot();const directory=resolve(images,board.id);
        await mkdir(directory,{recursive:true});
        if(await realpath(directory)!==directory || !directory.startsWith(images+sep)) throw fail('Invalid moodboard folder.',400);
        const filename=`${Date.now()}-${randomUUID()}.${ext}`;const target=resolve(directory,filename);
        const tagPath=resolve(directory,'tags.json');
        const previousTags=await readTags(directory);
        await writeFile(target,bytes,{flag:'wx'});
        const reference={path:`images/${board.id}/${filename}`,boards:[board.id],title,description:'',source_url:'',notes:'Added through the local moodboard app.'};
        data.references.push(reference);
        try {await writeJSON(tagPath,{...previousTags,[filename]:[]});await save(data);}catch(e){await unlink(target);await writeJSON(tagPath,previousTags);throw e;}
        return {reference:{...reference,tags:[]},catalog:await hydrateTags(root,data)};
      });
      respond(201,result);
    }catch(e){respond(e.status||500,{error:e.status?e.message:'Could not save to the local library. Please try again.'});}
  };
}
