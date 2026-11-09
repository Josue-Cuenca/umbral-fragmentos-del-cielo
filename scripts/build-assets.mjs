// Only an offline authoring utility. Runtime loads these PNG files with Phaser.Loader.
import {createRequire} from 'node:module';
import {writeFile,mkdir} from 'node:fs/promises';
import {playerArt,enemyArt,tileArt,diamond,rect} from './art-source.js';
import {background,gate,shrine,heart} from './background-source.js';
import {ZONES,ROOMS} from '../src/data/world.js';
const {createCanvas}=createRequire(import.meta.url)('@napi-rs/canvas');
await mkdir('src/assets',{recursive:true});
async function png(name,w,h,draw){const c=createCanvas(w,h);draw(c.getContext('2d'));await writeFile(`src/assets/${name}.png`,c.toBuffer('image/png'));}
for(let z=0;z<3;z++){
 const p=ZONES[z].colors;
 await png(`background-${z}`,320,180,c=>background(c,z,{x:0,y:0},0,z===0));
 await png(`player-${z}`,32*8,32,c=>{for(let i=0;i<8;i++)playerArt(c,p,i*32+11,10,1,i*2,true);});
 for(const type of ['crawler','moth','hopper','sentinel','drone','lancer','boss'])await png(`${type}-${z}`,64*4,64,c=>{for(let i=0;i<4;i++)enemyArt(c,{type,x:i*64+18,y:20,face:-1,hurt:0,aggressive:false},p,i*6);});
 await png(`tiles-${z}`,16*3,16,c=>[1,2,4].forEach((t,i)=>tileArt(c,i*16,0,t,p,i,z)));
 await png(`gate-${z}`,48,64,c=>gate(c,20,48,p,false,0));
 await png(`shrine-${z}`,32,48,c=>shrine(c,14,46,p,0));
 await png(`upgrade-${z}`,24,32,c=>{diamond(c,12,16,9,13,p[9]);diamond(c,12,16,6,9,p[11]);diamond(c,12,16,3,5,p[13]);});
 await png(`heart-${z}`,7*2,6,c=>{heart(c,0,0,true,p);heart(c,7,0,false,p);});
}
await png('particle',3,3,c=>rect(c,0,0,3,3,'#e9e5c5'));
await png('shot',8,4,c=>{rect(c,0,0,8,4,'#68b6ad');rect(c,2,1,5,2,'#f0ca79');});
await writeFile('src/assets/levels.json',JSON.stringify({zones:ZONES,rooms:ROOMS},null,2));
console.log('PNG spritesheets, backgrounds, tiles and level JSON generated.');
