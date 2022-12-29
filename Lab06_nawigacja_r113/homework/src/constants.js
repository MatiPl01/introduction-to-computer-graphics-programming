import { TextureLoader } from "./utils/loaders.js";

export const COLORS = Object.freeze({
  white: 0xffffff,
  black: 0x00000,
});

export const MATERIALS = Object.freeze({
  phong: {
    white: new THREE.MeshPhongMaterial({
      color: COLORS.white,
      side: THREE.DoubleSide
    })
  }
});

export const TEXTURES = Object.freeze({
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
});

export const OBJECT = Object.freeze({
  treeTallDark: 'tree_tall_dark',
  treeTall: 'tree_tall',
  treeSmallDark: 'tree_small_dark',
  treeSmall: 'tree_small',
  treeSimple: 'tree_simple',
  treePlateau: 'tree_plateau',
  tentDetailedOpen: 'tent_detailedOpen',
  tentDetailedClosed: 'tent_detailedClosed',
  stoneTallF: 'stone_tallF',
  stoneTallG: 'stone_tallG',
  stoneTallH: 'stone_tallH',
  stoneTallI: 'stone_tallI',
  stoneTallJ: 'stone_tallJ',
  stoneSmallH: 'stone_smallH',
  stoneSmallI: 'stone_smallI',
  stoneSmallTopA: 'stone_smallTopA',
  stoneSmallTopB: 'stone_smallTopB',
  knifeSharp: 'knife_sharp',
  ammoPistol: 'ammo_pistol',
  pistol: 'pistol',
  ammoUzi: 'ammo_uzi',
  uziGoldLongSilencer: 'uziGoldLongSilencer'
});

export const WITHOUT_SHADOW = [
  'knifeSharp',
  'pistol',
  'uziGoldLongSilencer'
];
