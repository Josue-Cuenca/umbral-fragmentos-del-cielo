// Native Phaser containers and pointer events, using the same action map as keyboard.
import { Button } from "./Button.js";
export class TouchControls {
  constructor(scene, input) {
    this.buttons = [];
    for (const [action, label] of [
      ["left", "←"],
      ["right", "→"],
      ["up", "↑\nUsar"],
      ["down", "↓"],
      ["jump", "Salto"],
      ["dash", "Dash"],
      ["attack", "Espada"],
      ["shoot", "Disparo"],
    ]) {
      const i = this.buttons.length,
        b = new Button(scene, 43 + i * 78, 405, label, () => {}, 76, 76);
      b.label.setFontSize(15);
      b.actionName = action;
      b.on("pointerdown", (p) => {
        input.press(action, p.id);
        b.highlight(true);
      });
      b.on("pointerup", (p) => {
        input.releasePointer(p.id);
        b.highlight(false);
      });
      b.on("pointerout", (p) => {
        input.releasePointer(p.id);
        b.highlight(false);
      });
      this.buttons.push(b);
    }
  }
}
