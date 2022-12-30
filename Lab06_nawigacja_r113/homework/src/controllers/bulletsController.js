import { CONFIG } from "../constants.js";

export default class BulletsController {
  static #MAX_DISTANCE = CONFIG.planeSize;
  #bullets = [];
  #scene;

  constructor(scene) {
    this.#scene = scene;
  }

  addBullet(bullet) {
    this.#scene.add(bullet);
    this.#bullets.push(bullet);
  }

  update(timeElapsed) {
    this.#bullets.forEach(bullet => {
      bullet.update(timeElapsed);
      if (bullet.position.distanceTo(bullet.startPosition) >= BulletsController.#MAX_DISTANCE) {
        this.#removeBullet(bullet);
      }
    });
  }

  #removeBullet(bullet) {
    this.#bullets.splice(this.#bullets.findIndex(b => b === bullet), 1);
    this.#scene.remove(bullet);
  }
}
