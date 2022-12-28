// import { FBXLoader, THREE } from "../globals.js";

// class FbxModel extends THREE.Object3D {
//   static #RESOURCES_PATH = "resources";
//   static #fbxLoader = new FBXLoader()
//   #object;

//   constructor(
//     name,
//     scene,
//     position = new THREE.Vector3(0, 0, 0),
//     yRotation = 0,
//     scale = 1
//   ) {
//     super();
//     this.#load(`${FbxModel.#RESOURCES_PATH}/${name}`, position, yRotation, scale, scene);
//   }

//   get object() {
//     return this.#object;
//   }

//   #load(path, position, yRotation, scale, scene) {
//     FbxModel.#fbxLoader.load(path, (object) => {
//       object.position.copy(position);
//       object.rotation.y = yRotation;
//       object.scale.setScalar(scale);

//       object.traverse((child) => {
//         if (!child.isMesh) return;
//         child.material.shininess = 0;
//         child.castShadow = true;
//         child.receiveShadow = true;
//       });

//       this.#object = object;
//       scene.add(object);

//       console.log(object)
//     });
//   }
// }

// export class WinterThreePineTall extends FbxModel {
//   constructor(scene, position, yRotation, scale) {
//     super("Castle_W.fbx", scene, position, yRotation, scale)
//   }
// }
