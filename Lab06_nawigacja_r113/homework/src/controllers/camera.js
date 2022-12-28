import GravityController from "./gravity.js";

export class FPVCamera extends THREE.Object3D {
  #yawObject = new THREE.Object3D();
  #pitchObject = new THREE.Object3D();
  #velocity = new THREE.Vector3();
  #canJump = true;
  #enabled = false;

  #gravityController = GravityController.getInstance();
  #keyboardInputController;
  #player;

  constructor(player, keyboardInputController, mouseInputController) {
    super();
    const camera = player.camera;
    camera.rotation.set(0, 0, 0);
    mouseInputController.addObserver(this);
    keyboardInputController.addObserver(this);
    this.#player = player;
    this.#keyboardInputController = keyboardInputController;
    this.#pitchObject.add(camera);
    this.#yawObject.add(this.#pitchObject);
    this.add(this.#yawObject);
  }

  get yawObject() {
    return this.#yawObject;
  }

  enable() {
    this.#enabled = true;
  }

  disable() {
    this.#enabled = false;
  }

  update(timeElapsed) {
    const keys = this.#keyboardInputController.keys;
    const yawObject = this.#yawObject;
    const velocity = this.#velocity;

    velocity.x += (-velocity.x) * 4 * timeElapsed;
    velocity.z += (-velocity.z) * 4 * timeElapsed;
    velocity.y -= .25 * this.#gravityController.gravity * timeElapsed;

    if (this.#enabled) {
      if (keys.forward) velocity.z -= 1.5 * timeElapsed;
      if (keys.backward) velocity.z += 1.5 * timeElapsed;
      if (keys.left) velocity.x -= 1.5 * timeElapsed;
      if (keys.right) velocity.x += 1.5 * timeElapsed;
    }

    yawObject.translateX(velocity.x);
    yawObject.translateY(velocity.y);
    yawObject.translateZ(velocity.z);

    if (yawObject.position.y < this.#player.height) {
      velocity.y = 0;
      yawObject.position.y = this.#player.height;
      this.#canJump = true;
    }
  }

  notifyMouseEvent({ move }) {
    if (this.#enabled) this.#handleMouseMove(move);
  }

  notifyKeyboardEvent(keys) {
    if (this.#enabled) this.#handleKeyboardEvent(keys);
  }

  #handleMouseMove({ x: moveX, y: moveY }) {
    const pitchObject = this.#pitchObject;
    const yawObject = this.#yawObject;

    yawObject.rotation.y -= moveX * .002;
    pitchObject.rotation.x -= moveY * .002;
    pitchObject.rotation.x = Math.max(
      -Math.PI / 2,
      Math.min(Math.PI / 2, pitchObject.rotation.x)
    );
  }

  #handleKeyboardEvent({ space }) {
    if (space) {
      if (this.#canJump) {
        this.#velocity.y += .5;
        this.#canJump = false;
      }
    }
  }
}
