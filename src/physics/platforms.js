// Process callbacks let Arcade resolve solids while one-way tiles only stop a fall.
export function oneWay(actor,tile){return actor.body.velocity.y>=0&&actor.body.prev.y+actor.body.height<=tile.body.top+7;}
export function createPlatforms(scene,room,session){
 const solids=scene.physics.add.staticGroup(),platforms=scene.physics.add.staticGroup(),barriers=scene.physics.add.staticGroup();
 room.tiles.forEach((row,y)=>row.forEach((type,x)=>{
  if(!type||session.broken.includes(`${session.room}:${x}:${y}`))return;
  const group=type===2?platforms:type===4?barriers:solids;
  const tile=group.create(x*32,y*32,`tiles-${room.zone}`,type===1?0:type===2?1:2).setOrigin(0).setScale(2).refreshBody();
  tile.tileId=`${session.room}:${x}:${y}`;tile.tileX=x;tile.tileY=y;
 }));return{solids,platforms,barriers};
}
