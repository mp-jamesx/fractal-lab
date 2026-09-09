export const title = 'Candidate Atlas';
export const description = 'An electric-blue archive of imagined molecular candidates: scattered lobed envelopes, open bond paths, and small analytical registration marks.';

export function draw(p, seed) {
  p.background('#ffffff');
  p.noFill();
  p.stroke('#1649ef');
  p.strokeWeight(2.2);
  p.strokeJoin(p.ROUND);
  p.strokeCap(p.ROUND);
  const specimens = [
    [174, 173, 106, 76, -0.42, 3],
    [459, 153, 121, 78, 0.21, 2],
    [814, 161, 168, 97, -0.19, 3],
    [240, 448, 152, 102, 0.31, 2],
    [609, 422, 173, 117, -0.37, 3],
    [999, 472, 100, 88, 0.31, 2],
  ];
  function ring(x,y,r,rotation=0) {
    p.beginShape();
    for (let k=0;k<6;k++) {
      const a=rotation+k*Math.PI/3;
      p.vertex(x+r*Math.cos(a),y+r*Math.sin(a));
    }
    p.endShape(p.CLOSE);
  }
  for (let j=0;j<specimens.length;j++) {
    const [cx,cy,rx,ry,rotation,lobes]=specimens[j];
    const phase=p.random(-0.3,0.3);
    p.push();
    p.translate(cx,cy);
    p.rotate(rotation);
    // A broad molecular envelope, with a separate interior boundary.
    for (const scale of [1,0.88]) {
      p.strokeWeight(scale===1?2.6:1.6);
      p.beginShape();
      for(let i=0;i<=160;i++) {
        const t=i/160*Math.PI*2;
        const radius=1+0.18*Math.cos(lobes*t+phase)+0.055*Math.sin(5*t+j);
        p.vertex(Math.cos(t)*rx*radius*scale,Math.sin(t)*ry*radius*scale);
      }
      p.endShape(p.CLOSE);
    }
    // The open interior structures are deliberately schematic, not chemical data.
    p.strokeWeight(2.2);
    const r=19+j%3*3;
    const x0=-rx*0.34;
    ring(x0,-4,r,Math.PI/6);
    const left=x0+r*Math.cos(Math.PI/6);
    p.line(left,-4+r*0.5,left+24,8);
    p.line(left+24,8,left+43,-9);
    p.line(left+43,-9,left+67,3);
    p.line(left+67,3,left+84,-11);
    p.line(left+43,-9,left+43,-31);
    if(rx>125) {
      ring(left+101,-11,17,0);
      p.line(x0-r*0.866,-4-r*0.5,x0-r*0.866-19,-31);
      p.line(x0-r*0.866-19,-31,x0-r*0.866-39,-20);
    }
    p.strokeWeight(1.6);
    p.line(x0-r*0.59,-4-r*0.34,x0-r*0.59,-4+r*0.34);
    p.line(x0+2,-4+r*0.7,x0+r*0.6,-4+r*0.34);
    // Short isolated measuring ticks echo a specimen archive without labels.
    const yy=ry*1.34;
    p.line(-26,yy,26,yy);
    for(let tick=0;tick<5;tick++) {
      const xx=-26+tick*13;
      p.line(xx,yy-4,xx,yy+(tick===0||tick===4?5:2));
    }
    p.pop();
  }
  p.strokeWeight(1.6);
  // Widely spaced corner brackets frame the collection.
  for(const [x,y,sx,sy] of [[54,49,1,1],[1146,49,-1,1],[54,625,1,-1],[1146,625,-1,-1]]) {
    p.line(x,y,x+20*sx,y);
    p.line(x,y,x,y+20*sy);
  }
}
