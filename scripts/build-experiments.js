import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
const project=resolve(import.meta.dirname,'../experiments');
if(existsSync(resolve(project,'package.json'))){
  const result=spawnSync('npm',['run','build','--','--base=/lab-experiments/','--outDir=dist-lab'],{cwd:project,stdio:'inherit'});
  process.exit(result.status??1);
}else console.log('No experiments project found; Moodboards remains available.');
