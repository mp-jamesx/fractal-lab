export const title = 'Between Molecule and Machine';
export const description = 'An exploded molecular assay: white latticework separates into computational layers while orange routes carry a binding signal through the stack.';

const WHITE = '#edece7';
const ORANGE = '#ff6b2c';

function scene(p, seed, time) {
  p.background('#101111');
  p.noFill();
  p.strokeCap(p.SQUARE);
  p.strokeJoin(p.MITER);
  const phase = (seed % 71) / 71;
  const breathing = Math.sin(time * 0.65 + phase) * 5;
  const project = (x, y, z) => [650 + (x - y) * 0.86, 448 + (x + y) * 0.37 - z];
  const line = (a, b) => p.line(...a, ...b);
  const path = (points, close = false) => {
    p.beginShape();
    for (const point of points) p.vertex(...point);
    p.endShape(close ? p.CLOSE : undefined);
  };
  const plane = (coords, z, close = false) => path(coords.map(([x,y]) => project(x,y,z)), close);
  const ring = (x,y,z,r,col=WHITE,weight=1.5) => {
    p.stroke(col); p.strokeWeight(weight);
    const pts = [];
    for (let a=0; a<=Math.PI*2+0.01; a+=Math.PI/30) pts.push(project(x+Math.cos(a)*r,y+Math.sin(a)*r,z));
    path(pts);
  };

  // A sparse, cropped measurement rail lends the stack an editorial scale.
  p.stroke(WHITE); p.strokeWeight(1);
  p.line(73,85,73,583);
  for(let i=0;i<27;i++) {
    const y=85+i*19;
    p.line(73,y,73+(i%3===0?15:6),y);
  }
  p.line(73,583,288,583);
  p.stroke(ORANGE); p.strokeWeight(2);
  p.line(73,232,73,318);
  p.line(1058,91,1129,91); p.line(1129,91,1129,161);
  p.line(1058,576,1129,576); p.line(1129,576,1129,538);

  const layers = [0, 112+breathing, 224+breathing*2];
  const corners = [[-198,-174],[198,-174],[198,174],[-198,174]];
  // Open vertical registration lines join the exploded assay trays.
  p.stroke(WHITE); p.strokeWeight(0.7);
  for(const [x,y] of corners) {
    for(let z=8;z<222;z+=14) line(project(x,y,z),project(x,y,z+5));
  }
  layers.forEach((z,index) => {
    p.stroke(WHITE); p.strokeWeight(1.6);
    plane(corners,z,true);
    plane([[-198,174],[198,174],[198,-174]],z-9);
    line(project(-198,174,z),project(-198,174,z-9));
    line(project(198,174,z),project(198,174,z-9));
    line(project(198,-174,z),project(198,-174,z-9));
    p.strokeWeight(0.7);
    // Short perimeter subdivisions imply pixels without filling the plane.
    for(let x=-174;x<=174;x+=24) {
      plane([[x,174],[x,162]],z);
      plane([[x,-174],[x,-166]],z);
    }
    for(let y=-150;y<=150;y+=24) plane([[198,y],[188,y]],z);
    if(index===0) {
      for(let x=-144;x<=144;x+=48) {
        for(let y=-120;y<=120;y+=48) {
          plane([[x-8,y-8],[x+8,y-8],[x+8,y+8],[x-8,y+8]],z,true);
        }
      }
      p.stroke(ORANGE); p.strokeWeight(2);
      plane([[-173,126],[-110,126],[-110,25],[12,25],[12,-82],[166,-82]],z);
      ring(-110,25,z,8,ORANGE);
      ring(12,-82,z,8,ORANGE);
    } else if(index===1) {
      for(let r=43;r<=116;r+=18) ring(0,0,z,r,WHITE,r===115?1.5:0.9);
      p.stroke(ORANGE); p.strokeWeight(2.2);
      plane([[-180,-116],[-122,-116],[-122,-40],[-47,-40]],z);
      plane([[48,40],[120,40],[120,123],[177,123]],z);
      // Four orthogonal receptor registration brackets.
      p.stroke(WHITE); p.strokeWeight(2);
      for(let i=0;i<4;i++) {
        const a=i*Math.PI/2;
        const pts=[[65,-16],[80,-16],[80,16],[65,16]].map(([x,y])=>[x*Math.cos(a)-y*Math.sin(a),x*Math.sin(a)+y*Math.cos(a)]);
        plane(pts,z);
      }
    } else {
      const molecular = [[-75,-36],[-35,-60],[5,-36],[5,10],[-35,34],[-75,10],[-115,-60],[45,-60],[85,-36],[85,10],[45,34],[124,34]];
      const bonds = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[0,6],[2,7],[7,8],[8,9],[9,10],[10,3],[9,11]];
      p.stroke(WHITE); p.strokeWeight(2.4);
      for(const [a,b] of bonds) {
        const u=molecular[a],v=molecular[b];
        const dx=v[0]-u[0],dy=v[1]-u[1],d=Math.hypot(dx,dy);
        plane([[u[0]+dx/d*8,u[1]+dy/d*8],[v[0]-dx/d*8,v[1]-dy/d*8]],z+29);
      }
      molecular.forEach(([x,y],i)=>ring(x,y,z+29,i===11?10:6,i===6||i===11?ORANGE:WHITE,1.8));
      p.stroke(WHITE);p.strokeWeight(0.9);
      for(const [x,y] of [[-140,-120],[140,-120],[140,120],[-140,120]]) {
        plane([[x-12,y],[x+12,y]],z);plane([[x,y-12],[x,y+12]],z);
      }
    }
  });
  // Orange channels cross the layers and terminate in outlined ports.
  for(const [x,y,offset] of [[-145,87,0],[145,-85,0.5]]) {
    p.stroke(ORANGE);p.strokeWeight(2.1);
    line(project(x,y,0),project(x,y,layers[2]+18));
    for(const z of layers) ring(x,y,z,8,ORANGE,1.8);
    const progress=(time*0.11+offset+phase)%1;
    const marker=project(x,y,progress*(layers[2]+18));
    p.strokeWeight(2);
    p.circle(marker[0],marker[1],10);
  }
  // Two detached geometric candidates wait at the edge of the assay.
  for(let i=0;i<2;i++) {
    const cx=224+i*52, cy=155+i*74;
    p.stroke(i?ORANGE:WHITE);p.strokeWeight(1.6);
    const pts=[];
    for(let a=0;a<6;a++) pts.push([cx+Math.cos(a*Math.PI/3)*23,cy+Math.sin(a*Math.PI/3)*17]);
    path(pts,true);
    p.line(cx,cy-17,cx,cy+17);
    p.line(cx-23,cy,cx+23,cy);
  }
}

export function draw(p, seed) { scene(p, seed, 0); }
export function animate(p, seed) { scene(p, seed, p.millis() / 1000); }
