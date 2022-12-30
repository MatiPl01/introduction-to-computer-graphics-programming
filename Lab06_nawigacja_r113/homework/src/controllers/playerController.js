import { FPVCamera } from "./cameraController.js";
import BulletsController from "./bulletsController.js";
import { WEAPONS } from "../models/player.js";
import { BulletFactory } from "../factory/bulletFactory.js";

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
    keyboardInputController.addObserver(this);
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
    this.#handleMousePressed(mouse);
  }

  notifyMouseEvent(mouse) {
    this.#handleMousePressed(mouse);
  }

  notifyKeyboardEvent(keys) {
    this.#handleKeyboardEvent(keys);
  }

  #handleMousePressed({ left }) {
    if (left) {
      switch (this.#player.currentWeapon) {
        case WEAPONS.knife:
          if (this.#player.attackFinished) this.#attack();
          break;
        case WEAPONS.rifle:
        case WEAPONS.pistol:
          if (this.#player.recoilFinished) this.#shot();
          break;
      }
    }
  }

  #handleKeyboardEvent(keys) {
    if (keys.weapon && this.#player.currentWeapon !== keys.weapon) {
      this.#player.switchWeapon(keys.weapon);
    }
  }

  #shot() {
    const bullet = BulletFactory.createFromWeapon(
      this.#player.weapons[this.#player.currentWeapon],
      this.#fpvCamera,
      25
    );

    this.#bulletsController.addBullet(bullet);
    this.#player.applyRecoil();
  }

  #attack() {
    this.#player.attack();
  }
}
