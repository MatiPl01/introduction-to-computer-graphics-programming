import { TextureLoader } from "./utils/loader.js";

export const COLORS = {
  white: 0xffffff,
  black: 0x00000,
}

export const MATERIALS = {
  phong: {
    white: new THREE.MeshPhongMaterial({
      color: COLORS.white,
      side: THREE.DoubleSide
    })
  }
};

export const TEXTURES = {
  crate: {
    light: {
      map: TextureLoader.load("crate/light/crate0_diffuse.png"),
      bumpMap: TextureLoader.load("crate/light/crate0_bump.png"),
      normalMap: TextureLoader.load("crate/light/crate0_normal.png"),
    },
    medium: {
      map: TextureLoader.load("crate/medium/crate1_diffuse.png"),
      bumpMap: TextureLoader.load("crate/medium/crate1_bump.png"),
      normalMap: TextureLoader.load("crate/medium/crate1_normal.png"),
    },
    dark: {
      map: TextureLoader.load("crate/dark/crate2_diffuse.png"),
      bumpMap: TextureLoader.load("crate/dark/crate2_bump.png"),
      normalMap: TextureLoader.load("crate/dark/crate2_normal.png"),
    }
  }
};
