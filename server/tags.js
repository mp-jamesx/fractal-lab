import { readFile, writeFile, rename, unlink, realpath } from 'node:fs/promises';
import { resolve, dirname, basename, sep } from 'node:path';
import { randomUUID } from 'node:crypto';
export async function writeJSON(path, data) {
  const temp=`${path}.${randomUUID()}.tmp`;
  try {await writeFile(temp,JSON.stringify(data,null,2)+'\n');await rename(temp,path);}
  finally {await unlink(temp).catch(()=>{});}
}
export async function readTags(directory) {
  const file=resolve(directory,'tags.json');
  try {
    if(await realpath(file)!==file)throw Error('tags.json must not be a symbolic link.');
    const map=JSON.parse(await readFile(file,'utf8'));
    if(!map || Array.isArray(map) || typeof map!=='object' || Object.entries(map).some(([name,tags])=>basename(name)!==name || !Array.isArray(tags) || tags.some(tag=>typeof tag!=='string'))) throw Error('Expected image filename → array of tags.');
    return map;
  }catch(error){if(error.code==='ENOENT')return {};throw Error(`Cannot read ${file}: ${error.message}`);}
}
// Folder-local tags are authoritative. The HTTP catalog is a derived view for the app.
export async function hydrateTags(root, catalog) {
  root=await realpath(root);
  const maps=new Map();
  const references=[];
  for(const ref of catalog.references) {
    const directory=await realpath(resolve(root,dirname(ref.path)));
    if(!directory.startsWith(resolve(root,'images')+sep))throw Error('Invalid image folder.');
    if(!maps.has(directory))maps.set(directory,await readTags(directory));
    references.push({...ref,tags:maps.get(directory)[basename(ref.path)] || []});
  }
  return {...catalog,references};
}
