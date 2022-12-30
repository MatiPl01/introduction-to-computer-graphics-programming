import { Bullet } from "../models/bullet.js";

export class BulletFactory {
  static createFromWeapon({ ammo, ammoOffset, ammoVelocity: velocity, model: weapon }, fpvCamera) {
    // Set position
    const bullet = ammo.clone();
    const innerWrapper = new THREE.Object3D();
    const outerWrapper = new THREE.Object3D();
    innerWrapper.add(bullet);
    outerWrapper.add(innerWrapper);
    outerWrapper.position.copy(fpvCamera.yawObject.position);
    bullet.position.copy(weapon.position);
    bullet.position.add(ammoOffset);

    // Set rotation
    outerWrapper.rotation.y = fpvCamera.yawObject.rotation.y;
    innerWrapper.rotation.x = fpvCamera.pitchObject.rotation.x;
    bullet.rotation.x = -Math.PI / 2;

    // Calculate velocity
    const velocityVector = fpvCamera.direction.clone();
    velocityVector.multiplyScalar(velocity);

    return new Bullet(outerWrapper, velocityVector);
  }
}
