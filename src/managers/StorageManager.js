import { ROOMS } from "../data/world.js";
export const KEYS = {
  save: "umbral-save-v3",
  records: "umbral-records",
  settings: "umbral-settings-v3",
};
const nonnegative = (n) =>
  Number.isFinite(n) ? Math.max(0, Math.floor(n)) : 0;
export function freshSession() {
  return {
    version: 3,
    room: 0,
    score: 0,
    upgrades: { doubleJump: false, phaseDash: false },
    visited: [],
    defeated: [],
    broken: [],
    deaths: 0,
    playtime: 0,
    completed: false,
  };
}
export function validateSession(raw) {
  if (
    !raw ||
    ![1, 3].includes(raw.version) ||
    !Number.isInteger(raw.room) ||
    !ROOMS[raw.room]
  )
    return null;
  const u = raw.upgrades;
  if (
    !u ||
    typeof u.doubleJump !== "boolean" ||
    typeof u.phaseDash !== "boolean" ||
    (u.phaseDash && !u.doubleJump)
  )
    return null;
  if ((raw.room >= 2 && !u.doubleJump) || (raw.room >= 4 && !u.phaseDash))
    return null;
  if (
    !Array.isArray(raw.visited) ||
    !raw.visited.every((i) => Number.isInteger(i) && ROOMS[i])
  )
    return null;
  if (
    !Array.isArray(raw.defeated) ||
    !raw.defeated.every((id) => {
      if (typeof id !== "string" || !/^\d:\d$/.test(id)) return false;
      const [r, i] = id.split(":").map(Number);
      return !!ROOMS[r]?.enemies[i];
    })
  )
    return null;
  if (
    !Array.isArray(raw.broken) ||
    !raw.broken.every((id) => {
      if (typeof id !== "string" || !/^\d:\d{1,2}:\d{1,2}$/.test(id))
        return false;
      const [r, x, y] = id.split(":").map(Number);
      return u.phaseDash && ROOMS[r]?.tiles[y]?.[x] === 4;
    })
  )
    return null;
  if (
    typeof raw.completed !== "boolean" ||
    raw.completed !== raw.defeated.includes("5:2")
  )
    return null;
  return {
    ...freshSession(),
    room: raw.room,
    score: nonnegative(raw.score),
    upgrades: { doubleJump: u.doubleJump, phaseDash: u.phaseDash },
    visited: [...new Set(raw.visited)],
    defeated: [...new Set(raw.defeated)],
    broken: [...new Set(raw.broken)],
    deaths: nonnegative(raw.deaths),
    playtime:
      raw.version === 1
        ? nonnegative(raw.playtime) / 60
        : nonnegative(raw.playtime),
    completed: raw.completed,
  };
}
export class StorageManager {
  constructor(storage) {
    this.storage = storage;
    this.available = true;
    this.records = { highScore: 0, level: 0 };
    this.settings = { mute: false, volume: 0.55, reducedMotion: false };
    const r = this.read(KEYS.records);
    if (r) {
      this.records.highScore = nonnegative(r.highScore);
      this.records.level = Math.min(5, nonnegative(r.level));
    }
    const s = this.read(KEYS.settings);
    if (s) {
      this.settings.mute = s.mute === true;
      this.settings.volume = Number.isFinite(s.volume)
        ? Math.max(0, Math.min(1, s.volume))
        : 0.55;
      this.settings.reducedMotion = s.reducedMotion === true;
    }
  }
  read(key) {
    try {
      const s = this.storage?.getItem(key);
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  }
  write(key, value) {
    try {
      if (!this.storage) throw Error("No storage");
      this.storage.setItem(key, JSON.stringify(value));
      this.available = true;
      return true;
    } catch {
      this.available = false;
      return false;
    }
  }
  load() {
    return (
      validateSession(this.read(KEYS.save)) ??
      validateSession(this.read("umbral-save-v1"))
    );
  }
  save(s) {
    this.record(s);
    return this.write(KEYS.save, s);
  }
  record(s) {
    const highScore = Math.max(this.records.highScore, nonnegative(s.score)),
      level = Math.max(this.records.level, s.room);
    if (highScore !== this.records.highScore || level !== this.records.level) {
      this.records = { highScore, level };
      this.write(KEYS.records, this.records);
    }
  }
  configure(patch) {
    Object.assign(this.settings, patch);
    this.write(KEYS.settings, this.settings);
  }
}
