import React from 'react';
import { Button } from '@mirror-physics/fractal-ui';
import logo from '../experiments/src/mirror-logo.svg?raw';

// Reuse the approved brand geometry; this is decorative artwork, not a new icon.
const outlines = [...logo.matchAll(/<path d="([^"]+)"/g)].map(match => match[1]);
export function MirrorStudy() {
  return <svg className="mirror-study" viewBox="0 0 256 160" fill="none" aria-hidden="true" focusable="false">
    {[0,1,2,3].map(layer => <g key={layer} transform={`translate(${40+layer*16} ${24+layer*12}) scale(4)`} opacity={layer===3 ? 1 : .16+layer*.12}>
      {outlines.map((d,i)=><path key={i} d={d} stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke"/>) }
    </g>)}
  </svg>;
}
export function LabEmptyState({title, description, action, onAction, children, role}) {
  return <section className="lab-empty-state" role={role}>
    <MirrorStudy/>
    <div className="lab-empty-copy"><h2 className="header-02">{title}</h2><p className="body-02">{description}</p>
      {action && <Button buttonType="secondary" onClick={onAction}>{action}</Button>}{children}
    </div>
  </section>;
}
