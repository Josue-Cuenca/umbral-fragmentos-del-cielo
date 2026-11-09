import assert from "node:assert/strict";
import { launch, ready, start } from "./browser-helper.mjs";
const browser = await launch(),
  page = await browser.newPage(),
  errors = [];
page.on("pageerror", (e) => errors.push(e.stack));
try {
  await ready(page);
  await start(page);
  const result = await page.evaluate(async () => {
    const { app, game } = await import("/src/main.js"),
      { freshSession } = await import("/src/managers/StorageManager.js");
    game.loop.stop();
    let now = performance.now();
    const step = (n = 1) => {
      for (let i = 0; i < n; i++)
        game.headlessStep((now += 1000 / 60), 1000 / 60);
    };
    const scene = (room, phase = false) => {
      app.session = freshSession();
      app.session.room = room;
      app.session.upgrades = {
        doubleJump: room >= 2 || phase,
        phaseDash: phase,
      };
      app.retry();
      step(3);
      const g = game.scene.getScene("Game");
      g.controls.override = () => ({});
      g.player.invulnerableUntil = Infinity;
      return g;
    };
    let g = scene(0),
      count = 0;
    g.player.place(310, 388);
    g.controls.override = () => ({ jump: true, jumpPressed: count++ === 0 });
    let minY = 1000;
    for (let i = 0; i < 90; i++) {
      step();
      minY = Math.min(minY, g.player.body.y);
    }
    const oneWay = {
      minY,
      landedY: g.player.body.y,
      grounded: g.player.grounded,
    };
    g = scene(3, false);
    g.player.place(850, 360);
    count = 0;
    g.controls.override = () => ({ right: true, dashPressed: count++ === 0 });
    step(50);
    const wall = {
      right: g.player.body.right,
      barriers: g.terrain.barriers.countActive(true),
    };
    g = scene(3, true);
    g.player.place(850, 360);
    count = 0;
    g.controls.override = () => ({ right: true, dashPressed: count++ === 0 });
    step(50);
    const phase = { x: g.player.body.x, broken: [...g.session.broken] };
    g = scene(1);
    g.player.place(1200, 380);
    count = 0;
    g.controls.override = () => ({ interactPressed: count++ === 0 });
    step(4);
    const locked = g.session.room === 1;
    g.controls.override = () => ({});
    const before = g.session.score;
    g.player.place(g.room.upgrade.x * 2 - 10, g.room.upgrade.y * 2 - 14);
    step(10);
    const collected = {
      upgrade: g.session.upgrades.doubleJump,
      gain: g.session.score - before,
    };
    step(20);
    collected.secondGain = g.session.score - before;
    g = scene(0);
    g.player.place(250, 388);
    g.player.invulnerableUntil = 0;
    g.spawnShot(g.player.body.center.x, g.player.body.center.y, 0, 0, true);
    step(3);
    const damage = g.player.hp;
    g.spawnShot(g.player.body.center.x, g.player.body.center.y, 0, 0, true);
    step(3);
    const protectedHp = g.player.hp;
    return { oneWay, wall, phase, locked, collected, damage, protectedHp };
  });
  console.log(JSON.stringify(result));
  assert.ok(result.oneWay.minY < 310);
  assert.ok(
    Math.abs(result.oneWay.landedY - 324) < 1 && result.oneWay.grounded,
  );
  assert.ok(result.wall.right <= 896.1);
  assert.equal(result.wall.barriers, 3);
  assert.ok(result.phase.x > 896 && result.phase.broken.length > 0);
  assert.ok(result.locked);
  assert.ok(result.collected.upgrade);
  assert.equal(result.collected.gain, 500);
  assert.equal(result.collected.secondGain, 500);
  assert.equal(result.damage, 4);
  assert.equal(result.protectedHp, 4);
  assert.deepEqual(errors, []);
  console.log(
    "PASS: native one-way platforms, dash against solid barrier, phase barrier destruction, locked portal, single collectible reward, projectile damage and invulnerability.",
  );
} finally {
  await browser.close();
}
