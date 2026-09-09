import * as THREE from 'three';
import { insideLogo } from '../logo-utils.js';

export const title = 'Little Hemisphere';
export const description = 'Terracotta survey terraces lift the M into a small curved world, suspended above an oblique cartographic horizon.';

export function createPiece() {
  const group = new THREE.Group();
  const positions = [], colors = [];
  const palette = ['#ff734f','#e54a39','#ed935b','#ffd3a0'].map(c=>new THREE.Color(c));
  const elevation = (x,y) => 3.7 - (x*x/100 + y*y/80) + 0.28*Math.sin(x*0.7);
  const size=0.42;
  const triangle = (a,b,c,color) => {
    positions.push(...a,...b,...c);
    for(let i=0;i<3;i++) colors.push(color.r,color.g,color.b);
  };
  for (let y=-10;y<10;y+=size) for(let x=-16;x<16;x+=size) {
    if(!insideLogo(x+size/2,y+size/2))continue;
    const tier=Math.floor((x+y+30)/2.65);
    const color=palette[((tier%4)+4)%4];
    const z=Math.round(elevation(x+size/2,y+size/2)*3)/3;
    const a=[x,y,z],b=[x+size*0.94,y,z],c=[x+size*0.94,y+size*0.94,z],d=[x,y+size*0.94,z];
    triangle(a,b,c,color);triangle(a,c,d,color);
    const side=color.clone().multiplyScalar(.78);
    const base=z-0.7;
    for(const [u,v] of [[a,b],[b,c],[c,d],[d,a]]){
      triangle(u,[u[0],u[1],base],v,side);
      triangle(v,[u[0],u[1],base],[v[0],v[1],base],side);
    }
  }
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
  geo.computeVertexNormals();
  const land=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({vertexColors:true,roughness:1,side:THREE.DoubleSide}));
  group.add(land);
  const mapLines=[];
  const addLine=(a,b)=>mapLines.push(...a,...b);
  for(let latitude=-12;latitude<=12;latitude+=2){
    for(let x=-18;x<18;x+=.5){
      const z=(xx)=>-3.5-xx*xx/200-latitude*latitude/250;
      addLine([x,latitude,z(x)],[x+.5,latitude,z(x+.5)]);
    }
  }
  for(let longitude=-18;longitude<=18;longitude+=2){
    for(let y=-12;y<12;y+=.5){
      const z=yy=>-3.5-longitude*longitude/200-yy*yy/250;
      addLine([longitude,y,z(y)],[longitude,y+.5,z(y+.5)]);
    }
  }
  const linesGeo=new THREE.BufferGeometry();linesGeo.setAttribute('position',new THREE.Float32BufferAttribute(mapLines,3));
  const lines=new THREE.LineSegments(linesGeo,new THREE.LineBasicMaterial({color:'#41716e',transparent:true,opacity:.5}));
  lines.rotation.z=-.1; group.add(lines);
  const horizon=[];
  for(let i=0;i<100;i++){
    const t=i/99*Math.PI;
    horizon.push(new THREE.Vector3(18*Math.cos(t),-8+5*Math.sin(t),-4-2*Math.cos(t)**2));
  }
  const rim=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(horizon),100,.08,5,false),new THREE.MeshStandardMaterial({color:'#ffe6c5',roughness:1}));
  rim.rotation.z=-.16;group.add(rim);
  return {group,background:'#123f40',camera:[24,22,65]};
}
