// Record a real native Phaser campaign. The explorer emits controller actions only.
import { mkdir, writeFile } from "node:fs/promises";
import { launch, ready } from "../tests/browser-helper.mjs";
const browser = await launch();
await mkdir(".artifacts/video", { recursive: true });
await mkdir("docs/capturas", { recursive: true });
const context = await browser.newContext({
  viewport: { width: 1280, height: 1000 },
  recordVideo: { dir: ".artifacts/video", size: { width: 1280, height: 1000 } },
});
const page = await context.newPage(),
  errors = [];
page.on("pageerror", (e) => errors.push(e.stack));
await ready(page);
await page.evaluate(async () => {
  const { app, game } = await import("/src/main.js");
  app.audio.music(0);
  const dest = game.sound.context.createMediaStreamDestination();
  game.sound.masterVolumeNode.connect(dest);
  window.audioChunks = [];
  window.audioRecorder = new MediaRecorder(dest.stream);
  audioRecorder.ondataavailable = (e) => audioChunks.push(e.data);
  audioRecorder.start();
  window.fpsSamples = [];
  window.fpsTimer = setInterval(
    () => fpsSamples.push(game.loop.actualFps),
    1000,
  );
});
await page.screenshot({ path: "docs/capturas/01-menu.png", fullPage: true });
await page.waitForTimeout(3000);
await page.click("#play");
await page.waitForFunction(() => umbral.game.scene.isActive("Game"));
await page.evaluate(async () => {
  const { InputManager } = await import("/src/managers/InputManager.js"),
    { explorerInput, snapshot } = await import("/scripts/explorer.mjs");
  InputManager.prototype.sample = function () {
    return explorerInput(snapshot(this.scene));
  };
});
await page.waitForTimeout(1700);
await page.screenshot({ path: "docs/capturas/02-ruinas.png", fullPage: true });
await page.waitForFunction(
  () => umbral.game.scene.getScene("Game").room.id === 2,
);
await page.waitForTimeout(400);
await page.screenshot({
  path: "docs/capturas/03-cristales.png",
  fullPage: true,
});
await page.click("#pause");
await page.waitForFunction(() => umbral.game.scene.isActive("Pause"));
await page.waitForTimeout(2000);
await page.click("#settings");
await page.waitForFunction(() => umbral.game.scene.isActive("Info"));
await page.waitForTimeout(2000);
await page.evaluate(async () => {
  const { app } = await import("/src/main.js");
  app.closeInfo("Pause");
});
await page.click("#pause");
await page.click("#sound");
await page.waitForTimeout(1500);
await page.click("#sound");
await page.waitForFunction(
  () => umbral.game.scene.getScene("Game").room.id === 5,
  {},
  { timeout: 30000 },
);
await page.waitForTimeout(2500);
await page.screenshot({ path: "docs/capturas/04-jefe.png", fullPage: true });
await page.waitForFunction(
  () => umbral.game.scene.isActive("Victory"),
  {},
  { timeout: 60000 },
);
await page.screenshot({
  path: "docs/capturas/05-victoria.png",
  fullPage: true,
});
await page.waitForTimeout(3000);
await page.evaluate(async () => {
  const { app } = await import("/src/main.js");
  app.start(false);
});
await page.waitForFunction(() => umbral.game.scene.isActive("Game"));
await page.click("#pause");
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(500);
await page.screenshot({
  path: "docs/capturas/06-movil-pausa.png",
  fullPage: true,
});
await page.waitForTimeout(4000);
const report = await page.evaluate(async () => {
  clearInterval(fpsTimer);
  await new Promise((resolve) => {
    audioRecorder.onstop = resolve;
    audioRecorder.stop();
  });
  const bytes = new Uint8Array(await new Blob(audioChunks).arrayBuffer());
  const { app } = await import("/src/main.js");
  return {
    audio: Array.from(bytes),
    fps: fpsSamples,
    score: app.session.score,
    completed: app.session.completed,
    deaths: app.session.deaths,
    upgrades: app.session.upgrades,
    broken: app.session.broken,
    architecture: umbral.architecture,
  };
});
await writeFile(".artifacts/audio.webm", Buffer.from(report.audio));
delete report.audio;
report.errors = errors;
await writeFile(".artifacts/demo-report.json", JSON.stringify(report, null, 2));
const video = page.video();
await context.close();
await video.saveAs(".artifacts/demo-silent.webm");
await browser.close();
console.log(JSON.stringify(report));
