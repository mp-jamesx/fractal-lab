import React, {useLayoutEffect, useRef} from 'react';
import {createPortal} from 'react-dom';
import {Trash} from '@mirror-physics/fractal-icons';

export function ImageContextMenu({menu,onClose,onDelete}) {
  const panel=useRef(null);
  useLayoutEffect(()=>{
    if(!menu)return;
    const el=panel.current;
    const bounds=el.getBoundingClientRect();
    el.style.left=Math.max(8,Math.min(menu.x,innerWidth-bounds.width-8))+'px';
    el.style.top=Math.max(8,Math.min(menu.y,innerHeight-bounds.height-8))+'px';
    el.querySelector('button').focus();
    const dismiss=event=>{if(!el.contains(event.target))onClose();};
    const key=event=>{
      if(event.key==='Escape'){event.preventDefault();event.stopPropagation();onClose();menu.opener?.focus();}
      if(event.key==='Tab'){onClose();menu.opener?.focus();}
      if(['ArrowDown','ArrowUp','Home','End'].includes(event.key)){event.preventDefault();el.querySelector('button').focus();}
    };
    const close=()=>onClose();
    document.addEventListener('pointerdown',dismiss,true);document.addEventListener('keydown',key,true);
    window.addEventListener('resize',close);window.addEventListener('scroll',close,true);window.addEventListener('blur',close);
    return()=>{document.removeEventListener('pointerdown',dismiss,true);document.removeEventListener('keydown',key,true);window.removeEventListener('resize',close);window.removeEventListener('scroll',close,true);window.removeEventListener('blur',close);};
  },[menu,onClose]);
  if(!menu)return null;
  return createPortal(<div ref={panel} className="image-context-menu fractal-dropdown-panel" role="menu" aria-label="Image actions" style={{left:menu.x,top:menu.y}} onContextMenu={e=>e.preventDefault()}><button role="menuitem" className="image-delete-menu-item" onClick={()=>{onClose();onDelete(menu.reference);}}><Trash size={18} aria-hidden="true"/>Delete</button></div>,document.body);
}
