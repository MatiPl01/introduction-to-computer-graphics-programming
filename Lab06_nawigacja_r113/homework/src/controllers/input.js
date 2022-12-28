export class KeyboardInputController {
  #keys = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    space: false
  };
  #observers = [];

  constructor() {
    this.#init();
  }

  get keys() {
    return { ...this.#keys };
  }

  addObserver(observer) {
    this.#observers.push(observer)
  }

  removeObserver(observer) {
    const idx = this.#observers.findIndex(o => o === observer);
    if (idx < 0) return;
    this.#observers.splice(idx, 1);
  }

  #init() {
    document.addEventListener('keydown', this.#handleKeyDown.bind(this));
    document.addEventListener('keyup', this.#handleKeyUp.bind(this));
  }

  #handleKeyDown(e) {
    this.#handleKeyChange(e, true);
  }

  #handleKeyUp(e) {
    this.#handleKeyChange(e, false);
  }

  #handleKeyChange(e, isPressed) {
    switch (e.key) {
      case 'Down':
      case 'ArrowDown':
      case 's':
        this.#keys.backward = isPressed;
        break;
      case 'Up':
      case 'ArrowUp':
      case 'w':
        this.#keys.forward = isPressed;
        break;
      case 'Left':
      case 'ArrowLeft':
      case 'a':
        this.#keys.left = isPressed;
        break;
      case 'Right':
      case 'ArrowRight':
      case 'd':
        this.#keys.right = isPressed;
        break;
      case ' ':
        this.#keys.space = isPressed;
        break;
    }
    this.#notifyObservers();
  }

  #notifyObservers() {
    this.#observers.forEach(observer => {
      observer.notifyKeyboardEvent(this.#keys);
    })
  }
}

export class MouseInputController {
  #mouse = {
    move: {
      x: 0,
      y: 0
    },
    position: {
      x: 0,
      y: 0,
    },
    left: false,
    right: false
  }
  #observers = [];

  constructor() {
    this.#init();
  }

  get mouse() {
    return this.#mouse;
  }

  addObserver(observer) {
    this.#observers.push(observer)
  }

  removeObserver(observer) {
    const idx = this.#observers.findIndex(o => o === observer);
    if (idx < 0) return;
    this.#observers.splice(idx, 1);
  }

  #init() {
    document.addEventListener('mousemove', this.#handleMouseMove.bind(this));
    document.addEventListener('mousedown', this.#handleMouseDown.bind(this));
    document.addEventListener('mouseup', this.#handleMouseUp.bind(this));
  }

  #handleMouseMove(e) {
    this.#mouse.move.x = e.movementX;
    this.#mouse.move.y = e.movementY;
    this.#mouse.position.x = e.clientX;
    this.#mouse.position.y = e.clientY;
    this.#notifyObservers()
  }

  #handleMouseDown(e) {
    this.#handleMouseChange(e, true);
  }

  #handleMouseUp(e) {
    this.#handleMouseChange(e, false);
  }

  #handleMouseChange(e, isPressed) {
    switch (e.which) {
      case 1:
        this.#mouse.left = isPressed;
        break;
      case 3:
        this.#mouse.right = isPressed;
        break;
    }
    this.#notifyObservers()
  }

  #notifyObservers() {
    this.#observers.forEach(observer => {
      observer.notifyMouseEvent(this.#mouse);
    })
  }
}
