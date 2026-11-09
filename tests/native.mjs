import assert from "node:assert/strict";
import { launch, ready, start } from "./browser-helper.mjs";
export async function canvasClick(page, x, y) {
  const b = await page.locator("#game-host canvas").boundingBox();
  await page.mouse.click(b.x + (x * b.width) / 640, b.y + (y * b.height) / 450);
}
const browser = await launch();
const page = await browser.newPage({
    viewport: { width: 1440, height: 1080 },
    hasTouch: true,
  }),
  errors = [];
page.on("pageerror", (e) => errors.push(e.stack));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
const snap = () =>
  page.evaluate(() => {
    const g = umbral.game.scene.getScene("Game");
    return {
      x: g.player.body.x,
      y: g.player.body.y,
      vy: g.player.body.velocity.y,
      hp: g.player.hp,
      ammo: g.player.ammo,
      frame: g.frame,
      clock: g.gameTime,
      points: g.session.score,
      room: g.session.room,
    };
  });
try {
  await ready(page);
  await page.locator("canvas").focus();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await page.waitForFunction(() => umbral.game.scene.isActive("Info"));
  await canvasClick(page, 320, 407);
  await page.waitForFunction(() => umbral.game.scene.isActive("Menu"));

  await canvasClick(page, 177, 259);
  await page.waitForFunction(() => umbral.game.scene.isActive("Game"));
  await page.waitForTimeout(180);
  assert.ok(
    await page.evaluate(() => {
      const g = umbral.game.scene.getScene("Game");
      return (
        g.player instanceof Phaser.Physics.Arcade.Sprite &&
        g.enemies
          .getChildren()
          .every((e) => e instanceof Phaser.Physics.Arcade.Sprite) &&
        g.terrain.solids instanceof Phaser.Physics.Arcade.StaticGroup &&
        g.cameras.main._follow === g.player &&
        umbral.game.sound instanceof Phaser.Sound.WebAudioSoundManager
      );
    }),
    "native sprites, static bodies, camera and sound",
  );
  const before = await snap();
  await page.keyboard.down("ArrowRight");
  await page.waitForTimeout(260);
  await page.keyboard.up("ArrowRight");
  const moved = await snap();
  assert.ok(moved.x > before.x + 35);
  await page.keyboard.down("Space");
  await page.waitForTimeout(120);
  assert.ok((await snap()).y < moved.y - 20);
  await page.keyboard.up("Space");
  await page.keyboard.press("Shift");
  await page.waitForTimeout(50);
  assert.ok(
    await page.evaluate(
      () =>
        umbral.game.scene.getScene("Game").player.dashReadyAt >
        umbral.game.scene.getScene("Game").gameTime,
    ),
  );
  await page.keyboard.press("k");
  await page.waitForTimeout(80);
  assert.equal((await snap()).ammo, 5);
  await page.keyboard.press("Escape");
  await page.waitForFunction(() => umbral.game.scene.isActive("Pause"));
  const paused = await snap();
  await page.waitForTimeout(180);
  assert.equal(
    (await snap()).frame,
    paused.frame,
    "pause freezes physics and logic",
  );
  await canvasClick(page, 320, 251);
  await page.waitForFunction(() => umbral.game.scene.isActive("Info"));
  await canvasClick(page, 320, 115);
  assert.equal(
    await page.evaluate(async () => {
      const { app } = await import("/src/main.js");
      return app.storage.settings.mute;
    }),
    true,
  );
  await canvasClick(page, 410, 190);
  await canvasClick(page, 320, 285);
  await canvasClick(page, 320, 407);
  await page.waitForFunction(() => umbral.game.scene.isActive("Pause"));
  await canvasClick(page, 320, 143);
  await page.waitForFunction(() => umbral.game.scene.isActive("Game"));
  await page.click("#controls");
  await page.waitForFunction(() => umbral.game.scene.isActive("Info"));
  const frozen = await snap();
  await page.waitForTimeout(100);
  assert.equal((await snap()).frame, frozen.frame);
  await canvasClick(page, 320, 407);
  await page.waitForFunction(() => umbral.game.scene.isActive("Game"));
  // Force a zero-health contact through the actual player damage handler; then use the native retry button.
  await page.evaluate(() => {
    const g = umbral.game.scene.getScene("Game");
    g.player.hp = 1;
    g.player.invulnerableUntil = 0;
    g.player.dashUntil = 0;
    g.player.hurt(1, g.player.body.x + 100);
  });
  await page.waitForFunction(() => umbral.game.scene.isActive("GameOver"));
  await canvasClick(page, 320, 280);
  await page.waitForFunction(() => umbral.game.scene.isActive("Game"));
  await page.waitForTimeout(100);
  assert.equal((await snap()).hp, 5);
  await page.reload();
  await page.waitForFunction(() => umbral.game.scene.isActive("Menu"));
  assert.equal(
    await page.evaluate(async () => {
      const { app } = await import("/src/main.js");
      return app.storage.settings.mute;
    }),
    true,
  );
  await start(page);
  await page.waitForTimeout(160);
  // Actual multi-touch: hold right + jump on separate native Phaser buttons.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(100);
  const bb = await page.locator("canvas").boundingBox();
  const xy = (x, y) => ({
    x: bb.x + (x * bb.width) / 640,
    y: bb.y + (y * bb.height) / 450,
  });
  const client = await page.context().newCDPSession(page);
  const x0 = (await snap()).x;
  await client.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [
      { ...xy(121, 405), id: 1 },
      { ...xy(355, 405), id: 2 },
    ],
  });
  await page.waitForTimeout(180);
  const touch = await snap();
  await client.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  assert.ok(
    touch.x > x0 + 20 && touch.vy < 0,
    "simultaneous right and jump touches work",
  );
  await page.waitForTimeout(80);
  assert.equal(
    await page.evaluate(
      () => umbral.game.scene.getScene("Game").controls.touch.size,
    ),
    0,
  );
  await page.click("#pause");
  await page.waitForFunction(() => umbral.game.scene.isActive("Pause"));
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await page.setViewportSize({ width: 768, height: 1024 });
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await canvasClick(page, 320, 359);
  await page.waitForFunction(() => umbral.game.scene.isActive("Menu"));
  await canvasClick(page, 482, 395);
  await page.waitForFunction(() => umbral.game.scene.isActive("Confirm"));
  await canvasClick(page, 320, 330);
  await page.waitForFunction(() => umbral.game.scene.isActive("Menu"));
  await canvasClick(page, 482, 395);
  await page.waitForFunction(() => umbral.game.scene.isActive("Confirm"));
  await canvasClick(page, 320, 270);
  await page.waitForFunction(() => umbral.game.scene.isActive("Game"));
  assert.equal((await snap()).room, 0);
  assert.equal((await snap()).points, 100);
  assert.equal(
    await page.evaluate(
      async () => (await import("/src/main.js")).app.session.deaths,
    ),
    0,
  );
  await page.evaluate(() => window.dispatchEvent(new Event("pagehide")));
  assert.deepEqual(errors, []);
  console.log(
    "PASS: native sprites/camera/sound, keyboard, jump, dash, projectile, native menus, pause, settings, defeat/retry, persistence, multi-touch, mobile/tablet.",
  );
  // A separate page with denied storage must still load and run.
  const denied = await browser.newContext();
  await denied.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw Error("denied");
    };
  });
  const dp = await denied.newPage();
  await ready(dp);
  await start(dp);
  await dp.waitForTimeout(1100);
  assert.match(
    await dp.locator("#storage-status").textContent(),
    /Sin guardado/,
  );
  await denied.close();
  console.log("PASS: storage denied without crash.");
} finally {
  await browser.close();
}
