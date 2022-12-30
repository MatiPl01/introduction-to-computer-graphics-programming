import { TextureLoader } from "./utils/loaders.js";

export const CONFIG = Object.freeze({
  planeSize: 100,
  campfireSize: 20,
  tentsCount: 6,
  randomPebblesCount: 1000
});

export const COLORS = Object.freeze({
  white: 0xffffff,
  black: 0x000000,
  green: 0x005425,
  lightRed: 0xffcccc
});

export const MATERIALS = Object.freeze({
  phong: {
    green: new THREE.MeshPhongMaterial({
      color: COLORS.green,
      side: THREE.DoubleSide
    })
  }
});

const loadSkyBox = (path, extension) => Object.fromEntries(
  ["front", "back", "bottom", "top", "left", "right"].map((side) => [
    side,
    TextureLoader.load(`${path}_${side}.${extension}`)
  ])
);

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
  },
  skyBox: loadSkyBox('skybox/clouds', 'jpg')
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
  uziGold: 'uziGold'
});

export const WITHOUT_SHADOW = [
  'knifeSharp',
  'pistol',
  'uziGold'
];
