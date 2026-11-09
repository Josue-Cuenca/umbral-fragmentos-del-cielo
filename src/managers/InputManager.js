const BINDINGS = {
  left: ["LEFT", "A"],
  right: ["RIGHT", "D"],
  up: ["UP", "W"],
  down: ["DOWN", "S"],
  jump: ["SPACE"],
  dash: ["SHIFT"],
  attack: ["J", "Z"],
  shoot: ["K", "X"],
  pause: ["ESC"],
};
export class InputManager {
  constructor(scene) {
    this.scene = scene;
    this.touch = new Map();
    this.edges = new Set();
    this.override = null;
    this.keys = {};
    for (const [action, names] of Object.entries(BINDINGS))
      this.keys[action] = names.map((n) => {
        const key = scene.input.keyboard.addKey(n);
        key.on("down", () => this.edges.add(action));
        return key;
      });
    scene.input.addPointer(4);
    scene.input.on("pointerup", (p) => this.releasePointer(p.id));
    scene.input.on("pointerupoutside", (p) => this.releasePointer(p.id));
  }
  press(action, pointer) {
    if (!this.touch.has(pointer)) this.edges.add(action);
    this.touch.set(pointer, action);
  }
  releasePointer(id) {
    this.touch.delete(id);
  }
  clear() {
    this.touch.clear();
    this.edges.clear();
    this.scene.input.keyboard.resetKeys();
  }
  sample() {
    if (this.override) return this.override();
    const state = {};
    for (const [action, keys] of Object.entries(this.keys)) {
      state[action] =
        keys.some((k) => k.isDown) || [...this.touch.values()].includes(action);
      state[action + "Pressed"] =
        keys.map((k) => Phaser.Input.Keyboard.JustDown(k)).some(Boolean) ||
        this.edges.has(action);
    }
    state.interactPressed = state.upPressed;
    this.edges.clear();
    return state;
  }
}
