export const title = 'Thermal Selection';
export const description = 'Two molecular specimens open into contoured cross-sections, tracing a warm transition from an unoccupied pocket to a complementary binding form.';

export function draw(p, seed) {
  p.background('#191a17');
  p.noFill();
  p.strokeCap(p.ROUND);
  p.strokeJoin(p.ROUND);
  const orange = '#ed803d';
  const gold = '#e6bc54';
  const grey = '#72746a';
  const phase = (seed % 71) * 0.0005;

  // Each specimen is an open contour stack, with generous spacing between shells.
  function specimen(cx, cy, r, turn, pocket) {
    p.push();
    p.translate(cx, cy);
    p.rotate(turn);
    for (let shell = 0; shell < 5; shell++) {
      p.stroke(shell === 0 ? gold : orange);
      p.strokeWeight(shell === 0 ? 2.6 : 1.8);
      const scale = 1 - shell * 0.125;
      p.beginShape();
      for (let i = 0; i <= 320; i++) {
        const a = i / 320 * Math.PI * 2;
        const bump = 1 + 0.15 * Math.cos(3 * a + 0.3) + 0.055 * Math.sin(5 * a + phase);
        const d = Math.atan2(Math.sin(a), Math.cos(a));
        const notch = pocket * Math.exp(-Math.pow(d / 0.33, 2));
        const rad = r * scale * (bump - notch);
        p.vertex(rad * Math.cos(a), rad * Math.sin(a) * 0.90);
      }
      p.endShape(p.CLOSE);
    }
    // Sparse surface meridians specify a tactile, folded volume.
    p.stroke(orange);
    p.strokeWeight(1.7);
    for (const a of [0.8, 2.2, 3.5, 4.7, 5.6]) {
      const x = Math.cos(a), y = Math.sin(a);
      p.bezier(x*r*0.43,y*r*0.38,x*r*0.55-y*22,y*r*0.50+x*22,x*r*0.77-y*14,y*r*0.68+x*14,x*r*(1+0.15*Math.cos(3*a+0.3)+0.055*Math.sin(5*a+phase)),y*r*0.90*(1+0.15*Math.cos(3*a+0.3)+0.055*Math.sin(5*a+phase)));
    }
    p.pop();
  }

  specimen(309, 277, 146, -0.28, 0.31);
  specimen(838, 277, 158, -0.28, 0.50);

  function ring(x, y, r, angle) {
    p.beginShape();
    for(let i=0;i<6;i++) {
      const a=angle+i*Math.PI/3;
      p.vertex(x+r*Math.cos(a),y+r*Math.sin(a));
    }
    p.endShape(p.CLOSE);
  }
  // A small complementary ligand occupies the right-hand concavity.
  p.stroke(gold); p.strokeWeight(2.4);
  ring(955,244,25,-0.28);
  ring(994,257,20,-0.28);
  p.line(1013,251,1030,238);
  p.line(949,220,948,200);
  p.line(947,199,962,185);
  p.line(930,249,914,258);

  // The two-column progression is indicated without labels or arrowheads.
  p.stroke(grey); p.strokeWeight(1.6);
  p.line(542,276,645,276);
  p.line(542,266,542,286);
  p.arc(645,276,20,20,-Math.PI/2,Math.PI/2);

  // Cut planes below each volume reveal discrete hollow molecular sections.
  function section(cx, cy, wide) {
    p.stroke(grey); p.strokeWeight(1.5);
    p.line(cx,426,cx,453);
    p.line(cx-126,469,cx-126,486);
    p.line(cx-126,469,cx-106,469);
    p.line(cx+126,469,cx+126,486);
    p.line(cx+126,469,cx+106,469);
    p.stroke(orange); p.strokeWeight(2);
    p.beginShape();
    for(let i=0;i<=180;i++){
      const a=i/180*Math.PI*2;
      const r=1+0.12*Math.cos(3*a+0.8);
      p.vertex(cx+108*r*Math.cos(a),cy+44*r*Math.sin(a));
    }
    p.endShape(p.CLOSE);
    p.stroke(gold);
    for(const [dx,dy,rx,ry] of [[-53,-2,34,22],[-13,-13,28,17],[20,13,31,19],[59,-5,wide?37:25,23]]) {
      p.ellipse(cx+dx,cy+dy,rx,ry);
    }
    p.stroke(grey);p.strokeWeight(1.5);
    p.line(cx-126,cy+31,cx-126,cy+48);
    p.line(cx-126,cy+48,cx-106,cy+48);
    p.line(cx+126,cy+31,cx+126,cy+48);
    p.line(cx+126,cy+48,cx+106,cy+48);
  }
  section(309,526,false);
  section(838,526,true);
}
