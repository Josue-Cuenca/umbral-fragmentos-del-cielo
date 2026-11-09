import {ZONES} from '../src/data/world.js';

import {rect,text,disc,diamond,playerArt,enemyArt,tileArt,crystal,grass} from './art-source.js';

function arch(c,x,y,w,h,p,color=3){
  rect(c,x,y+8,w,h-8,p[color]);rect(c,x+3,y+3,w-6,6,p[color]);rect(c,x+8,y,w-16,4,p[color]);
  const inner=w-14;
  rect(c,x+7,y+22,inner,h-22,p[1]);disc(c,x+w/2,y+23,Math.floor(inner/2),p[1]);
  rect(c,x-2,y+h-6,w+4,6,p[color+1]);rect(c,x+2,y+8,3,h-15,p[color+1]);
  for(let j=17;j<h;j+=12){rect(c,x,y+j,7,1,p[1]);rect(c,x+w-7,y+j+4,7,1,p[1]);}
}
function tree(c,x,y,s,p){
  rect(c,x,y-62*s,7*s,62*s,p[1]);rect(c,x-4*s,y-48*s,5*s,36*s,p[1]);
  for(let i=0;i<7;i++){rect(c,x-21*s+i*6*s,y-72*s-(i%3)*6*s,24*s,13*s,p[1]);rect(c,x-25*s+i*7*s,y-63*s+(i%2)*5*s,20*s,11*s,p[2]);}
  rect(c,x+7*s,y-42*s,15*s,4*s,p[1]);rect(c,x+19*s,y-50*s,4*s,12*s,p[1]);
  for(let i=0;i<8;i++){const dx=x-21*s+i*8*s;rect(c,dx,y-55*s,1,8+(i*11)%23,p[3]);if(i%2)rect(c,dx-2,y-40*s,3,2,p[4]);}
}
export function background(c,zone,camera,t,title=false){
  const p=ZONES[zone].colors;rect(c,0,0,320,180,p[0]);
  for(let y=28;y<160;y+=24)rect(c,0,y,320,24,p[y<70?0:y<120?1:2]);
  const moonX=title?236:232-camera.x*.04,moonY=title?43:34;
  if(zone!==1){disc(c,moonX,moonY,24,p[3]);disc(c,moonX,moonY,20,p[4]);disc(c,moonX,moonY,16,p[6]);disc(c,moonX-3,moonY-4,13,p[7]);rect(c,moonX-25,moonY+5,44,2,p[4]);rect(c,moonX-10,moonY+13,42,3,p[3]);}
  for(let i=0;i<30;i++){
    const x=((i*79+17-camera.x*.08)%344+344)%344,y=(i*31)%95;
    rect(c,x,y,1,i%7===0?2:1,p[i%4===0?5:2]);
  }
  // Distant fragments and broken skyline move more slowly than the foreground.
  for(let i=0;i<9;i++){
    const x=i*59-camera.x*.15-40,y=75+(i*17)%35;
    if(zone===1){crystal(c,x+25,y,20+(i%3)*13,p);rect(c,x+23,y-13,1,9,p[5]);}
    else{
      rect(c,x,y,22+(i%3)*8,70,p[2]);rect(c,x+5,y-15,13,20,p[2]);rect(c,x+7,y-18,9,3,p[3]);
      for(let j=0;j<3;j++)rect(c,x+8,y+9+j*14,3,6,p[1]);
      if(zone===2){rect(c,x-8,y+34,46,5,p[3]);for(let j=0;j<7;j++)rect(c,x+j*4,y+39,20-j*2,3,p[2]);}
    }
  }
  if(zone===0){
    for(let i=0;i<4;i++)tree(c,i*114+40-camera.x*.28,165,1,p);
    arch(c,210-camera.x*.23,67,43,80,p,3);arch(c,252-camera.x*.23,82,40,65,p,2);
  }else if(zone===1){
    for(let i=0;i<15;i++){
      const x=i*27-camera.x*.2;rect(c,x,0,19,12+(i*13)%30,p[2]);
      for(let n=0;n<8;n++)rect(c,x+n,12+(i*13)%30+n,17-n*2,2,p[2]);
      if(i%3===0)crystal(c,x+7,37+(i%4)*8,9,p);
    }
    disc(c,230,96,28,p[2]);disc(c,230,96,19,p[3]);crystal(c,230,92,22,p);
  }else{
    for(let i=0;i<6;i++){
      const x=((i*88-t*.035-camera.x*.12)%430+430)%430-50,y=45+i%3*25;
      rect(c,x,y,45,3,p[3]);rect(c,x+9,y-3,26,3,p[3]);rect(c,x-8,y+3,70,2,p[2]);
    }
    arch(c,222-camera.x*.23,67,42,75,p,3);
    rect(c,260-camera.x*.23,98,48,4,p[4]);rect(c,270-camera.x*.23,102,3,35,p[3]);
  }
  // Soft mist is dithered, preserving the palette.
  for(let x=0;x<320;x+=4){const y=140+Math.floor(Math.sin((x+t*.12)*.015)*4);rect(c,x,y,2,1,p[4]);if(x%12===0)rect(c,x+2,y+5,3,1,p[3]);}
}
export function gate(c,x,y,p,locked,t,back=false){
  arch(c,x-8,y-36,23,50,p,4);rect(c,x-2,y-23,11,34,p[0]);
  for(let n=0;n<4;n++)rect(c,x+n*2,y-20+Math.sin(t*.045+n)*4,1,26,p[locked?9:15]);
  diamond(c,x+3,y-34,2,3,p[locked?14:13]);
  text(c,back?'<':'>',x+1,y-10,p[locked?5:8]);
}
export function shrine(c,x,y,p,t){
  rect(c,x-9,y-4,22,4,p[4]);rect(c,x-6,y-9,16,5,p[5]);rect(c,x-3,y-20,10,11,p[3]);
  rect(c,x-2,y-22,8,3,p[6]);diamond(c,x+2,y-29+Math.sin(t*.04)*2,3,5,p[13]);
  rect(c,x+1,y-17,2,6,p[13]);
}
export function heart(c,x,y,full,p){
  const s=['0110110','1111111','1111111','0111110','0011100','0001000'];
  for(let j=0;j<s.length;j++)for(let i=0;i<7;i++)if(s[j][i]==='1')rect(c,x+i,y+j,1,1,p[full?14:3]);
  if(full)rect(c,x+1,y+1,2,1,p[8]);
}
