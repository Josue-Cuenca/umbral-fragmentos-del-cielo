import assert from "node:assert/strict";
import { launch, ready, start } from "./browser-helper.mjs";
const browser = await launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.stack));
try {
  await ready(page);
  await start(page);
  const result = await page.evaluate(async () => {
    const { app, game } = await import("/src/main.js"),
      { InputManager } = await import("/src/managers/InputManager.js"),
      { explorerInput, snapshot } = await import("/scripts/explorer.mjs");
    game.loop.stop();
    InputManager.prototype.sample = function () {
      return explorerInput(snapshot(this.scene));
    };
    let now = performance.now(),
      lastRoom = -1,
      milestones = [];
    let collisions = 0,
      overlaps = 0;
    for (let frame = 0; frame < 16000; frame++) {
      const g = game.scene.getScene("Game");
      if (game.scene.isActive("GameOver")) {
        app.retry();
      }
      if (game.scene.isActive("Game")) {
        if (g.session.room !== lastRoom) {
          collisions += g.collisions;
          overlaps += g.overlaps;
          lastRoom = g.session.room;
          milestones.push({
            frame,
            room: lastRoom,
            x: g.player.body.x,
            y: g.player.body.y,
            upgrades: { ...g.session.upgrades },
          });
        }
        if (g.session.completed)
          return {
            completed: true,
            frame,
            milestones,
            deaths: g.session.deaths,
            score: g.session.score,
            collisions,
            overlaps,
          };
      }
      game.headlessStep((now += 1000 / 60), 1000 / 60);
    }
    const g = game.scene.getScene("Game");
    return {
      completed: app.session.completed,
      room: app.session.room,
      milestones,
      position: snapshot(g).player,
      upgrades: app.session.upgrades,
      deaths: app.session.deaths,
      errors: [],
    };
  });
  console.log(JSON.stringify(result, null, 2));
  assert.deepEqual(errors, []);
  assert.equal(
    result.completed,
    true,
    "native campaign must be completable with normal inputs",
  );
} finally {
  await browser.close();
}
