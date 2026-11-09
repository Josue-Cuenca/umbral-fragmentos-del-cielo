import test from "node:test";
import assert from "node:assert/strict";
import {
  StorageManager,
  freshSession,
  validateSession,
  KEYS,
} from "../src/managers/StorageManager.js";
function memory() {
  const m = new Map();
  return { getItem: (k) => m.get(k), setItem: (k, v) => m.set(k, v) };
}
test("a fresh adventure is valid and round-trips through persistent storage", () => {
  const storage = memory(),
    manager = new StorageManager(storage),
    s = freshSession();
  s.visited = [0];
  s.score = 100;
  assert.ok(manager.save(s));
  assert.deepEqual(manager.load(), s);
});
test("room progress requires the upgrades that unlock it", () => {
  const s = freshSession();
  s.room = 4;
  assert.equal(validateSession(s), null);
  s.upgrades = { doubleJump: true, phaseDash: true };
  assert.ok(validateSession(s));
  s.upgrades.doubleJump = false;
  assert.equal(validateSession(s), null);
});
test("corrupt saves cannot remove floor tiles or claim a victory without a boss kill", () => {
  const s = freshSession();
  s.upgrades = { doubleJump: true, phaseDash: true };
  s.broken = ["0:0:13"];
  assert.equal(validateSession(s), null);
  s.broken = [];
  s.completed = true;
  assert.equal(validateSession(s), null);
  s.defeated = ["5:2"];
  assert.ok(validateSession(s));
});
test("high score and highest room survive starting a fresh adventure", () => {
  const storage = memory(),
    manager = new StorageManager(storage),
    s = freshSession();
  s.score = 5200;
  s.room = 5;
  manager.record(s);
  manager.save(freshSession());
  const restored = new StorageManager(storage);
  assert.equal(restored.records.highScore, 5200);
  assert.equal(restored.records.level, 5);
});
test("audio and reduced-motion settings survive a new browser session", () => {
  const storage = memory(),
    m = new StorageManager(storage);
  m.configure({ mute: true, volume: 0.3, reducedMotion: true });
  assert.deepEqual(new StorageManager(storage).settings, {
    mute: true,
    volume: 0.3,
    reducedMotion: true,
  });
});
test("denied storage and malformed JSON do not crash the game", () => {
  const denied = {
      getItem() {
        throw Error("denied");
      },
      setItem() {
        throw Error("denied");
      },
    },
    m = new StorageManager(denied);
  assert.equal(m.load(), null);
  assert.equal(m.save(freshSession()), false);
  assert.equal(m.available, false);
  const st = memory();
  st.setItem(KEYS.save, "{");
  assert.equal(new StorageManager(st).load(), null);
});
test("the provided v1 save format migrates playtime and score without breaking progress", () => {
  const st = memory(),
    s = { ...freshSession(), version: 1, playtime: 3600, score: 900 };
  st.setItem("umbral-save-v1", JSON.stringify(s));
  const migrated = new StorageManager(st).load();
  assert.equal(migrated.version, 3);
  assert.equal(migrated.playtime, 60);
  assert.equal(migrated.score, 900);
});
test("new saves contain copies of validated arrays instead of untrusted extra fields", () => {
  const s = freshSession();
  s.visited = [0, 0];
  s.injected = "extra";
  const validated = validateSession(s);
  assert.deepEqual(validated.visited, [0]);
  assert.equal(validated.injected, undefined);
});
