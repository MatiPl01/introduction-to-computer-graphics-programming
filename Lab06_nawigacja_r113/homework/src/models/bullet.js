export class Bullet extends THREE.Object3D {
  #velocity;
  #startPosition;

  constructor(model, velocity) {
    super();
    this.#velocity = velocity;
    this.position.copy(model.position);
    model.position.set(0, 0, 0);
    this.#startPosition = this.position.clone();
    this.add(model);
  }

  get startPosition() {
    return this.#startPosition;
  }

  update(timeElapsed) {
    const distance = this.#velocity.clone();
    distance.multiplyScalar(timeElapsed);
    this.position.add(distance);
  }
}
