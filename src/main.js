import { StorageManager, freshSession } from "./managers/StorageManager.js";
import { BootScene } from "./scenes/BootScene.js";
import { MenuScene, ConfirmScene } from "./scenes/MenuScene.js";
import { GameScene } from "./scenes/GameScene.js";
import { HUDScene } from "./scenes/HUDScene.js";
import { PauseScene } from "./scenes/PauseScene.js";
import { GameOverScene, VictoryScene } from "./scenes/ResultScenes.js";
import { InfoScene } from "./scenes/InfoScene.js";
let local = null;
try {
  local = window.localStorage;
} catch {}
export const app = {
  storage: new StorageManager(local),
  session: null,
  audio: null,
  game: null,
  announce(message) {
    document.getElementById("announcer").textContent = message;
  },
  start(fresh = false) {
    this.session = fresh
      ? freshSession()
      : (this.storage.load() ?? freshSession());
    for (const key of [
      "Menu",
      "Confirm",
      "Victory",
      "Info",
      "Pause",
      "GameOver",
      "HUD",
      "Game",
    ])
      this.game.scene.stop(key);
    this.game.scene.start("Game", { session: this.session });
  },
  pause() {
    if (!this.game.scene.isActive("Game")) return;
    const g = this.game.scene.getScene("Game");
    if (g.finishing) return;
    g.save();
    g.controls.clear();
    this.game.scene.pause("Game");
    this.game.scene.pause("HUD");
    this.audio.pause();
    this.game.scene.run("Pause");
  },
  resume() {
    this.game.scene.stop("Pause");
    this.game.scene.resume("Game");
    this.game.scene.resume("HUD");
    this.game.scene.getScene("Game").controls.clear();
    this.audio.resume();
  },
  retry() {
    for (const k of ["Pause", "GameOver", "HUD", "Game"])
      this.game.scene.stop(k);
    this.game.scene.start("Game", { session: this.session });
  },
  toMenu() {
    if (this.session) this.storage.save(this.session);
    for (const k of [
      "Game",
      "HUD",
      "Pause",
      "GameOver",
      "Victory",
      "Info",
      "Confirm",
    ])
      this.game.scene.stop(k);
    this.audio.music(0);
    this.game.scene.start("Menu");
  },
  toggleMute() {
    this.audio?.toggle();
    document
      .getElementById("sound")
      .setAttribute("aria-pressed", String(this.storage.settings.mute));
    this.announce(
      this.storage.settings.mute ? "Sonido silenciado" : "Sonido activado",
    );
  },
  showInfo(kind) {
    const keys = ["Pause", "GameOver", "Victory", "Menu", "Game"];
    const current = keys.find((k) => this.game.scene.isActive(k));
    if (!current || this.game.scene.isActive("Info")) return;
    if (current === "Game") {
      this.game.scene.getScene("Game").save();
      this.game.scene.getScene("Game").controls.clear();
      this.game.scene.pause("HUD");
    }
    this.game.scene.pause(current);
    this.game.scene.run("Info", { kind, returnScene: current });
  },
  closeInfo(returnScene) {
    this.game.scene.stop("Info");
    this.game.scene.resume(returnScene);
    if (returnScene === "Game") {
      this.game.scene.resume("HUD");
      this.game.scene.getScene("Game").controls.clear();
    }
  },
};
export const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game-host",
  width: 640,
  height: 450,
  backgroundColor: "#0b171c",
  pixelArt: true,
  roundPixels: true,
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  input: { activePointers: 5 },
  fps: { target: 60 },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 1800 },
      fps: 120,
      fixedStep: true,
      debug: false,
      overlapBias: 8,
      tileBias: 16,
    },
  },
  scene: [
    BootScene,
    MenuScene,
    ConfirmScene,
    GameScene,
    HUDScene,
    PauseScene,
    GameOverScene,
    VictoryScene,
    InfoScene,
  ],
  callbacks: {
    postBoot: (g) => {
      g.canvas.tabIndex = 0;
      g.canvas.setAttribute(
        "aria-label",
        "Juego UMBRAL. Flechas y Enter en menús; controles documentados debajo.",
      );
      g.canvas.addEventListener("pointerdown", () =>
        g.canvas.focus({ preventScroll: true }),
      );
    },
    preBoot: (g) => {
      app.game = g;
      g.registry.set("app", app);
    },
  },
  banner: false,
});
window.umbral = {
  game,
  version: "3.0.0",
  architecture: "Phaser native sprites, physics, camera, HUD, audio",
};
game.events.on(Phaser.Core.Events.BLUR, () => app.pause());
window.addEventListener("pagehide", () => {
  if (app.session) app.storage.save(app.session);
});
document.getElementById("play").onclick = () => {
  if (game.scene.isActive("Menu")) app.start(false);
  else if (game.scene.isActive("Pause")) app.resume();
};
document.getElementById("pause").onclick = () =>
  game.scene.isActive("Pause") ? app.resume() : app.pause();
document.getElementById("sound").onclick = () => app.toggleMute();
document.getElementById("controls").onclick = () => app.showInfo("controls");
document.getElementById("settings").onclick = () => app.showInfo("settings");
document.getElementById("fullscreen").onclick = () => {
  if (game.scale.isFullscreen) game.scale.stopFullscreen();
  else game.scale.startFullscreen();
};
// The DOM mirrors status for screen readers; the visible HUD and menus are Phaser objects.
let lastStatus = "";
setInterval(() => {
  const s = app.session;
  const status = s
    ? `Sala ${s.room + 1}/6. Puntos ${s.score}. Récord ${app.storage.records.highScore}.`
    : "Listo para explorar.";
  if (status !== lastStatus) {
    document.getElementById("status").textContent = status;
    lastStatus = status;
  }
  document.getElementById("storage-status").textContent = app.storage.available
    ? "Guardado automático"
    : "Sin guardado: almacenamiento no disponible";
}, 1000);
