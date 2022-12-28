import { FPVCamera } from "./camera.js";

export class PlayerController {
  #player;
  #fpvCamera;
  #keyboardInputController;
  #mouseInputController;

  constructor(scene, player, keyboardInputController, mouseInputController) {
    this.#player = player;
    this.#fpvCamera = new FPVCamera(
      player,
      keyboardInputController,
      mouseInputController
    );
      
    this.#keyboardInputController = keyboardInputController;
    this.#mouseInputController = mouseInputController;
    
    scene.add(this.#fpvCamera);
  }

  get fpvCamera() {
    return this.#fpvCamera;
  }

  update(timeElapsed) {
    this.#fpvCamera.update(timeElapsed);
  }
}
