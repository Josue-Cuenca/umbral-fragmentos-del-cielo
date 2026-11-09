import { tileAt } from "../src/data/world.js";
export function explorerInput(g) {
  const p = g.player,
    room = g.world,
    u = room.upgrade;
  if (g.room === 5 && p.hp <= 2) {
    return {
      left: p.x > 66,
      right: p.x < 61,
      jump: false,
      attackPressed: p.attackCooldown === 0,
      dashPressed: p.x > 120 && p.dashCooldown === 0,
      interactPressed: p.x < 90,
    };
  }
  const target = u && !g.upgrades[u.id] ? u.x : 610;
  let dir = target > p.x + 5 ? 1 : target < p.x - 5 ? -1 : 0;
  const i = { right: dir > 0, left: dir < 0, jump: true };
  const enemies = g.enemies.filter((e) => !e.dead && Math.abs(e.y - p.y) < 26);
  const nearest = enemies.sort(
    (a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x),
  )[0];
  if (nearest && Math.abs(nearest.x - p.x) < 65) {
    i.attackPressed = p.attackCooldown === 0;
    if (Math.abs(nearest.x - p.x) < 100 && p.ammo && p.shootCooldown === 0)
      i.shootPressed = true;
  }
  const foot = Math.floor((p.y + p.h + 2) / 16),
    ahead = Math.floor((p.x + 5 + dir * 20) / 16);
  const obstacle = tileAt(room, ahead, Math.floor((p.y + 7) / 16));
  const gap = !tileAt(room, ahead, foot);
  if (
    p.grounded &&
    (gap ||
      obstacle ||
      g.tick % 40 === 0 ||
      (u && !g.upgrades[u.id] && Math.abs(u.x - p.x) < 60))
  )
    i.jumpPressed = true;
  if (
    !p.grounded &&
    g.upgrades.doubleJump &&
    !p.airJump &&
    p.vy > -0.3 &&
    (gap || p.y > 184 || (u && !g.upgrades[u.id] && Math.abs(u.x - p.x) < 40))
  )
    i.jumpPressed = true;
  if (obstacle === 4 && g.upgrades.phaseDash && p.dashCooldown === 0)
    i.dashPressed = true;
  if (
    p.y > 175 &&
    !p.grounded &&
    gap &&
    p.dashCooldown === 0 &&
    Math.abs(target - p.x) > 35
  )
    i.dashPressed = true;
  if (p.x > 598 && p.y > 170) i.interactPressed = true;
  const boss = g.enemies.find((e) => e.type === "boss" && !e.dead);
  if (boss && g.room === 5 && p.x > 310) {
    const dx = boss.x - p.x;
    i.right = dx > 20;
    i.left = dx < -20;
    i.attackPressed = p.attackCooldown === 0;
    i.shootPressed =
      p.ammo > 0 && p.shootCooldown === 0 && Math.abs(boss.y - p.y) < 28;
    if (p.grounded && Math.abs(dx) < 70) i.jumpPressed = true;
    if (Math.abs(dx) < 30 && p.dashCooldown === 0) i.dashPressed = true;
  }
  return i;
}

// Observe native Arcade bodies; the explorer only emits ordinary controller actions.
export function snapshot(scene) {
  const p = scene.player,
    now = scene.gameTime,
    s = scene.session;
  return {
    room: s.room,
    world: scene.room,
    upgrades: s.upgrades,
    tick: Math.floor(s.playtime * 60),
    enemies: scene.enemies
      .getChildren()
      .map((e) => ({
        type: e.type,
        dead: !e.active,
        x: e.body.x / 2,
        y: e.body.y / 2,
      })),
    player: {
      x: p.body.x / 2,
      y: p.body.y / 2,
      w: p.body.width / 2,
      h: p.body.height / 2,
      vx: p.body.velocity.x / 120,
      vy: p.body.velocity.y / 120,
      hp: p.hp,
      grounded: p.grounded,
      airJump: p.airJump,
      face: p.face,
      ammo: p.ammo,
      dashCooldown: Math.max(0, p.dashReadyAt - now),
      attackCooldown: Math.max(0, p.attackReadyAt - now),
      shootCooldown: Math.max(0, p.shootReadyAt - now),
    },
  };
}
