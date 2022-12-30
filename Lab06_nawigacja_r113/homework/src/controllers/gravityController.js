export default class GravityController {
  static #instance = new this();
  #gravity = 10;

  static getInstance() {
    return GravityController.#instance;
  }

  set gravity(gravity) {
    this.#gravity = gravity;
  }

  get gravity() {
    return this.#gravity;
  }
}
