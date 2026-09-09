import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { Button, Card, Chip, Link, Modal, Input, Label } from '@mirror-physics/fractal-ui';
import '@mirror-physics/fractal-ui/tokens.css';
import '@mirror-physics/fractal-ui/css';
import './style.css';
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
  const boards = data?.boards || [];
  const board = boards.find(b => b.id === id);
  const refs = (data?.references || []).filter(r => r.boards.includes(id));
  const ref = selected === null ? null : refs[selected];
  const opener = useRef(null), uploadLock = useRef(false), dragDepth = useRef(0);
  const [creating,setCreating] = useState(false), [name,setName] = useState(''), [savingBoard,setSavingBoard] = useState(false);
  const [message,setMessage] = useState(''), [saveError,setSaveError] = useState(''), [dragging,setDragging] = useState(false), [uploading,setUploading] = useState(false);
  async function request(path, body, headers={}) {
    const response=await fetch(path,{method:'POST',headers:{'X-Moodboard-Request':'1',...headers},body});
    const result=await response.json();if(!response.ok) throw new Error(result.error || 'Could not save.');return result;
  }
  async function createBoard(event) {
    event.preventDefault();if(savingBoard || !name.trim())return;
    setSavingBoard(true);setSaveError('');
    try {const result=await request('/api/boards',JSON.stringify({name}),{'Content-Type':'application/json'});setData(result.catalog);setCreating(false);setName('');location.hash=encodeURIComponent(result.board.id);setMessage('Moodboard created.');}
    catch(error){setSaveError(error.message);}finally{setSavingBoard(false);}
  }
  async function importImages(files) {
    if(!board || uploadLock.current || selected!==null || creating)return;
    const list=Array.from(files);if(!list.length)return;
    const boardId=board.id,boardName=board.name;
    uploadLock.current=true;setUploading(true);setSaveError('');let saved=0;const failures=[];
    for(const file of list) {
      setMessage(`Saving ${saved+1} of ${list.length} to ${boardName}…`);
      try {
        if(file.size>50*1024*1024)throw Error(`${file.name}: exceeds 50 MB.`);
        const result=await request(`/api/boards/${boardId}/images`,file,{'Content-Type':'application/octet-stream','X-File-Name':encodeURIComponent(file.name || 'Pasted image')});
        setData(result.catalog);saved++;
      }catch(error){failures.push(`${file.name || 'Image'}: ${error.message}`);}
    }
    setMessage(saved ? `${saved} ${saved===1?'image':'images'} saved to ${boardName}.` : '');setSaveError(failures.join(' '));uploadLock.current=false;setUploading(false);
  }
  useEffect(()=>{
    const paste=event=>{if(event.target.closest('input,textarea,[contenteditable="true"]'))return;const files=Array.from(event.clipboardData?.items||[]).filter(item=>item.kind==='file' && item.type.startsWith('image/')).map(item=>item.getAsFile()).filter(Boolean);if(board && files.length && selected===null && !creating){event.preventDefault();importImages(files);}};
    const over=event=>{if(!Array.from(event.dataTransfer?.types||[]).includes('Files'))return;event.preventDefault();event.dataTransfer.dropEffect=board && !uploadLock.current && selected===null && !creating?'copy':'none';};
    const enter=event=>{if(!Array.from(event.dataTransfer?.types||[]).includes('Files'))return;event.preventDefault();dragDepth.current++;if(board && selected===null && !creating && !uploadLock.current)setDragging(true);};
    const leave=event=>{event.preventDefault();dragDepth.current=Math.max(0,dragDepth.current-1);if(!dragDepth.current)setDragging(false);};
    const drop=event=>{if(!Array.from(event.dataTransfer?.types||[]).includes('Files'))return;event.preventDefault();dragDepth.current=0;setDragging(false);if(board)importImages(event.dataTransfer.files);else setSaveError('Open a moodboard before dropping images.');};
    window.addEventListener('paste',paste);window.addEventListener('dragover',over);window.addEventListener('dragenter',enter);window.addEventListener('dragleave',leave);window.addEventListener('drop',drop);
    return()=>{window.removeEventListener('paste',paste);window.removeEventListener('dragover',over);window.removeEventListener('dragenter',enter);window.removeEventListener('dragleave',leave);window.removeEventListener('drop',drop);};
  },[board,selected,creating]);
  useEffect(() => {
    let alive=true;
    const refresh=()=>{if(uploadLock.current)return;fetch('/catalog.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error();return r.json();}).then(value=>{if(alive && !uploadLock.current){setData(value);setError(false);}}).catch(()=>{if(alive)setError(true);});};
    refresh();window.addEventListener('focus',refresh);
    return()=>{alive=false;window.removeEventListener('focus',refresh);};
  },[id]);
  useEffect(() => {const change = () => {setId(route());setSelected(null);}; window.addEventListener('hashchange',change);return () => window.removeEventListener('hashchange',change);}, []);
  useEffect(() => {document.title = board ? `${board.name} — Moodboards` : 'Moodboards';}, [board]);
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
  return <>
    <main aria-busy={uploading}>
      <nav className="breadcrumb" aria-label="Breadcrumb">{id ? <><Link href="#" theme="muted">All moodboards</Link><span aria-hidden="true">/</span><span aria-current="page">{board?.name || 'Not found'}</span></> : <span aria-current="page">All moodboards</span>}</nav>
      <section className="page-heading"><div><h1 className="display-01">{id ? board?.name || 'Board not found' : 'All moodboards'}</h1></div>{data && <Chip tone="neutral">{id ? refs.length+' references' : boards.length+' moodboard'+(boards.length===1?'':'s')}</Chip>}</section>
      <div aria-live="polite">{message && <p className="save-message">{message}</p>}</div>
      {!creating && saveError && <p role="alert">{saveError}</p>}
      {dragging && <div className="drop-overlay"><span>Drop images into {board?.name}</span></div>}
      {error ? <p role="alert">The catalog could not be loaded. Check catalog.json and the moodboard’s tags.json, then reload.</p> : !data ? <p role="status">Loading your library…</p> : !id ? <div className="board-grid">
        {boards.map(b => {const items=data.references.filter(r=>r.boards.includes(b.id));return <Card className="board-card" key={b.id}><a className="board-destination" href={'#'+encodeURIComponent(b.id)} aria-label={`Open ${b.name}`}><div className="collage">{items.slice(0,4).map(r=><img key={r.path} src={url(r)} alt={r.description} />)}</div><div className="board-caption"><h2 className="header-02">{b.name}</h2><span className="caption-01">{items.length} references</span></div></a></Card>;})}
        <Card className="board-card new-board-card"><button className="new-board" onClick={event=>{opener.current=event.currentTarget;setSaveError('');setName('');setCreating(true);}} aria-label="Create new moodboard"><span className="plus" aria-hidden="true">+</span></button></Card>
      </div> : board && <div className="image-grid">{refs.map((r,i)=><Card className="reference-card" key={r.path}><button className="reference-open" aria-label={`View ${r.title}`} onClick={e=>{opener.current=e.currentTarget;setSelected(i);}}><div className="image-stage"><img src={url(r)} alt={r.description} /></div><div className="reference-caption"><span className="header-02">{r.title}</span><span className="caption-01">{String(i+1).padStart(2,'0')}</span></div></button><ImageTags tags={r.tags}/></Card>)}{!refs.length && <p>No references in this moodboard yet.</p>}</div>}
    </main>
    <footer><span>Personal reference library</span>{data && <span>{data.references.length} images</span>}</footer>
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
