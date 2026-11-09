import {Button,text,menuKeyboard} from '../ui/Button.js';
export class MenuScene extends Phaser.Scene {
 constructor(){super('Menu');}
 create(){
  const app=this.registry.get('app'),saved=app.storage.load();this.cameras.main.setBackgroundColor('#0b171c');
  this.add.image(0,0,'background-0').setOrigin(0).setDisplaySize(800,450).setAlpha(.7);this.add.rectangle(0,0,390,450,0x0b171c,.75).setOrigin(0);
  this.add.image(486,275,'gate-0').setScale(4);this.add.sprite(432,325,'player-0').setScale(3).play('walk-0');
  text(this,40,25,'UN VIAJE AL OTRO LADO',12,'#d4b779');text(this,36,53,'UMBRAL',68);text(this,42,138,'FRAGMENTOS DEL CIELO',16,'#b9d3cc');
  text(this,42,178,'El mundo se rompió.\nAlgo sigue brillando entre sus ruinas.',14);
  this.buttons=[new Button(this,177,259,saved?'Continuar viaje':'Comenzar viaje',()=>app.start(false)),new Button(this,177,313,'Cómo jugar',()=>app.showInfo('controls')),new Button(this,177,367,'Ajustes y audio',()=>app.showInfo('settings'))];
  if(saved){const b=new Button(this,482,395,'Nuevo viaje',()=>{this.scene.start('Confirm');},210,38);b.label.setFontSize(16);this.buttons.push(b);}
  text(this,42,418,`RÉCORD ${app.storage.records.highScore} · NIVEL MÁXIMO ${app.storage.records.level+1}/6`,13,'#c9c9ad');
  menuKeyboard(this,this.buttons);app.announce('Menú principal. Enter para comenzar.');
 }
}
export class ConfirmScene extends Phaser.Scene {
 constructor(){super('Confirm');}
 create(){const app=this.registry.get('app');this.cameras.main.setBackgroundColor('#0b171c');text(this,320,80,'NUEVO VIAJE',32).setOrigin(.5);text(this,60,140,'Se sustituirá el progreso de esta aventura.\nTu récord y configuración se conservan.',18);const buttons=[new Button(this,320,270,'Comenzar de nuevo',()=>app.start(true)),new Button(this,320,330,'Conservar mi viaje',()=>this.scene.start('Menu'))];menuKeyboard(this,buttons);}
}
