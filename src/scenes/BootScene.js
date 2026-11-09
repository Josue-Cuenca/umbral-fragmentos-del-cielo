import { AudioManager } from "../audio/AudioManager.js";
import { text } from "../ui/Button.js";
export class BootScene extends Phaser.Scene {
  constructor() {
    super("Boot");
  }
  preload() {
    this.cameras.main.setBackgroundColor("#0b171c");
    text(this, 320, 160, "UMBRAL", 48).setOrigin(0.5);
    const label = text(
      this,
      320,
      225,
      "Cargando recursos locales…",
      16,
    ).setOrigin(0.5);
    const bar = this.add
      .rectangle(120, 260, 400, 6, 0x8bdee4)
      .setOrigin(0)
      .setScale(0, 1);
    this.failures = [];
    this.load.on("progress", (v) => {
      bar.setScale(v, 1);
      label.setText(`Cargando ${Math.round(v * 100)} %`);
    });
    this.load.on("loaderror", (f) => this.failures.push(f.key));
    this.load.json("levels", "src/assets/levels.json");
    for (let z = 0; z < 3; z++) {
      this.load.image(`background-${z}`, `src/assets/background-${z}.png`);
      this.load.spritesheet(`player-${z}`, `src/assets/player-${z}.png`, {
        frameWidth: 32,
        frameHeight: 32,
      });
      this.load.spritesheet(`tiles-${z}`, `src/assets/tiles-${z}.png`, {
        frameWidth: 16,
        frameHeight: 16,
      });
      this.load.spritesheet(`heart-${z}`, `src/assets/heart-${z}.png`, {
        frameWidth: 7,
        frameHeight: 6,
      });
      for (const type of [
        "crawler",
        "moth",
        "hopper",
        "sentinel",
        "drone",
        "lancer",
        "boss",
      ])
        this.load.spritesheet(`${type}-${z}`, `src/assets/${type}-${z}.png`, {
          frameWidth: 64,
          frameHeight: 64,
        });
      for (const type of ["gate", "shrine", "upgrade"])
        this.load.image(`${type}-${z}`, `src/assets/${type}-${z}.png`);
      this.load.audio(`music-${z}`, `src/assets/audio/music-${z}.wav`);
    }
    this.load.image("particle", "src/assets/particle.png");
    this.load.image("shot", "src/assets/shot.png");
    for (const fx of [
      "jump",
      "dash",
      "slash",
      "shoot",
      "hurt",
      "hit",
      "kill",
      "save",
      "locked",
      "break",
      "death",
      "upgrade",
      "victory",
    ])
      this.load.audio(fx, `src/assets/audio/${fx}.wav`);
  }
  create() {
    if (this.failures.length) {
      this.children.removeAll(true);
      text(
        this,
        40,
        150,
        "No se pudieron cargar: " + this.failures.join(", "),
        18,
      );
      text(
        this,
        40,
        260,
        "Extrae el ZIP completo y ejecuta INICIAR_JUEGO.bat.",
        16,
      );
      return;
    }
    for (let z = 0; z < 3; z++)
      this.anims.create({
        key: `walk-${z}`,
        frames: this.anims.generateFrameNumbers(`player-${z}`, {
          start: 0,
          end: 7,
        }),
        frameRate: 14,
        repeat: -1,
      });
    const app = this.registry.get("app");
    app.audio = new AudioManager(this.game, app.storage);
    this.scene.start("Menu");
  }
}
