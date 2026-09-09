export const title = 'The Narrowing Field';
export const description = 'An abstract screening corridor: a broad field of candidates meets two offset apertures and resolves into a small set of paths.';

const BG = '#202222';
const LIGHT = '#dadbd6';

function diamond(p, x, y, r) {
  p.beginShape();
  p.vertex(x, y-r); p.vertex(x+r, y); p.vertex(x, y+r); p.vertex(x-r, y);
  p.endShape(p.CLOSE);
}
function gate(p, x, y, w, h, depth) {
  const corners = [[x-w*.5,y-h*.5],[x+w*.5,y-h*.5+30],[x+w*.5,y+h*.5],[x-w*.5,y+h*.5-30]];
  for (let layer=7; layer>=0; layer--) {
    const dx=layer*depth/7, dy=-layer*depth*.44/7;
    p.stroke(layer===0?LIGHT:'#656b69');
    p.strokeWeight(layer===0?2:0.8);
    p.beginShape();
    for (const [cx,cy] of corners) p.vertex(cx+dx,cy+dy);
    p.endShape(p.CLOSE);
  }
  p.stroke('#909692'); p.strokeWeight(.85);
  corners.forEach(([cx,cy])=>p.line(cx,cy,cx+depth,cy-depth*.44));
  // Machined ticks at each long edge distinguish a screening aperture from a chart.
  for(let i=0;i<16;i++) {
    const q=(i+.5)/16;
    const yy=y-h*.5+q*(h-30);
    p.line(x-w*.5-11,yy,x-w*.5-5,yy);
    p.line(x+w*.5+5,yy+30,x+w*.5+11,yy+30);
  }
}
function render(p, seed, t) {
  p.background(BG); p.noFill(); p.strokeCap(p.SQUARE); p.strokeJoin(p.MITER);
  // Scattered outline modules stand for a search space, deliberately nonchemical.
  for(let row=0; row<8; row++) for(let col=0; col<4; col++) {
    const x=66+col*63+(row%2)*12;
    const y=120+row*61+Math.sin(col*2.1+row)*7;
    p.stroke((row+col)%4===0?'#b9bfba':'#555d59'); p.strokeWeight(1.1);
    const size=7+((row*3+col)%3)*2;
    if((row+col)%3===0) p.rect(x-size,y-size,size*2,size*2);
    else diamond(p,x,y,size);
    if((row*4+col)%7===0) {p.line(x-15,y+20,x-5,y+20);p.line(x+5,y+20,x+15,y+20);}
  }
  // Many paths arrive; only selected paths cross each successive threshold.
  for(let i=0;i<23;i++) {
    const yy=104+i*21;
    const target=191+i*13.3;
    p.stroke(i%4===1?'#b9bfba':'#525a56'); p.strokeWeight(i%4===1?1.35:.8);
    p.bezier(284,yy,333,yy,352,target,408,target);
    if(i%4!==1) {
      p.line(396,target-3,402,target+3);
      p.line(396,target+3,402,target-3);
    }
  }
  for(let i=0;i<6;i++) {
    const sy=208+i*51;
    const ey=290+i*23;
    p.stroke(i===1||i===3||i===5?LIGHT:'#727b76'); p.strokeWeight(1.4);
    p.bezier(466,sy,570,sy,601,ey,713,ey);
    diamond(p,568+Math.sin(t*.22+i)*6,sy+(ey-sy)*.47,5);
  }
  for(let i=0;i<3;i++) {
    const sy=313+i*46, ey=267+i*99;
    p.stroke(LIGHT);p.strokeWeight(1.8);
    p.bezier(771,sy,898,sy,885,ey,1039,ey);
    diamond(p,1065,ey,18);
    p.stroke('#6e7771');p.strokeWeight(.8);
    diamond(p,1065,ey,25);
    p.line(1102,ey,1139,ey);
    p.line(1139,ey-7,1139,ey+7);
  }
  // Two asymmetric wire apertures, offset in scale and position.
  gate(p,433,331,58,458,36);
  gate(p,742,357,58,245,29);
  p.stroke('#737c76');p.strokeWeight(1);
  p.line(55,65,217,65);p.line(55,65,55,86);
  p.line(1145,610,974,610);p.line(1145,610,1145,589);
  for(let j=0;j<7;j++) p.rect(77+j*15,604,6,6);
  // An understated moving read head gives the selection machine a slow pulse.
  const yy=186+(Math.sin(t*.18)*.5+.5)*278;
  p.stroke(LIGHT);p.strokeWeight(2);
  p.line(410,yy,423,yy);p.line(443,yy+10,456,yy+10);
}
export function draw(p, seed) { render(p, seed, 0); }
export function animate(p, seed) { render(p, seed, p.millis()/1000); }
