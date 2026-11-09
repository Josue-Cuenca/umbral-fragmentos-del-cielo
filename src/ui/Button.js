export class Button extends Phaser.GameObjects.Container {
 constructor(scene,x,y,label,callback,width=270,height=44){
  super(scene,x,y);scene.add.existing(this);this.action=callback;this.w=width;this.h=height;
  this.bg=scene.add.rectangle(0,0,width,height,0x172c2f).setStrokeStyle(1,0x81998a);
  this.label=scene.add.text(0,0,label,{fontFamily:'monospace',fontSize:'18px',color:'#f1edd2',align:'center'}).setOrigin(.5);
  this.add([this.bg,this.label]);this.setSize(width,height);this.setInteractive({useHandCursor:true});
  this.on('pointerover',()=>this.highlight(true));this.on('pointerout',()=>this.highlight(false));this.on('pointerup',()=>callback());
 }
 highlight(on){this.bg.setFillStyle(on?0xd9d9b9:0x172c2f);this.label.setColor(on?'#112423':'#f1edd2');return this;}
 setLabel(label){this.label.setText(label);return this;}
}
export function text(scene,x,y,value,size=16,color='#e8e6cd'){return scene.add.text(x,y,value,{fontFamily:'monospace',fontSize:size+'px',color,wordWrap:{width:540},lineSpacing:5});}
export function menuKeyboard(scene,buttons){
 let i=0;buttons[0]?.highlight(true);const down=scene.input.keyboard.addKey('DOWN'),up=scene.input.keyboard.addKey('UP'),enter=scene.input.keyboard.addKey('ENTER');
 const handler=()=>{const delta=Phaser.Input.Keyboard.JustDown(down)?1:Phaser.Input.Keyboard.JustDown(up)?-1:0;if(delta){buttons[i].highlight(false);i=(i+delta+buttons.length)%buttons.length;buttons[i].highlight(true);}if(Phaser.Input.Keyboard.JustDown(enter))buttons[i].action();};scene.events.on('update',handler);scene.events.once('shutdown',()=>scene.events.off('update',handler));
}
