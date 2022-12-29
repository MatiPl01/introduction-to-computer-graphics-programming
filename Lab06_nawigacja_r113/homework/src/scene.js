import { COLORS, MATERIALS, OBJECT, WITHOUT_SHADOW } from './constants.js';
import { KeyboardInputController, MouseInputController } from './controllers/input.js';
import FullScreenController from './controllers/fullscreen.js';
import { PlayerController } from './controllers/player.js';
import { DarkCrate, LightCrate, MediumCrate } from './models/crates.js';
import { ObjLoader } from './utils/loaders.js';

// TODO - improve shadows quality
// TODO - fix textures loading (missing sides)
// TODO - add gun switching
// TODO - create environment
// TODO - fix ammo not working
export default class Scene extends THREE.Scene {
  #keyboardInputController = new KeyboardInputController();
  #mouseInputController = new MouseInputController();
  #objLoader = new ObjLoader(
    Object.values(OBJECT),
    WITHOUT_SHADOW,
    this.#handleObjectsLoaded.bind(this)
  );
  #fullScreenController;
  #playerController;
  #player;
  #canvas;
  #onLoadFinished;

  constructor(player, canvas, onLoadFinished) {
    super();

    this.#canvas = canvas;
    this.#player = player;
    this.#onLoadFinished = onLoadFinished;

    this.#fullScreenController = new FullScreenController(canvas);
    this.#playerController = new PlayerController(
      this,
      this.#player,
      this.#keyboardInputController,
      this.#mouseInputController
    );
    this.#fullScreenController.addObserver(this);
  }

  get canvas() {
    return this.#canvas;
  }

  get player() {
    return this.#player;
  }

  get objLoader() {
    return this.#objLoader;
  }

  initialize() {
    this.#renderPlane();
    this.#objLoader.load();
    this.#fullScreenController.initialize();
  }

  update(timeElapsed, totalTimeElapsed) {
    this.#playerController.update(timeElapsed, totalTimeElapsed);
  }

  notifyFullScreenChange(isFullScreen) {
    const fpvCamera = this.#playerController.fpvCamera;
    if (isFullScreen) fpvCamera.enable();
    else fpvCamera.disable();
  }

  #renderPlane() {
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(25, 25, 25, 25),
      MATERIALS.phong.white
    );
    plane.rotation.x = -0.5 * Math.PI;
    plane.receiveShadow = true;
    this.add(plane);
  }

  #renderObjects() {
    const objLoader = this.#objLoader;

    // Add Three.js objects
    this.add(new LightCrate(3, new THREE.Vector3(-5, 1.5, -5)));
    this.add(new MediumCrate(3, new THREE.Vector3(5, 1.5, -5)));
    this.add(new DarkCrate(3, new THREE.Vector3(5, 1.5, 5)));

    // Add loaded objects
    // this.add(objLoader.get(OBJECT.uziGoldLongSilencer, 50, new THREE.Vector3(0, 2, -5)));
  }

  #renderLights() {
    const ambientLight = new THREE.AmbientLight(COLORS.white, .2);
    this.add(ambientLight);

    const spotLight = new THREE.SpotLight(COLORS.white, 1, 100, Math.PI / 4);
    spotLight.shadow.camera.radius = 10;
    spotLight.shadow.camera.left = -1000;
    spotLight.shadow.camera.top = 1000;
    spotLight.shadow.camera.right = 1000;
    spotLight.shadow.camera.bottom = -1000;
    spotLight.shadow.mapSize.width = spotLight.shadow.mapSize.height = 4096;
    spotLight.position.set(15, 30, 15);
    spotLight.castShadow = true;
    this.add(spotLight);
  }

  #handleObjectsLoaded() {
    this.#renderObjects();
    this.#renderLights();
    this.#onLoadFinished(this);
  }
}
