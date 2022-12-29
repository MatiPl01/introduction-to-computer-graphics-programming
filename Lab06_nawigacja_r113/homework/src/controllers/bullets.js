export default class BulletsController {
  static #BULLET_LIFETIME = 5000;
  #bullets = [];
  #scene;

  constructor(scene) {
    this.#scene = scene;
  }

  addBullet(bullet) {
    this.#scene.add(bullet);
    this.#bullets.push(bullet);
    setTimeout(() => {
      this.#bullets.splice(this.#bullets.findIndex(b => b === bullet), 1);
      this.#scene.remove(bullet);
    }, BulletsController.#BULLET_LIFETIME);
  }

  update(timeElapsed) {
    this.#bullets.forEach(bullet => {
      // bullet.position.z -= timeElapsed / 10;
    });
  }
}
