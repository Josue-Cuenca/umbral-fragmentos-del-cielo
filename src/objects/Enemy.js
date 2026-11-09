const HEALTH = {
  crawler: 10,
  moth: 10,
  hopper: 14,
  sentinel: 14,
  drone: 14,
  lancer: 18,
  boss: 72,
};
export class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, type, x, y, id) {
    super(scene, x - 36, y - 40, `${type}-${scene.room.zone}`, 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setOrigin(0).setScale(2).setDepth(8);
    this.type = type;
    this.enemyId = id;
    this.hp = this.maxHp = HEALTH[type];
    this.homeX = x;
    this.homeY = y;
    this.face = -1;
    this.nextAttack = scene.gameTime + 900;
    this.nextJump = scene.gameTime + 1300;
    this.phase = 0;
    this.body
      .setSize(type === "boss" ? 28 : 12, type === "boss" ? 30 : 14)
      .setOffset(18, 20)
      .setMaxVelocity(500, 760);
    this.body.updateFromGameObject();
    if (["moth", "drone", "sentinel"].includes(type))
      this.body.setAllowGravity(false);
  }
  updateAI(now) {
    if (!this.active) return;
    const g = this.scene,
      p = g.player,
      dx = p.body.center.x - this.body.center.x,
      near = Math.abs(dx) < 440,
      angry = this.hp <= this.maxHp * 0.3,
      rage = angry ? 1.45 : 1;
    this.face = dx < 0 ? -1 : 1;
    this.setFlipX(this.face > 0);
    this.setFrame(Math.floor(now / 180) % 4);
    if (this.type === "moth" || this.type === "drone") {
      const chase = near && Math.floor(now / 1400) % 3 === 2;
      const tx = chase ? p.body.x : this.homeX + Math.sin(now * 0.0015) * 65,
        ty = chase ? p.body.y : this.homeY + Math.sin(now * 0.0024) * 18;
      this.setVelocity(
        Phaser.Math.Clamp((tx - this.body.x) * 2, -150 * rage, 150 * rage),
        Phaser.Math.Clamp((ty - this.body.y) * 2, -120, 120),
      );
      if (this.type === "drone" && near && now > this.nextAttack) {
        this.nextAttack = now + 1500 / rage;
        this.fire(p.body.center.x, p.body.center.y, 230);
      }
    } else if (this.type === "sentinel") {
      this.setVelocityY(Math.cos(now * 0.002) * 20);
      if (near && now > this.nextAttack) {
        this.nextAttack = now + 1700 / rage;
        this.fire(p.body.center.x, p.body.center.y, 210);
      }
    } else if (this.type === "boss") {
      if (!near && this.phase === 0) return;
      this.phase = 1;
      this.setVelocityX(this.body.velocity.x * 0.9);
      if (now > this.nextAttack) {
        this.nextAttack = now + (angry ? 900 : 1500);
        for (let n = -2; n <= 2; n++)
          this.fire(p.body.center.x, p.body.center.y, 195 * rage, n * 0.22);
      }
      if (this.body.blocked.down && now > this.nextJump) {
        this.nextJump = now + 2400 / rage;
        this.setVelocity(this.face * 210, -650);
      }
    } else {
      if (this.type === "crawler")
        this.setVelocityX(
          (angry && near ? this.face : Math.sin(now * 0.0009) > 0 ? 1 : -1) *
            66 *
            rage,
        );
      if (
        this.type === "hopper" &&
        this.body.blocked.down &&
        now > this.nextJump
      ) {
        this.nextJump = now + 1400 / rage;
        this.setVelocity(this.face * 150, -576);
      }
      if (this.type === "lancer")
        this.setVelocityX(
          near && now % 2000 > 1100 ? this.face * 240 * rage : 0,
        );
      if (this.body.blocked.left || this.body.blocked.right)
        this.setVelocityX(-this.body.velocity.x);
    }
    if (this.body.y > 500) {
      this.setPosition(this.homeX - 36, this.homeY - 40);
      this.body.updateFromGameObject();
      this.setVelocity(0);
    }
  }
  fire(x, y, speed, offset = 0) {
    const a =
      Phaser.Math.Angle.Between(this.body.center.x, this.body.center.y, x, y) +
      offset;
    this.scene.spawnShot(
      this.body.center.x,
      this.body.center.y,
      Math.cos(a) * speed,
      Math.sin(a) * speed,
      true,
    );
  }
  damage(amount) {
    if (!this.active || this.scene.finishing) return;
    this.hp = Math.max(0, this.hp - amount);
    this.setTintFill(0xf0e5cf);
    this.scene.time.delayedCall(80, () => {
      if (this.active) this.clearTint();
    });
    this.scene.audio.fx("hit");
    if (this.hp === 0) {
      const g = this.scene,
        x = this.body.center.x,
        y = this.body.center.y;
      g.session.defeated.push(this.enemyId);
      g.session.score += this.type === "boss" ? 2000 : 200;
      g.burst(x, y, 0xf0ca79, 20);
      g.audio.fx("kill");
      g.dropAmmo(x, y);
      this.disableBody(true, true);
      g.save();
      if (this.type === "boss") g.win();
    }
  }
}
