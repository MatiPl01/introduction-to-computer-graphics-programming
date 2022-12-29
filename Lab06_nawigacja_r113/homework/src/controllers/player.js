import { FPVCamera } from "./camera.js";
import BulletsController from "./bullets.js";
import { WEAPONS } from "../models/player.js";

export class PlayerController {
  #bulletsController;
  #mouseInputController;
  #player;
  #fpvCamera;

  constructor(scene, player, keyboardInputController, mouseInputController) {
    this.#bulletsController = new BulletsController(scene);
    this.#mouseInputController = mouseInputController;
    this.#player = player;
    this.#fpvCamera = new FPVCamera(
      player,
      keyboardInputController,
      mouseInputController
    );

    mouseInputController.addObserver(this);
    scene.add(this.#fpvCamera);
  }

  get fpvCamera() {
    return this.#fpvCamera;
  }

  update(timeElapsed, totalTimeElapsed) {
    const mouse = this.#mouseInputController.mouse;
    this.#fpvCamera.update(timeElapsed);
    this.#player.update(totalTimeElapsed);
    this.#bulletsController.update(timeElapsed);
    if (this.#player.recoilFinished) this.#handleMousePressed(mouse);
  }

  notifyMouseEvent(mouse) {
    this.#handleMousePressed(mouse);
  }

  #handleMousePressed({ left }) {
    if (left) {
      switch (this.#player.currentWeapon) {
        case WEAPONS.knife:
          // TODO
          break;
        case WEAPONS.rifle:
        case WEAPONS.pistol:
          this.#shot();
          break;
      }
    }
  }

  #shot() {
    const { ammo, model } = this.#player.weapons[this.#player.currentWeapon];
    const position = model.position.clone();
    position.addScaledVector(this.#fpvCamera.direction, 10)
    const bullet = new THREE.Mesh(
      new THREE.SphereGeometry(1, 10, 10),
      new THREE.MeshBasicMaterial(0xffffff)
    )
    bullet.position.copy(position);
    this.#bulletsController.addBullet(bullet);
    this.#player.applyRecoil();
  }
}
