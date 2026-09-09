import React from 'react';
import { Trash, Copy, Close } from '@mirror-physics/fractal-icons';
import { Button } from '@mirror-physics/fractal-ui';

export function BatchToolbar({items,mode,busy,onCopy,onCut,onDelete,onClear}) {
  if(!items.length)return null;
  return <div className="batch-toolbar" role="toolbar" aria-label="Selected image actions">
    <div className="batch-previews" aria-label="Selected images">{items.map(item=><img key={item.path} src={'/'+item.path.split('/').map(encodeURIComponent).join('/')} alt={item.title} title={item.title}/>)}</div>
    <div className="batch-count" aria-live="polite"><strong>{items.length} selected</strong>{mode && <span>{mode==='cut'?'Ready to move':'Ready to copy'} · ⌘⇧V to paste</span>}</div>
    <div className="batch-buttons">
      <Button buttonType="secondary" disabled={busy} onClick={onDelete} title="Delete selection (⌘Delete)"><Trash size={18}/>Delete</Button>
      <Button buttonType="secondary" disabled={busy} onClick={onCopy} aria-pressed={mode==='copy'} title="Copy selection (⌘⇧C)"><Copy size={18}/>Copy</Button>
      <Button buttonType="secondary" disabled={busy} onClick={onCut} aria-pressed={mode==='cut'} title="Cut selection (⌘⇧X)">Cut</Button>
      <button className="batch-clear" disabled={busy} onClick={onClear} aria-label="Clear selection" title="Clear selection"><Close size={18}/></button>
    </div>
  </div>;
}
