import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { Button, Card, Chip, Link, Modal, Input, Label } from '@mirror-physics/fractal-ui';
import '@mirror-physics/fractal-ui/tokens.css';
import '@mirror-physics/fractal-ui/css';
import './style.css';
import { Experiments } from './Experiments.jsx';
import '../shared/collection.css';
import { Trash, Palette, Beaker } from '@mirror-physics/fractal-icons';
import { LabEmptyState, MirrorStudy } from './LabEmptyState.jsx';
import { BatchToolbar } from './BatchToolbar.jsx';
import { ImageContextMenu } from './ImageContextMenu.jsx';
const url = r => '/' + r.path.split('/').map(encodeURIComponent).join('/');
const route = () => {if(typeof location==='undefined')return '';try {return decodeURIComponent(location.hash.slice(1));} catch {return '__invalid__';}};
export function ImageTags({tags=[]}) {
  const row=useRef(null);
  const [overflow,setOverflow]=useState(false);
  useEffect(()=>{
    const element=row.current;
    const measure=()=>setOverflow(element.scrollWidth>element.clientWidth+1);
    const observer=new ResizeObserver(measure);
    observer.observe(element);measure();
    return()=>observer.disconnect();
  },[tags]);
  return <div ref={row} className="image-tags" role="region" tabIndex={overflow ? 0 : undefined} aria-label="Image tags; scroll horizontally to see more"><div className="tag-track">{tags.length ? tags.map(tag=>{
    const match=tag.match(/^(palette|signal|structure):\s*(.+)$/i);
    const type=match ? match[1].toLowerCase() : 'general';const value=match ? match[2] : tag;
    return <Chip tone="neutral" className={'tag-type-'+type} key={tag} title={type+': '+value} aria-label={type+': '+value}>{value}</Chip>;
  }) : <span className="caption-01">Not tagged yet</span>}</div></div>;
}
export function App() {
  const [data,setData] = useState(null), [error,setError] = useState(false), [id,setId] = useState(route), [selected,setSelected] = useState(null);
  const showingExperiments = id === '/experiments' || id.startsWith('/experiments/');
  const boards = data?.boards || [];
  const board = boards.find(b => b.id === id);
  const refs = (data?.references || []).filter(r => r.boards.includes(id));
  const ref = selected === null ? null : refs[selected];
  const [multiSelection,setMultiSelection]=useState([]);
  const [transferClipboard,setTransferClipboard]=useState(null);
  const suppressPaste=useRef(0);
  const additionHistory=useRef(new Map());
  const [,refreshHistory]=useState(0);
  const [menu,setMenu]=useState(null);
  const closeMenu=useCallback(()=>setMenu(null),[]);
  const opener = useRef(null), uploadLock = useRef(false), dragDepth = useRef(0);
  const [creating,setCreating] = useState(false), [name,setName] = useState(''), [savingBoard,setSavingBoard] = useState(false);
  const [saveError,setSaveError] = useState(''), [dragging,setDragging] = useState(false), [uploading,setUploading] = useState(false);
  async function request(path, body, headers={}) {
    const response=await fetch(path,{method:'POST',headers:{'X-Moodboard-Request':'1',...headers},body});
    const result=await response.json();if(!response.ok) throw new Error(result.error || 'Could not save.');return result;
  }
  async function createBoard(event) {
    event.preventDefault();if(savingBoard || !name.trim())return;
    setSavingBoard(true);setSaveError('');
    try {const result=await request('/api/boards',JSON.stringify({name}),{'Content-Type':'application/json'});setData(result.catalog);setCreating(false);setName('');location.hash=encodeURIComponent(result.board.id);}
    catch(error){setSaveError(error.message);}finally{setSavingBoard(false);}
  }
  async function importImages(files) {
    if(!board || uploadLock.current || selected!==null || creating)return;
    const list=Array.from(files);if(!list.length)return;
    const boardId=board.id;
    uploadLock.current=true;setUploading(true);setSaveError('');const failures=[];const added=[];
    for(const file of list) {
      try {
        if(file.size>50*1024*1024)throw Error(`${file.name}: exceeds 50 MB.`);
        const result=await request(`/api/boards/${boardId}/images`,file,{'Content-Type':'application/octet-stream','X-File-Name':encodeURIComponent(file.name || 'Pasted image')});
        setData(result.catalog);added.push(result.reference.path);
      }catch(error){failures.push(`${file.name || 'Image'}: ${error.message}`);}
    }
    if(added.length){const history=additionHistory.current.get(boardId)||[];additionHistory.current.set(boardId,[...history,added].slice(-50));refreshHistory(n=>n+1);}
    setSaveError(failures.join(' '));uploadLock.current=false;setUploading(false);
  }
  function forgetPaths(paths) {
    const removed=new Set(paths);
    for(const [boardId,history] of additionHistory.current) additionHistory.current.set(boardId,history.map(batch=>batch.filter(path=>!removed.has(path))).filter(batch=>batch.length));
    setMultiSelection(items=>items.filter(item=>!removed.has(item.path)));
    setTransferClipboard(current=>current ? {...current,items:current.items.filter(item=>!removed.has(item.path))} : null);
    refreshHistory(n=>n+1);
  }
  async function deleteImages(paths,undo=false,sources=null) {
    if(uploadLock.current || !paths.length || (!board && !sources))return;
    const currentData=data;
    uploadLock.current=true;setUploading(true);setSaveError('');setMenu(null);setSelected(null);
    const failures=[];
    try {
      for(const path of paths) {
        try {
          const boardId=sources?.find(item=>item.path===path)?.sourceBoards[0] || currentData.references.find(r=>r.path===path)?.boards[0] || id;
          const result=await request(`/api/boards/${boardId}/images/delete`,JSON.stringify({path}),{'Content-Type':'application/json'});
          setData(result.catalog);forgetPaths([path]);
        }catch(error){failures.push(error.message);}
      }
      setSaveError(failures.join(' '));
    }finally{uploadLock.current=false;setUploading(false);}
  }
  function toggleSelection(reference) {
    if(uploadLock.current)return;
    setTransferClipboard(null);
    setMultiSelection(items=>{
      const existing=items.find(item=>item.path===reference.path);
      if(!existing)return [...items,{path:reference.path,title:reference.title,sourceBoards:[id]}];
      const sourceBoards=existing.sourceBoards.includes(id)?existing.sourceBoards.filter(source=>source!==id):[...existing.sourceBoards,id];
      return sourceBoards.length?items.map(item=>item.path===reference.path?{...item,sourceBoards}:item):items.filter(item=>item.path!==reference.path);
    });
  }
  function clearSelection(){if(uploadLock.current)return;setMultiSelection([]);setTransferClipboard(null);}
  function prepareTransfer(mode){if(!multiSelection.length || uploadLock.current)return;setTransferClipboard({mode,items:multiSelection.map(item=>({...item,sourceBoards:[...item.sourceBoards]}))});setMenu(null);}
  async function pasteSelection() {
    if(!board || !transferClipboard?.items.length || uploadLock.current)return;
    const targetId=board.id,clipboard=transferClipboard;
    uploadLock.current=true;setUploading(true);setSaveError('');
    try {
      const result=await request(`/api/boards/${targetId}/images/transfer`,JSON.stringify(clipboard),{'Content-Type':'application/json'});
      setData(result.catalog);
      if(result.moved.length)forgetPaths(result.moved.map(item=>item.from));
      if(result.added.length){const history=additionHistory.current.get(targetId)||[];additionHistory.current.set(targetId,[...history,result.added].slice(-50));refreshHistory(n=>n+1);}
      setMultiSelection([]);setTransferClipboard(null);
    }catch(error){setSaveError(error.message);}finally{uploadLock.current=false;setUploading(false);}
  }
  useEffect(()=>{
    const key=event=>{
      if(showingExperiments || event.defaultPrevented || event.repeat || event.target.isContentEditable || event.target.closest('input,textarea,[role="textbox"]') || creating || selected!==null)return;
      if(event.key==='Escape' && !menu){clearSelection();return;}
      if(!(event.metaKey || event.ctrlKey) || event.altKey)return;
      const key=event.key.toLowerCase();
      if(event.shiftKey && ['c','x'].includes(key) && multiSelection.length){event.preventDefault();prepareTransfer(key==='c'?'copy':'cut');}
      if(event.shiftKey && key==='v' && transferClipboard?.items.length){event.preventDefault();suppressPaste.current=Date.now()+500;pasteSelection();}
      if(!event.shiftKey && ['Backspace','Delete'].includes(event.key) && multiSelection.length){event.preventDefault();deleteImages(multiSelection.map(item=>item.path),false,multiSelection);}
    };
    window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);
  },[multiSelection,transferClipboard,board,creating,selected,menu,showingExperiments]);
  function undoAddition() {
    const history=additionHistory.current.get(id)||[];
    if(history.length)deleteImages([...history.at(-1)].reverse(),true);
  }
  function openImageMenu(event,reference) {
    event.preventDefault();if(uploadLock.current)return;
    const card=event.currentTarget;
    const bounds=card.getBoundingClientRect();
    setMenu({reference,x:event.clientX||bounds.left+24,y:event.clientY||bounds.top+24,opener:card.querySelector('.reference-open')});
  }
  useEffect(()=>{
    const key=event=>{
      if(event.defaultPrevented || event.repeat || !(event.metaKey || event.ctrlKey) || event.shiftKey || event.altKey || event.key.toLowerCase()!=='z')return;
      if(event.target.closest('input,textarea,[contenteditable="true"],[role="textbox"]') || creating)return;
      if((additionHistory.current.get(id)||[]).length){event.preventDefault();if(!uploadLock.current)undoAddition();}
    };
    window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);
  },[id,board,creating]);
  useEffect(()=>{
    const paste=event=>{if(Date.now()<suppressPaste.current){event.preventDefault();return;}if(event.target.closest('input,textarea,[contenteditable="true"]'))return;const files=Array.from(event.clipboardData?.items||[]).filter(item=>item.kind==='file' && item.type.startsWith('image/')).map(item=>item.getAsFile()).filter(Boolean);if(!files.length && transferClipboard?.items.length && board && selected===null && !creating){event.preventDefault();pasteSelection();return;}if(board && files.length && selected===null && !creating){event.preventDefault();importImages(files);}};
    const over=event=>{if(!Array.from(event.dataTransfer?.types||[]).includes('Files'))return;event.preventDefault();event.dataTransfer.dropEffect=board && !uploadLock.current && selected===null && !creating?'copy':'none';};
    const enter=event=>{if(!Array.from(event.dataTransfer?.types||[]).includes('Files'))return;event.preventDefault();dragDepth.current++;if(board && selected===null && !creating && !uploadLock.current)setDragging(true);};
    const leave=event=>{event.preventDefault();dragDepth.current=Math.max(0,dragDepth.current-1);if(!dragDepth.current)setDragging(false);};
    const drop=event=>{if(!Array.from(event.dataTransfer?.types||[]).includes('Files'))return;event.preventDefault();dragDepth.current=0;setDragging(false);if(board)importImages(event.dataTransfer.files);else setSaveError('Open a moodboard before dropping images.');};
    window.addEventListener('paste',paste);window.addEventListener('dragover',over);window.addEventListener('dragenter',enter);window.addEventListener('dragleave',leave);window.addEventListener('drop',drop);
    return()=>{window.removeEventListener('paste',paste);window.removeEventListener('dragover',over);window.removeEventListener('dragenter',enter);window.removeEventListener('dragleave',leave);window.removeEventListener('drop',drop);};
  },[board,selected,creating,transferClipboard]);
  useEffect(() => {
    let alive=true;
    const refresh=()=>{if(uploadLock.current)return;fetch('/catalog.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error();return r.json();}).then(value=>{if(alive && !uploadLock.current){setData(value);setError(false);}}).catch(()=>{if(alive)setError(true);});};
    refresh();window.addEventListener('focus',refresh);
    return()=>{alive=false;window.removeEventListener('focus',refresh);};
  },[id]);
  useEffect(() => {const change = () => {setId(route());setSelected(null);setMenu(null);}; window.addEventListener('hashchange',change);return () => window.removeEventListener('hashchange',change);}, []);
  useEffect(() => {document.title = showingExperiments ? 'Experiments — Fractal Lab' : board ? `${board.name} — Fractal Lab` : 'Fractal Lab';}, [board,showingExperiments]);
  const close = () => setSelected(null);
  const move = delta => setSelected(n => (n + delta + refs.length) % refs.length);
  // v0.1.2's Modal supplies the visual surface and Escape dismissal; augment its
  // composition with dialog semantics, focus containment and background inertness.
  useEffect(() => {
    if (selected === null && !creating) return;
    const panel = document.querySelector(creating ? '.create-board' : '.image-viewer');
    panel.setAttribute('role','dialog'); panel.setAttribute('aria-modal','true'); panel.setAttribute('aria-labelledby',creating ? 'create-title' : 'image-title');
    document.querySelector('#root').inert = true;
    const oldOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden';
    const closeButton = panel.querySelector('button'); closeButton.setAttribute('aria-label',creating ? 'Close new moodboard' : 'Close image'); (panel.querySelector('input') || closeButton).focus();
    const key = e => {
      if(!creating && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {e.preventDefault();setSelected(n => (n + (e.key === 'ArrowRight' ? 1 : -1) + refs.length) % refs.length);}
      if(e.key === 'Tab') {const controls = [...panel.querySelectorAll('button:not([disabled]),a[href],input:not([disabled])')];const first=controls[0],last=controls.at(-1);if(e.shiftKey && document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey && document.activeElement===last){e.preventDefault();first.focus();}}
    };
    panel.addEventListener('keydown',key);
    return () => {panel.removeEventListener('keydown',key);document.querySelector('#root').inert=false;document.body.style.overflow=oldOverflow;opener.current?.focus();};
  }, [selected !== null,creating]);
  const startBoard = event => {opener.current=event.currentTarget;setSaveError('');setName('');setCreating(true);};
  return <>
    <aside className="lab-sidebar">
      <a className="lab-brand" href="#">Fractal Lab</a>
      <nav aria-label="Main navigation">
        <a href="#" aria-current={!showingExperiments ? 'page' : undefined}><Palette size={20}/><span>Moodboards</span></a>
        <a href="#/experiments" aria-current={showingExperiments ? 'page' : undefined}><Beaker size={20}/><span>Experiments</span></a>
      </nav>
    </aside>
    <div className="lab-content">
    {showingExperiments ? <Experiments route={id}/> : <>
    <main aria-busy={uploading} className={multiSelection.length ? 'has-batch-selection' : undefined}>
      <nav className="breadcrumb" aria-label="Breadcrumb">{id ? <><Link href="#" theme="muted">All moodboards</Link><span aria-hidden="true">/</span><span aria-current="page">{board?.name || 'Not found'}</span></> : <span aria-current="page">All moodboards</span>}</nav>
      <section className="page-heading"><div><h1 className="display-01">{id ? board?.name || 'Board not found' : 'Moodboards'}</h1></div>{data && <Chip tone="neutral">{id ? refs.length+' references' : boards.length+' moodboard'+(boards.length===1?'':'s')}</Chip>}</section>
      {!creating && saveError && <p role="alert">{saveError}</p>}
      {dragging && <div className="drop-overlay"><span>Drop images into {board?.name}</span></div>}
      {error ? <LabEmptyState role="alert" title="Your library couldn’t load" description="Try loading your moodboards again." action="Try again" onAction={()=>location.reload()}/> : !data ? <LabEmptyState role="status" title="Opening your library" description="Your references will be here in a moment."/> : !id && !boards.length ? <LabEmptyState title="A place for your next idea" description="Collect images, textures, and visual references in your first moodboard." action="Create moodboard" onAction={startBoard}/> : !id ? <div className="board-grid">
        {boards.map(b => {const items=data.references.filter(r=>r.boards.includes(b.id));return <Card className="board-card" key={b.id}><a className="board-destination collection-link" href={'#'+encodeURIComponent(b.id)} aria-label={`Open ${b.name}`}><div className="collage">{!items.length && <MirrorStudy/>}{items.slice(0,4).map(r=><img key={r.path} src={url(r)} alt={r.description} />)}</div><div className="board-caption"><h2 className="header-02">{b.name}</h2><span className="caption-01">{items.length} references</span></div></a></Card>;})}
        <Card className="board-card new-board-card"><button className="new-board" onClick={startBoard} aria-label="Create new moodboard"><span className="plus" aria-hidden="true">+</span></button></Card>
      </div> : !board ? <LabEmptyState title="Moodboard not found" description="This board may have moved or been removed."><Link href="#" theme="muted">All moodboards</Link></LabEmptyState> : !refs.length ? <LabEmptyState title="Give this idea a starting point" description="Drop images here or paste from your clipboard to start collecting references." action="Choose images" onAction={()=>document.getElementById('empty-file-picker').click()}><input id="empty-file-picker" type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/avif" multiple hidden onChange={event=>{importImages(event.target.files);event.target.value='';}}/></LabEmptyState> : <div className="image-grid">{refs.map((r,i)=><Card className={"reference-card"+(multiSelection.some(item=>item.path===r.path && item.sourceBoards.includes(id))?" is-selected":"")} key={r.path} onContextMenu={event=>openImageMenu(event,r)} onKeyDown={event=>{if(event.key==='ContextMenu' || (event.shiftKey && event.key==='F10'))openImageMenu(event,r);}}><button className="reference-open" aria-label={`View ${r.title}`} aria-pressed={multiSelection.some(item=>item.path===r.path && item.sourceBoards.includes(id))} onClick={e=>{if(e.shiftKey){e.preventDefault();toggleSelection(r);return;}opener.current=e.currentTarget;setSelected(i);}}><div className="image-stage"><img src={url(r)} alt={r.description} /></div><div className="reference-caption"><span className="header-02">{r.title}</span><span className="caption-01">{String(i+1).padStart(2,'0')}</span></div></button><button className="image-trash" aria-label={`Delete ${r.title}`} title="Delete image from disk" disabled={uploading} onClick={event=>{event.stopPropagation();deleteImages([r.path]);}}><Trash size={20} aria-hidden="true"/></button><ImageTags tags={r.tags}/></Card>)}</div>}
    </main>
    {!showingExperiments && !creating && selected===null && <BatchToolbar items={multiSelection} mode={transferClipboard?.mode} busy={uploading} onCopy={()=>prepareTransfer('copy')} onCut={()=>prepareTransfer('cut')} onDelete={()=>deleteImages(multiSelection.map(item=>item.path),false,multiSelection)} onClear={clearSelection}/>}
    <ImageContextMenu menu={menu} onClose={closeMenu} onDelete={reference=>deleteImages([reference.path])}/>
    <footer><span>Fractal Lab</span>{data && <span>{data.references.length} images</span>}</footer>
    </>}
    </div>
    <Modal open={creating} onClose={()=>{if(!savingBoard)setCreating(false);}} noClose={savingBoard} size="sm" className="create-board" title={<span id="create-title">New moodboard</span>}>
      <form onSubmit={createBoard}>
        <div className="name-field"><Label htmlFor="board-name">Name</Label><Input id="board-name" value={name} onChange={event=>setName(event.target.value)} placeholder="e.g. Packaging ideas" maxLength={120} required disabled={savingBoard}/></div>
        {saveError && <p role="alert">{saveError}</p>}
        <div className="create-actions"><Button buttonType="secondary" type="button" disabled={savingBoard} onClick={()=>setCreating(false)}>Cancel</Button><Button buttonType="secondary" type="submit" disabled={savingBoard || !name.trim()}>{savingBoard ? 'Creating…' : 'Create moodboard'}</Button></div>
      </form>
    </Modal>
    <Modal open={!!ref} onClose={close} size="lg" className="image-viewer" title={<span id="image-title">{ref?.title}</span>} footer={<div className="viewer-controls"><Button buttonType="secondary" onClick={()=>move(-1)}>Previous</Button><span className="caption-01" aria-live="polite">{selected+1} of {refs.length}</span><Button buttonType="secondary" onClick={()=>move(1)}>Next</Button></div>}>
      {ref && <div className="viewer-content"><div className="full-image"><img src={url(ref)} alt={ref.description}/></div><ImageTags tags={ref.tags}/><div className="viewer-details"><p>{ref.description}</p><Link href={url(ref)} target="_blank" rel="noopener" theme="muted">Open original</Link></div></div>}
    </Modal>
  </>;
}
if(typeof document!=='undefined')createRoot(document.querySelector('#root')).render(<App/>);
