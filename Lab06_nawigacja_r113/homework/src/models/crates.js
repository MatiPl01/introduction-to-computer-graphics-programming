import { TEXTURES } from "../constants.js";

class Crate extends THREE.Mesh {
  constructor(material, size, position) {
    super(
      new THREE.BoxGeometry(size, size, size),
      material
    )

    this.receiveShadow = true;
    this.castShadow = true;

    if (position) this.position.copy(position);
  }
};

const createMaterial = (brightness) => {
  return new THREE.MeshPhongMaterial({
    map: TEXTURES.crate[brightness].map,
    bumpMap: TEXTURES.crate[brightness].bumpMap,
    normalMap: TEXTURES.crate[brightness].normalMap
  });
}

export class LightCrate extends Crate {
  constructor(size, position) {
    super(createMaterial('light'), size, position);
  }
}

export class MediumCrate extends Crate {
  constructor(size, position) {
    super(createMaterial('medium'), size, position);
  }
}

export class DarkCrate extends Crate {
  constructor(size, position) {
    super(createMaterial('dark'), size, position);
  }
}
