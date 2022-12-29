export const WEAPONS = Object.freeze({
  rifle: 'rifle',
  pistol: 'pistol',
  knife: 'knife'
});

export default class Player {
  #camera;
  #height;
  #weapons;
  #currentWeapon;
  #weaponObject;
  #weaponY;
  #weaponZ;
  #yawObject;
  #recoilStartTime;
  #applyRecoil = false;
  #recoilFinished = true;
  #recoilEnding = false;

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

  get weapons() {
    return this.#weapons;
  }

  get currentWeapon() {
    return this.#currentWeapon;
  }

  set yawObject(yawObject) {
    this.#yawObject = yawObject;
  }

  get recoilFinished() {
    return this.#recoilFinished;
  }

  setWeapons(weapons) {
    this.#weapons = weapons;
    this.switchWeapon(WEAPONS.rifle)
  }

  switchWeapon(weaponType) {
    const { model, position } = this.#weapons[weaponType];
    this.#currentWeapon = weaponType;
    this.#weaponObject = model;

    model.rotation.y = -Math.PI;
    model.position.copy(position);
    this.#weaponY = model.position.y;
    this.#weaponZ = model.position.z;

    if (weaponType === WEAPONS.knife) {
      model.rotation.x = -Math.PI / 12;
    }

    this.#camera.add(model);
  }

  update(totalTimeElapsed) {
    const model = this.#weaponObject;
    if (!model) return;

    model.position.y = this.#weaponY + Math.sin(
      totalTimeElapsed +
      this.#yawObject.position.x / 3 +
      this.#yawObject.position.z / 3
    ) / 15;

    if (this.#applyRecoil) {
      this.#applyRecoil = false;
      this.#recoilStartTime = totalTimeElapsed;
    } else if (!this.#recoilFinished) {
      const delta = totalTimeElapsed - this.#recoilStartTime;
      const deltaZ = Math.sin(delta * 50) / 10;
      model.position.z = this.#weaponZ + deltaZ;

      if (deltaZ < 0) this.#recoilEnding = true;
      else if (this.#recoilEnding && deltaZ >= 0) {
        this.#recoilFinished = true;
        model.position.z = this.#weaponZ;
      }
    }
  }

  applyRecoil() {
    this.#applyRecoil = true;
    this.#recoilEnding = false;
    this.#recoilFinished = false;
  }
}
