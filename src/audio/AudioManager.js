// All playback is owned by Phaser.Sound. No parallel AudioContext or custom game loop.
export class AudioManager {
 constructor(game,storage){this.sound=game.sound;this.storage=storage;this.track=null;this.zone=-1;this.apply();}
 apply(){this.sound.setMute(this.storage.settings.mute);this.sound.setVolume(this.storage.settings.volume);}
 music(zone){if(this.zone===zone&&this.track){if(this.track.isPaused)this.track.resume();return;}
  this.track?.stop();this.track?.destroy();this.zone=zone;this.track=this.sound.add(`music-${zone}`,{loop:true,volume:.55});this.track.play();
 }
 fx(key){if(this.sound.game.cache.audio.exists(key))this.sound.play(key,{volume:.75});}
 toggle(){this.storage.configure({mute:!this.storage.settings.mute});this.apply();}
 pause(){this.track?.pause();}
 resume(){if(this.track?.isPaused)this.track.resume();}
}
