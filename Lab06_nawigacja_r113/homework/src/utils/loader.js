export class TextureLoader {
  static #TEXTURES_DIR_PATH = "resources/textures";
  static #loader = new THREE.TextureLoader();

  static load(path) {
    return TextureLoader.#loader.load(`${TextureLoader.#TEXTURES_DIR_PATH}/${path}`);
  }
}
