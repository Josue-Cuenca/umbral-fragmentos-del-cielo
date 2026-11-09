import { Button, text, menuKeyboard } from "../ui/Button.js";
export class InfoScene extends Phaser.Scene {
  constructor() {
    super("Info");
  }
  init({ kind, returnScene }) {
    this.kind = kind;
    this.returnScene = returnScene;
  }
  create() {
    const app = this.registry.get("app");
    this.add.rectangle(0, 0, 640, 450, 0x0b171c, 0.98).setOrigin(0);
    this.buttons = [];
    const title = {
      controls: "TRAZA TU CAMINO",
      settings: "A TU MANERA",
      credits: "HECHO DE FRAGMENTOS",
    }[this.kind];
    text(this, 320, 30, title, 28).setOrigin(0.5);
    if (this.kind === "controls")
      text(
        this,
        45,
        70,
        "Mover: A/D o ←/→\nSaltar: Espacio; otra vez para doble salto\nDash: Shift + dirección (ocho direcciones)\nEspada: J/Z · Proyectil: K/X\nUmbral y santuario: W/↑ · Pausa: Escape\n\nEn táctil usa los ocho botones inferiores.\nMantén Salto para mayor altura.\nBusca las mejoras de las salas 2 y 4.\nDescansa para restaurar vida y cargas.\nDerrota al jefe de la sala 6 para ganar.",
        17,
      );
    if (this.kind === "credits")
      text(
        this,
        45,
        80,
        "UMBRAL Fragmentos del cielo\n\nArte, mapas y motivos musicales: juego base\nproporcionado por el estudiante.\nMigración a sprites, escenas, cámara, HUD,\nArcade Physics y audio nativos de Phaser.\n\nPhaser 3.90.0 · Licencia MIT incluida.\nAdaptación técnica con asistencia de IA.\nInspiraciones de la base: Celeste, Cave Story\ny Hyper Light Drifter.",
        17,
      );
    if (this.kind === "settings") {
      this.mute = new Button(
        this,
        320,
        115,
        "",
        () => {
          app.toggleMute();
          this.labels();
        },
        360,
      );
      this.buttons.push(this.mute);
      const less = new Button(
        this,
        230,
        190,
        "Volumen −",
        () => this.volume(-0.1),
        170,
      );
      const more = new Button(
        this,
        410,
        190,
        "Volumen +",
        () => this.volume(0.1),
        170,
      );
      this.buttons.push(less, more);
      this.volumeText = text(this, 320, 230, "", 17).setOrigin(0.5);
      this.motion = new Button(
        this,
        320,
        285,
        "",
        () => {
          app.storage.configure({
            reducedMotion: !app.storage.settings.reducedMotion,
          });
          this.labels();
        },
        450,
      );
      this.motion.label.setFontSize(17);
      this.buttons.push(this.motion);
      text(
        this,
        320,
        335,
        "La configuración se conserva en este navegador.",
        14,
      ).setOrigin(0.5);
      this.labels();
    }
    this.buttons.push(
      new Button(
        this,
        320,
        407,
        "Volver",
        () => app.closeInfo(this.returnScene),
        240,
        42,
      ),
    );
    menuKeyboard(this, this.buttons);
    this.escape = this.input.keyboard.addKey("ESC");
  }
  labels() {
    const s = this.registry.get("app").storage.settings;
    this.mute.setLabel(s.mute ? "Sonido: silenciado" : "Sonido: activado");
    this.volumeText.setText(`Volumen ${Math.round(s.volume * 100)} %`);
    this.motion.setLabel(
      "Reducir sacudidas: " + (s.reducedMotion ? "sí" : "no"),
    );
  }
  volume(delta) {
    const a = this.registry.get("app");
    a.storage.configure({
      volume: Phaser.Math.Clamp(a.storage.settings.volume + delta, 0, 1),
    });
    a.audio.apply();
    this.labels();
  }
  update() {
    if (Phaser.Input.Keyboard.JustDown(this.escape))
      this.registry.get("app").closeInfo(this.returnScene);
  }
}
