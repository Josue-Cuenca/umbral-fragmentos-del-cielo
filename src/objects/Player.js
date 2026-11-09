export class Player extends Phaser.Physics.Arcade.Sprite {
 constructor(scene,x,y,zone){
  super(scene,x-22,y-20,`player-${zone}`,0);scene.add.existing(this);scene.physics.add.existing(this);this.setOrigin(0).setScale(2).setDepth(10);
  this.body.setSize(10,14).setOffset(11,10).setMaxVelocity(950,760);this.body.updateFromGameObject();
  this.hp=5;this.ammo=6;this.face=1;this.invulnerableUntil=scene.gameTime+1000;this.dashUntil=0;this.dashReadyAt=0;this.attackReadyAt=0;this.shootReadyAt=0;this.coyoteUntil=0;this.jumpBufferedUntil=0;this.airJump=false;
 }
 get grounded(){return this.body.blocked.down||this.body.touching.down;}
 get dashing(){return this.scene.gameTime<this.dashUntil;}
 place(x,y){this.setPosition(x-22,y-20);this.body.updateFromGameObject();this.setVelocity(0);}
 updateControl(input,now){
  const g=this.scene,u=g.session.upgrades,axis=Number(!!input.right)-Number(!!input.left);
  if(this.grounded){this.coyoteUntil=now+100;this.airJump=false;}
  if(axis)this.face=axis;this.setFlipX(this.face<0);
  if(input.jumpPressed)this.jumpBufferedUntil=now+100;
  if(this.jumpBufferedUntil>now&&(this.grounded||now<this.coyoteUntil||u.doubleJump&&!this.airJump)){
   const air=!this.grounded&&now>=this.coyoteUntil;this.setVelocityY(air?-588:-624);this.airJump=air;this.coyoteUntil=0;this.jumpBufferedUntil=0;g.audio.fx('jump');g.burst(this.body.center.x,this.body.bottom,0x91b7b0,8);
  }
  if(input.dashPressed&&now>=this.dashReadyAt){
   const dy=Number(!!input.down)-Number(!!input.up),dx=axis||(!dy?this.face:0),len=Math.hypot(dx,dy)||1;
   this.dashUntil=now+(u.phaseDash?200:166);this.dashReadyAt=now+(u.phaseDash?633:800);this.dashX=dx/len;this.dashY=dy/len;g.audio.fx('dash');
  }
  this.body.setAllowGravity(!this.dashing);
  if(this.dashing){this.setVelocity(this.dashX*900,this.dashY*900);if(g.frame%3===0)g.burst(this.body.center.x,this.body.center.y,0x68b6ad,1);}
  else{
   const acceleration=this.grounded?78:48;this.setVelocityX(this.body.velocity.x+Phaser.Math.Clamp(axis*258-this.body.velocity.x,-acceleration,acceleration));
   if(!input.jump&&!input.jumpPressed&&this.body.velocity.y<-240)this.setVelocityY(-240);
  }
  if(input.attackPressed&&now>=this.attackReadyAt){this.attackReadyAt=now+300;g.sword();}
  if(input.shootPressed&&this.ammo>0&&now>=this.shootReadyAt){this.ammo--;this.shootReadyAt=now+333;g.spawnShot(this.body.center.x+this.face*15,this.body.center.y,this.face*576,0,false);g.audio.fx('shoot');}
  if(axis&&this.grounded)this.play(`walk-${g.room.zone}`,true);else{this.anims.stop();this.setFrame(0);}
  this.setAlpha(now<this.invulnerableUntil&&g.frame%6<3?.35:1);
  if(this.body.x<0)this.place(0,this.body.y);if(this.body.right>1280)this.place(1260,this.body.y);
  if(this.body.top<-80)this.setVelocityY(Math.max(0,this.body.velocity.y));
 }
 hurt(damage,fromX){
  const g=this.scene,now=g.gameTime;if(now<this.invulnerableUntil||this.dashing||g.finishing)return false;
  this.hp=Math.max(0,this.hp-damage);this.invulnerableUntil=now+1100;this.setVelocity((this.body.center.x<fromX?-1:1)*210,-310);g.audio.fx('hurt');
  if(!g.app.storage.settings.reducedMotion)g.cameras.main.shake(100,.007);
  if(this.hp===0)g.lose();return true;
 }
}
