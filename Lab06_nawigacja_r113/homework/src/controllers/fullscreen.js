export default class FullScreenController {
  #canvas;
  #isFullScreen = false;

  #observers = [];

  constructor(canvas) {
    this.#canvas = canvas;
  }

  addObserver(observer) {
    this.#observers.push(observer);
  }

  initialize() {
    this.#canvas.addEventListener("click", this.#handleClick.bind(this));
    document.addEventListener(
      "pointerlockchange",
      this.#handlePointerLockChange.bind(this)
    );
    document.addEventListener(
      "mozpointerlockchange",
      this.#handlePointerLockChange.bind(this)
    );
  }

  hasPointerLock() {
    return [document.pointerLockElement, document.mozPointerLockElement, document.webkitPointerLockElement].some(e => e === this.#canvas);
  }

  #handleClick() {
    if (!this.hasPointerLock()) this.#canvas.requestPointerLock();
  }

  #handlePointerLockChange() {
    this.#isFullScreen = !this.#isFullScreen;
    this.#notifyObservers();
  }

  #notifyObservers() {
    this.#observers.forEach((observer) => {
      observer.notifyFullScreenChange(this.#isFullScreen);
    });
  }
}
