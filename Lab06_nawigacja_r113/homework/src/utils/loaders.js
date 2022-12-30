export class TextureLoader {
  static #TEXTURES_DIR_PATH = "resources/textures";
  static #loader = new THREE.TextureLoader();

  static load(path) {
    return TextureLoader.#loader.load(`${TextureLoader.#TEXTURES_DIR_PATH}/${path}`);
  }
}

export class ObjLoader extends THREE.MTLLoader {
  static DIR_PATH = "resources/obj";

  #fileNames;
  #noShadowFileNames;
  #meshes = {};
  #loadedCount = 0;
  #onLoadFinished;

  constructor(fileNames, noShadowFileNames, onLoadFinished) {
    super();
    this.#fileNames = fileNames;
    this.#onLoadFinished = onLoadFinished;
    this.#noShadowFileNames = new Set(noShadowFileNames);
  }

  load() {
    if (!this.#fileNames?.length) return this.#onLoadFinished();

    this.#fileNames.forEach(fileName => {
      super.load(`${ObjLoader.DIR_PATH}/${fileName}.mtl`, materials => {
        materials.preload();

        Object.values(materials.materials).forEach(material => {
          material.side = THREE.DoubleSide;
        })

        const objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);

        objLoader.load(`${ObjLoader.DIR_PATH}/${fileName}.obj`, mesh => {
          mesh.traverse(node => {
            if (node instanceof THREE.Mesh) {
              if (!this.#noShadowFileNames.has(fileName)) {
                node.castShadow = true;
              }
              node.receiveShadow = true;
            }
          })

          this.#meshes[fileName] = mesh;
          this.#loadedCount++;

          if (this.#loadedCount === this.#fileNames.length) {
            this.#onLoadFinished()
          }
        });
      })
    });
  }

  get(fileName, scale, position) {
    const mesh = this.#meshes[fileName].clone();
    if (scale) mesh.scale.set(scale, scale, scale);
    if (position) mesh.position.copy(position);
    return mesh;
  }
}
