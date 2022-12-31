export const WEAPONS = Object.freeze({
  rifle: 'rifle',
  pistol: 'pistol',
  knife: 'knife'
});

export default class Player {
  #camera;
  #crosshair;
  #height;
  #weapons;
  #currentWeapon;
  #weaponY;
  #weaponZ;
  #yawObject;
  #animationStartTime;
  #shootingEnabled = false
  #applyRecoil = false;
  #recoilFinished = true;
  #startAttack = false;
  #recoilEnding = false;
  #attackFinished = true;
  #attackEnding = false;

  constructor(camera, crosshair, height) {
    this.#camera = camera;
    this.#crosshair = crosshair;
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
    return this.#recoilFinished && this.#shootingEnabled;
  }

  get attackFinished() {
    return this.#attackFinished && this.#shootingEnabled;
  }

  enableShooting() {
    this.#shootingEnabled = true;
  }

  setWeapons(weapons) {
    this.#weapons = weapons;
    this.switchWeapon(WEAPONS.rifle);
  }

  switchWeapon(weaponType) {
    if (this.#currentWeapon) {
      this.#camera.remove(this.#weapons[this.#currentWeapon].model);
    }
    const { model, position } = this.#weapons[weaponType];
    this.#currentWeapon = weaponType;
    this.#camera.add(model);

    model.rotation.y = Math.PI;
    model.position.copy(position);
    this.#weaponY = model.position.y;
    this.#weaponZ = model.position.z;

    if (weaponType === WEAPONS.knife) {
      model.rotation.x = -Math.PI / 12;
    }
  }

  update(totalTimeElapsed) {
    if (!this.#currentWeapon) return;
    const { model } = this.#weapons[this.#currentWeapon];


    model.position.y = this.#weaponY + Math.sin(
      totalTimeElapsed +
      this.#yawObject.position.x,
      this.#yawObject.position.z
    ) / 15;

    const delta = totalTimeElapsed - this.#animationStartTime;
    if (this.#currentWeapon === WEAPONS.knife) {
      if (this.#startAttack) {
        this.#animationStartTime = totalTimeElapsed;
        this.#startAttack = false;
      } else if (!this.#attackFinished) {
        model.rotation.z = Math.sin(5 * delta) / 4;
        model.rotation.x = -Math.PI / 12 - Math.sin(5 * delta) * 1.5;
        model.rotation.y = Math.cos(5 * delta - 2) / 2;
        model.position.z = this.#weaponZ - Math.sin(5 * delta) / 2;
        model.position.y = this.#weaponY - Math.sin(5 * delta) / 4;

        if (model.position.z < this.#weaponZ) this.#attackEnding = true;
        else if (this.#attackEnding && model.position.z >= this.#weaponZ) {
          this.#attackFinished = true;
          model.rotation.z = 0;
          model.rotation.x = -Math.PI / 12;
          model.rotation.y = 0;
          model.position.z = this.#weaponZ;
          model.position.y = this.#weaponY;
        }
      }
    } else {
      if (this.#applyRecoil) {
        this.#crosshair.classList.add('shot');
        this.#applyRecoil = false;
        this.#animationStartTime = totalTimeElapsed;
      } else if (!this.#recoilFinished) {
        const { shootingFrequency } = this.#weapons[this.#currentWeapon]
        const deltaZ = Math.sin(delta * shootingFrequency) / 10;
        model.position.z = this.#weaponZ + deltaZ;

        if (deltaZ < 0) this.#recoilEnding = true;
        else if (this.#recoilEnding && deltaZ >= 0) {
          this.#recoilFinished = true;
          model.position.z = this.#weaponZ;
          this.#crosshair.classList.remove('shot');
        }
      }
    }
  }

  applyRecoil() {
    this.#crosshair.classList.remove('shot');
    this.#applyRecoil = true;
    this.#recoilEnding = false;
    this.#recoilFinished = false;
  }

  attack() {
    this.#startAttack = true;
    this.#attackEnding = false;
    this.#attackFinished = false;
  }
}
