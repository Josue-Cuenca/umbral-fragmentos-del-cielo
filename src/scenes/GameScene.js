import { Player } from "../objects/Player.js";
import { Enemy } from "../objects/Enemy.js";
import { InputManager } from "../managers/InputManager.js";
import { createPlatforms, oneWay } from "../physics/platforms.js";
export class GameScene extends Phaser.Scene {
  constructor() {
    super("Game");
  }
  init({ session, side = "left" }) {
    this.session = session;
    this.side = side;
    this.finishing = false;
    this.transitioning = false;
    this.frame = 0;
    this.gameTime = 0;
    this.shotsCreated = 0;
    this.collisions = 0;
    this.overlaps = 0;
  }
  create() {
    this.app = this.registry.get("app");
    this.app.session = this.session;
    this.audio = this.app.audio;
    this.room = this.cache.json.get("levels").rooms[this.session.room];
    this.zone = this.cache.json.get("levels").zones[this.room.zone];
    if (!this.session.visited.includes(this.session.room)) {
      this.session.visited.push(this.session.room);
      this.session.score += 100;
    }
    this.controls = new InputManager(this);
    this.physics.world.gravity.y = this.zone.gravity * 7200;
    this.physics.world.setBounds(0, -100, 1280, 680);
    this.background = this.add
      .tileSprite(0, 0, 640, 360, `background-${this.room.zone}`)
      .setOrigin(0)
      .setTileScale(2)
      .setScrollFactor(0)
      .setDepth(-20);
    this.terrain = createPlatforms(this, this.room, this.session);
    this.player = new Player(
      this,
      this.side === "right" ? 1164 : 80,
      388,
      this.room.zone,
    );
    this.enemies = this.physics.add.group({ runChildUpdate: false });
    this.room.enemies.forEach(([type, x, y], i) => {
      const id = `${this.session.room}:${i}`;
      if (!this.session.defeated.includes(id)) {
        const e = new Enemy(this, type, x * 2, y * 2, id);
        this.enemies.add(e);
        e.body.setAllowGravity(!["moth", "drone", "sentinel"].includes(type));
      }
    });
    this.shots = this.physics.add.group({
      defaultKey: "shot",
      allowGravity: false,
      maxSize: 80,
    });
    this.drops = this.physics.add.group({ allowGravity: false, maxSize: 30 });
    this.portals = this.physics.add.staticGroup();
    this.fx = this.add
      .particles(0, 0, "particle", {
        emitting: false,
        quantity: 0,
        lifespan: 400,
        speed: { min: 30, max: 170 },
        angle: { min: 0, max: 360 },
        gravityY: 100,
        maxParticles: 140,
        scale: { start: 1.6, end: 0 },
      })
      .setDepth(15);
    const collision = () => this.collisions++;
    this.physics.add.collider(this.player, this.terrain.solids, collision);
    this.physics.add.collider(
      this.player,
      this.terrain.platforms,
      collision,
      oneWay,
    );
    this.physics.add.collider(
      this.player,
      this.terrain.barriers,
      collision,
      (actor, tile) => {
        if (actor.dashing && this.session.upgrades.phaseDash) {
          this.breakTile(tile);
          return false;
        }
        return true;
      },
    );
    this.physics.add.collider(this.enemies, this.terrain.solids);
    this.physics.add.collider(
      this.enemies,
      this.terrain.platforms,
      null,
      oneWay,
    );
    this.physics.add.collider(this.enemies, this.terrain.barriers);
    for (const group of [
      this.terrain.solids,
      this.terrain.platforms,
      this.terrain.barriers,
    ])
      this.physics.add.collider(this.shots, group, (shot) =>
        this.retireShot(shot),
      );
    this.physics.add.overlap(this.player, this.enemies, (_, enemy) => {
      this.overlaps++;
      if (this.player.dashing && this.session.upgrades.phaseDash) {
        if (enemy.lastDash !== this.player.dashUntil) {
          enemy.lastDash = this.player.dashUntil;
          enemy.damage(3);
        }
      } else
        this.player.hurt(enemy.type === "boss" ? 2 : 1, enemy.body.center.x);
    });
    this.physics.add.overlap(this.shots, this.enemies, (shot, enemy) => {
      if (shot.active && !shot.hostile) {
        this.overlaps++;
        enemy.damage(6);
        this.retireShot(shot);
      }
    });
    this.physics.add.overlap(this.player, this.shots, (_, shot) => {
      if (shot.active && shot.hostile) {
        this.overlaps++;
        this.player.hurt(1, shot.body.center.x);
        this.retireShot(shot);
      }
    });
    this.physics.add.overlap(this.player, this.drops, (_, drop) => {
      this.overlaps++;
      this.player.ammo = Math.min(6, this.player.ammo + 2);
      drop.disableBody(true, true);
      this.audio.fx("save");
    });
    // Triggers are native Arcade overlap bodies, independent of decoration sprites.
    this.add
      .image(
        this.room.checkpoint * 2 - 28,
        416 - 92,
        `shrine-${this.room.zone}`,
      )
      .setOrigin(0)
      .setScale(2);
    this.shrine = this.add.zone(this.room.checkpoint * 2, 388, 68, 74);
    this.physics.add.existing(this.shrine, true);
    this.shrineLit = false;
    this.physics.add.overlap(this.player, this.shrine, () => {
      if (!this.shrineLit) {
        this.overlaps++;
        this.rest();
      }
    });
    if (this.session.room > 0) this.addPortal(40, -1);
    if (this.session.room < 5) this.addPortal(1214, 1);
    const upgrade = this.room.upgrade;
    if (upgrade && !this.session.upgrades[upgrade.id]) {
      this.upgrade = this.physics.add
        .sprite(upgrade.x * 2, upgrade.y * 2, `upgrade-${this.room.zone}`)
        .setScale(2);
      this.upgrade.body.setAllowGravity(false);
      this.tweens.add({
        targets: this.upgrade,
        y: this.upgrade.y - 8,
        yoyo: true,
        repeat: -1,
        duration: 900,
      });
      this.physics.add.overlap(this.player, this.upgrade, () => {
        this.overlaps++;
        this.collect(upgrade.id);
      });
    }
    const cam = this.cameras.main;
    cam.setViewport(0, 0, 640, 360);
    cam.setBounds(0, 0, 1280, 480);
    cam.startFollow(this.player, true, 0.12, 0.1);
    cam.setDeadzone(70, 35);
    cam.fadeIn(180);
    this.audio.music(this.room.zone);
    this.save();
    this.scene.launch("HUD");
    this.app.announce(`${this.zone.name}. ${this.room.name}`);
    this.events.once("shutdown", () => {
      this.controls.clear();
      this.scene.stop("HUD");
    });
  }
  addPortal(x, direction) {
    this.add
      .image(x - 40, 388 - 96, `gate-${this.room.zone}`)
      .setOrigin(0)
      .setScale(2)
      .setFlipX(direction < 0);
    const zone = this.add.zone(x + 6, 386, 64, 82);
    this.physics.add.existing(zone, true);
    zone.direction = direction;
    this.portals.add(zone);
  }
  save() {
    this.app.storage.save(this.session);
  }
  burst(x, y, color, count = 10) {
    this.fx.setParticleTint(color);
    this.fx.explode(count, x, y);
  }
  breakTile(tile) {
    if (!tile.active) return;
    this.session.broken.push(tile.tileId);
    this.burst(tile.x + 16, tile.y + 16, 0x8bdee4, 12);
    tile.destroy();
    this.audio.fx("break");
    this.save();
  }
  rest() {
    this.shrineLit = true;
    this.player.hp = 5;
    this.player.ammo = 6;
    this.player.dashReadyAt = 0;
    this.audio.fx("save");
    this.save();
    this.toast("SANTUARIO", "Vida y cargas restauradas");
  }
  collect(id) {
    if (this.session.upgrades[id]) return;
    this.session.upgrades[id] = true;
    this.session.score += 500;
    this.player.hp = 5;
    this.player.ammo = 6;
    this.upgrade.disableBody(true, true);
    this.audio.fx("upgrade");
    this.burst(
      this.player.body.center.x,
      this.player.body.center.y,
      0x8bdee4,
      22,
    );
    this.save();
    this.toast(
      id === "doubleJump" ? "ALAS DEL ECO" : "DASH RESONANTE",
      id === "doubleJump"
        ? "Ahora puedes saltar otra vez en el aire"
        : "Dash atraviesa las barreras de cristal",
    );
  }
  toast(title, detail = "") {
    this.scene.get("HUD")?.notify?.(title, detail);
    this.app.announce(title + ". " + detail);
  }
  sword() {
    this.audio.fx("slash");
    const p = this.player,
      cx = p.body.center.x + p.face * 34,
      cy = p.body.center.y;
    const blade = this.add
      .arc(
        cx,
        cy,
        28,
        p.face > 0 ? -70 : 110,
        p.face > 0 ? 70 : 250,
        false,
        0xf0ca79,
        0.55,
      )
      .setDepth(14);
    this.tweens.add({
      targets: blade,
      alpha: 0,
      duration: 140,
      onComplete: () => blade.destroy(),
    });
    // A real Arcade hitbox lasts for this overlap query; damage is once per attack.
    const hitbox = this.add.zone(cx, cy, 56, 40);
    this.physics.add.existing(hitbox);
    hitbox.body.setAllowGravity(false);
    this.physics.overlap(hitbox, this.enemies, (_, enemy) => {
      this.overlaps++;
      enemy.damage(this.session.upgrades.phaseDash ? 5 : 4);
    });
    hitbox.destroy();
  }
  spawnShot(x, y, vx, vy, hostile) {
    const shot = this.shots.get(x, y, "shot");
    if (!shot) return;
    shot.enableBody(true, x, y, true, true);
    shot.body.setAllowGravity(false);
    shot
      .setScale(hostile ? 1 : 1.3)
      .setTint(hostile ? 0xcb7864 : 0xf0ca79)
      .setDepth(9);
    shot.body.setSize(8, 4);
    shot.setVelocity(vx, vy);
    shot.hostile = hostile;
    shot.expires = this.gameTime + 3000;
    this.shotsCreated++;
  }
  retireShot(shot) {
    shot.disableBody(true, true);
  }
  dropAmmo(x, y) {
    const drop = this.drops.get(x, y, `upgrade-${this.room.zone}`);
    if (drop) {
      drop.enableBody(true, x, y, true, true);
      drop.setScale(0.45).setDepth(7);
      drop.body.setAllowGravity(false);
      drop.body.setSize(24, 32);
      drop.expires = this.gameTime + 10000;
    }
  }
  interact() {
    if (this.physics.overlap(this.player, this.shrine)) {
      this.rest();
      return;
    }
    this.physics.overlap(this.player, this.portals, (_, portal) => {
      this.overlaps++;
      if (this.transitioning) return;
      const r = this.session.room;
      if (
        portal.direction === 1 &&
        ((r === 1 && !this.session.upgrades.doubleJump) ||
          (r === 3 && !this.session.upgrades.phaseDash))
      ) {
        this.toast(
          "EL UMBRAL ESPERA",
          "Encuentra la mejora luminosa de esta sala",
        );
        this.audio.fx("locked");
        return;
      }
      this.transitioning = true;
      this.session.room += portal.direction;
      this.save();
      this.scene.restart({
        session: this.session,
        side: portal.direction > 0 ? "left" : "right",
      });
    });
  }
  lose() {
    if (this.finishing) return;
    this.finishing = true;
    this.session.deaths++;
    this.save();
    this.audio.fx("death");
    this.physics.pause();
    this.time.delayedCall(150, () => {
      this.scene.stop("HUD");
      this.scene.pause();
      this.scene.launch("GameOver");
    });
  }
  win() {
    if (this.finishing) return;
    this.finishing = true;
    this.session.completed = true;
    this.save();
    this.audio.fx("victory");
    this.physics.pause();
    this.time.delayedCall(500, () => {
      this.scene.stop("HUD");
      this.scene.start("Victory");
    });
  }
  update(_time, delta) {
    this.gameTime += Math.min(delta, 100);
    const time = this.gameTime;
    this.frame++;
    if (this.finishing) return;
    this.session.playtime += Math.min(delta, 100) / 1000;
    const input = this.controls.sample();
    if (input.pausePressed) {
      this.app.pause();
      return;
    }
    this.player.updateControl(input, time);
    if (input.interactPressed) this.interact();
    if (this.player.body.y > 490) {
      this.player.invulnerableUntil = 0;
      this.player.dashUntil = 0;
      this.player.hurt(1, this.player.body.x);
      if (!this.finishing) {
        this.player.place(this.room.checkpoint * 2, 388);
        this.player.invulnerableUntil = time + 1500;
      }
    }
    this.enemies.children.iterate((enemy) => {
      if (enemy?.active) enemy.updateAI(time);
    });
    this.shots.children.iterate((shot) => {
      if (
        shot?.active &&
        (time > shot.expires ||
          shot.body.x < -30 ||
          shot.body.x > 1310 ||
          shot.body.y > 500 ||
          shot.body.y < -100)
      )
        this.retireShot(shot);
    });
    this.drops.children.iterate((drop) => {
      if (drop?.active && time > drop.expires) drop.disableBody(true, true);
    });
    this.background.tilePositionX = this.cameras.main.scrollX * 0.13;
    this.background.tilePositionY = this.cameras.main.scrollY * 0.03;
    if (this.frame % 300 === 0) this.save();
  }
}
