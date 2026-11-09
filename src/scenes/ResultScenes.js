import { Button, text, menuKeyboard } from "../ui/Button.js";
export class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOver");
  }
  create() {
    const app = this.registry.get("app");
    this.add.rectangle(0, 0, 640, 450, 0x0b171c, 0.93).setOrigin(0);
    text(this, 320, 63, "GAME OVER", 42, "#eaa898").setOrigin(0.5);
    text(this, 320, 120, "La luz no se ha apagado.", 18).setOrigin(0.5);
    text(
      this,
      320,
      168,
      `Puntos ${app.session.score} · Caídas ${app.session.deaths}`,
      16,
    ).setOrigin(0.5);
    text(this, 320, 205, "Tus descubrimientos permanecen.", 16).setOrigin(0.5);
    const buttons = [
      new Button(this, 320, 280, "Volver al santuario", () => app.retry()),
      new Button(this, 320, 340, "Volver al título", () => app.toMenu()),
    ];
    menuKeyboard(this, buttons);
    app.announce("Game Over. Puedes volver al santuario.");
  }
}
export class VictoryScene extends Phaser.Scene {
  constructor() {
    super("Victory");
  }
  create() {
    const app = this.registry.get("app"),
      s = app.session;
    this.add.image(0, 0, "background-2").setOrigin(0).setDisplaySize(800, 450);
    this.add.rectangle(0, 0, 640, 450, 0x0b171c, 0.7).setOrigin(0);
    text(this, 320, 45, "AÚN QUEDA CIELO", 36).setOrigin(0.5);
    text(this, 320, 104, "Has devuelto la luz al último umbral.", 18).setOrigin(
      0.5,
    );
    text(
      this,
      320,
      147,
      `VICTORIA · ${s.score} PUNTOS`,
      22,
      "#f0ca79",
    ).setOrigin(0.5);
    text(
      this,
      320,
      190,
      `${s.visited.length}/6 salas · ${s.deaths} caídas · ${Math.floor(s.playtime)} s`,
      16,
    ).setOrigin(0.5);
    const buttons = [
      new Button(this, 320, 257, "Créditos", () => app.showInfo("credits")),
      new Button(this, 320, 313, "Seguir explorando", () => app.start(false)),
      new Button(this, 320, 369, "Volver al título", () => app.toMenu()),
    ];
    menuKeyboard(this, buttons);
    app.announce("Victoria. Has derrotado al último vigía.");
  }
}
