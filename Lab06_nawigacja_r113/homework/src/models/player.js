export default class Player {
  #camera;
  #height;

  constructor(camera, height) {
    this.#camera = camera;
    this.#height = height;
  }

  get camera() {
    return this.#camera;
  }

  get height() {
    return this.#height;
  }
}
