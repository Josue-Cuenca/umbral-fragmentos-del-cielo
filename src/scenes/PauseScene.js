import { Button, text, menuKeyboard } from "../ui/Button.js";
export class PauseScene extends Phaser.Scene {
  constructor() {
    super("Pause");
  }
  create() {
    const app = this.registry.get("app");
    this.add.rectangle(0, 0, 640, 450, 0x081719, 0.91).setOrigin(0);
    text(this, 320, 35, "EN PAUSA", 34).setOrigin(0.5, 0);
    text(this, 320, 86, "El mundo puede esperar.", 16).setOrigin(0.5);
    this.buttons = [
      new Button(this, 320, 143, "Continuar", () => app.resume()),
      new Button(this, 320, 197, "Controles", () => app.showInfo("controls")),
      new Button(this, 320, 251, "Ajustes y audio", () =>
        app.showInfo("settings"),
      ),
      new Button(this, 320, 305, "Reiniciar sala", () => app.retry()),
      new Button(this, 320, 359, "Volver al título", () => app.toMenu()),
    ];
    menuKeyboard(this, this.buttons);
    this.escape = this.input.keyboard.addKey("ESC");
    app.announce("Juego en pausa.");
  }
  update() {
    if (Phaser.Input.Keyboard.JustDown(this.escape))
      this.registry.get("app").resume();
  }
}
