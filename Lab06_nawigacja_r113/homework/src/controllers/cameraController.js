import GravityController from "./gravityController.js";

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
    player.yawObject = this.#yawObject;
    this.add(this.#yawObject);
  }

  get yawObject() {
    return this.#yawObject;
  }

  get pitchObject() {
    return this.#pitchObject;
  }

  get direction() {
    const direction = new THREE.Vector3(0, 0, -1);
    const rotation = new THREE.Euler(0, 0, 0, "YXZ");
    rotation.set(this.#pitchObject.rotation.x, this.#yawObject.rotation.y, 0);
    const result = new THREE.Vector3();
    result.copy(direction).applyEuler(rotation);
    return result;
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
      if (keys.forward) {
        if (this.left === this.right) velocity.z -= timeElapsed / 2;
        else velocity.z -= timeElapsed / 4;
      };
      if (keys.backward) {
        if (this.left === this.right) velocity.z += timeElapsed / 2;
        else velocity.z += timeElapsed / 4;
      }
      if (keys.left) {
        if (this.forward === this.backward) velocity.x -= timeElapsed / 2;
        else velocity.x -= timeElapsed / 4;
      }
      if (keys.right) {
        if (this.forward === this.backward) velocity.x += timeElapsed / 2;
        else velocity.x += timeElapsed / 4;
      };
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
