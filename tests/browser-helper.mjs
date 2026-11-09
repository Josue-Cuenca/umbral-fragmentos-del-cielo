import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright");
export async function launch() {
  return chromium.launch({
    headless: true,
    ...(process.env.PLAYWRIGHT_EXECUTABLE
      ? { executablePath: process.env.PLAYWRIGHT_EXECUTABLE }
      : {}),
    args: [
      "--no-sandbox",
      "--no-zygote",
      "--autoplay-policy=no-user-gesture-required",
    ],
  });
}
export async function ready(page) {
  await page.goto("http://localhost:4174");
  await page.waitForFunction(() => window.umbral?.game.scene.isActive("Menu"));
}
export async function start(page) {
  await page.click("#play");
  await page.waitForFunction(
    () =>
      umbral.game.scene.isActive("Game") && umbral.game.scene.isActive("HUD"),
  );
}
