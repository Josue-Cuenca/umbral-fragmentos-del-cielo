import {Button,text} from '../ui/Button.js';
import {TouchControls} from '../ui/TouchControls.js';
export class HUDScene extends Phaser.Scene {
 constructor(){super('HUD');}
 create(){
  this.app=this.registry.get('app');this.gameScene=this.scene.get('Game');this.add.rectangle(0,0,640,55,0x08191e,.94).setOrigin(0);
  this.hearts=[];for(let i=0;i<5;i++)this.hearts.push(this.add.image(12+i*18,10,`heart-${this.gameScene.room.zone}`,0).setOrigin(0).setScale(2));
  this.ammo=text(this,110,9,'',14);this.score=text(this,246,9,'',13);this.level=text(this,12,34,'',12,'#b9d3cc');
  this.pauseButton=new Button(this,505,26,'Ⅱ',()=>this.app.pause(),44,34);this.pauseButton.label.setFontSize(18);
  this.muteButton=new Button(this,585,26,'Sonido',()=>this.app.toggleMute(),94,34);this.muteButton.label.setFontSize(14);
  this.stamina=this.add.rectangle(114,31,88,4,0x68b6ad).setOrigin(0);
  this.notice=text(this,320,70,'',18).setOrigin(.5,0).setBackgroundColor('#0b171c').setPadding(8).setVisible(false);
  this.detail=text(this,320,103,'',13).setOrigin(.5,0).setBackgroundColor('#0b171c').setPadding(5).setVisible(false);
  this.hint=text(this,320,340,'',13).setOrigin(.5).setBackgroundColor('#0b171c').setPadding(4);
  this.bossBack=this.add.rectangle(320,324,260,8,0x263d42).setVisible(false);this.bossBar=this.add.rectangle(190,324,260,6,0xf0ca79).setOrigin(0,.5).setVisible(false);
  this.bossText=text(this,320,302,'EL ÚLTIMO VIGÍA',12).setOrigin(.5).setVisible(false);
  this.add.rectangle(0,360,640,90,0x0b171c).setOrigin(0);this.touch=new TouchControls(this,this.gameScene.controls);
  this.notify(this.gameScene.zone.name,this.gameScene.room.name);
 }
 notify(title,detail=''){this.notice?.setText(title).setVisible(true);this.detail?.setText(detail).setVisible(!!detail);this.hideNotice?.remove();this.hideNotice=this.time.delayedCall(2300,()=>{this.notice.setVisible(false);this.detail.setVisible(false);});}
 update(){
  const g=this.gameScene,p=g.player,s=g.session,records=this.app.storage.records;
  this.hearts.forEach((h,i)=>h.setFrame(i<p.hp?0:1));this.ammo.setText(`CARGAS ${p.ammo}/6`);
  this.score.setText(`PUNTOS ${s.score}\nRÉCORD ${records.highScore}`);this.level.setText(`SALA ${s.room+1}/6 · MÁX ${records.level+1}${s.upgrades.doubleJump?' · DOBLE SALTO':''}${s.upgrades.phaseDash?' · DASH+':''}`);
  this.stamina.setScale(Phaser.Math.Clamp(1-(p.dashReadyAt-g.gameTime)/(s.upgrades.phaseDash?633:800),0,1),1);
  this.muteButton.setLabel(this.app.storage.settings.mute?'Mute':'Sonido');
  let hint='';if(p.body.y>335){if(p.body.x<80&&s.room>0)hint='↑ / W para volver';else if(p.body.x>1170&&s.room<5)hint='↑ / W para cruzar';else if(Math.abs(p.body.x-g.room.checkpoint*2)<50)hint='↑ / W para descansar';}
  this.hint.setText(hint).setVisible(!!hint);
  const boss=g.enemies.getChildren().find(e=>e.active&&e.type==='boss'&&e.phase);
  for(const item of [this.bossBack,this.bossBar,this.bossText])item.setVisible(!!boss);if(boss)this.bossBar.setScale(boss.hp/boss.maxHp,1);
 }
}
