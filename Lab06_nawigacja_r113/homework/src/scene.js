import { COLORS, MATERIALS, OBJECT, TEXTURES, WITHOUT_SHADOW, CONFIG } from './constants.js';
import { KeyboardInputController, MouseInputController } from './controllers/inputControllers.js';
import FullScreenController from './controllers/fullscreenController.js';
import { PlayerController } from './controllers/playerController.js';
import { ObjLoader } from './utils/loaders.js';
import { Random } from './utils/random.js';

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
    this.#renderSkyBox();
    this.#renderPlane();
    this.#objLoader.load();
    this.#fullScreenController.initialize();
    this.fog = new THREE.FogExp2(COLORS.lightRed, 0.005);
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
      new THREE.PlaneGeometry(CONFIG.planeSize, CONFIG.planeSize, CONFIG.planeSize / 2, CONFIG.planeSize / 2),
      MATERIALS.phong.green
    );
    plane.rotation.x = -0.5 * Math.PI;
    plane.receiveShadow = true;
    this.add(plane);
  }

  #renderSkyBox() {
    const size = 3 * CONFIG.planeSize;
    const skyBox = new THREE.Mesh(
      new THREE.BoxGeometry(size, size, size),
      new THREE.MeshFaceMaterial(
        ["right", "left", "top", "bottom", "front", "back"].map(
          (side) => {
            return new THREE.MeshBasicMaterial({
              map: TEXTURES.skyBox[side],
              side: THREE.DoubleSide,
            })
          }
        ))
    );
    skyBox.rotation.y = -Math.PI;
    this.add(skyBox);
  }

  #renderObjects() {
    const pebbles = [
      OBJECT.stoneSmallH,
      OBJECT.stoneSmallI,
      OBJECT.stoneSmallTopA,
      OBJECT.stoneSmallTopB
    ]

    const stones = [
      ...pebbles,
      OBJECT.stoneTallF,
      OBJECT.stoneTallG,
      OBJECT.stoneTallH,
      OBJECT.stoneTallI,
      OBJECT.stoneTallJ
    ];

    const tents = [
      OBJECT.tentDetailedClosed,
      OBJECT.tentDetailedOpen
    ];

    const trees = [
      OBJECT.treePlateau,
      OBJECT.treeSimple,
      OBJECT.treeSmall,
      OBJECT.treeSmallDark,
      OBJECT.treeTall,
      OBJECT.treeTallDark,
    ]

    // Generate environment
    this.#generateMountains(stones);
    this.#generateCampfire(tents);
    this.#generatePebbles(pebbles);
    this.#generateForest(trees);
    this.add(this.#objLoader.get(OBJECT.campfire, 2, new THREE.Vector3(0, 0, 0)));
  }

  #renderLights() {
    const ambientLight = new THREE.AmbientLight(COLORS.white, .5);
    this.add(ambientLight);

    const spotLight = new THREE.SpotLight(COLORS.white, .5, CONFIG.planeSize * 2, Math.PI / 3);
    spotLight.shadow.camera.radius = 10;
    spotLight.shadow.camera.left = -1000;
    spotLight.shadow.camera.top = 1000;
    spotLight.shadow.camera.right = 1000;
    spotLight.shadow.camera.bottom = -1000;
    spotLight.shadow.mapSize.width = spotLight.shadow.mapSize.height = 4096;
    spotLight.position.set(CONFIG.planeSize / 4, CONFIG.planeSize / 2, CONFIG.planeSize / 4);
    spotLight.castShadow = true;
    this.add(spotLight);
  }

  #handleObjectsLoaded() {
    this.#renderObjects();
    this.#renderLights();
    this.#onLoadFinished(this);
  }

  #generateMountains(types) {
    const h = CONFIG.planeSize / 2;
    for (let i = -h; i <= h; i += 5) {
      this.#generateStone(types, i + Math.random() - .5, Math.random() * 2 - h);
    }
    for (let i = -h; i <= h; i += 5) {
      this.#generateStone(types, i + Math.random() - .5, Math.random() * 2 + h);
    }
    for (let i = -h; i <= h; i += 5) {
      this.#generateStone(types, Math.random() * 2 - h, i + Math.random() - .5);
    }
    for (let i = -h; i <= h; i += 5) {
      this.#generateStone(types, Math.random() * 2 + h, i + Math.random() - .5);
    }
  }

  #generateStone(types, x, z) {
    const size = 20 + Math.random() * 20;
    const type = Random.choice(types);
    const model = this.#objLoader.get(type, size, new THREE.Vector3(x, 0, z));
    model.rotation.y = Math.random() * Math.PI;
    this.add(model);
  }

  #generateCampfire(types) {
    for (let i = 0; i < CONFIG.tentsCount; i++) {
      const x = Math.sin(2 * Math.PI / CONFIG.tentsCount * i) * CONFIG.campfireSize / 2;
      const z = Math.cos(2 * Math.PI / CONFIG.tentsCount * i) * CONFIG.campfireSize / 2;
      const type = Random.choice(types);
      const model = this.#objLoader.get(type, 6, new THREE.Vector3(x, 0, z));
      model.rotation.y = Math.atan(x / z);
      if (Math.sign(z) > 0) model.rotation.y += Math.PI;
      this.add(model);
    }
  }

  #generatePebble(types, x, z) {
    const size = Math.random() / 4 + .25;
    const type = Random.choice(types);
    const model = this.#objLoader.get(type, size, new THREE.Vector3(x, -.1, z));
    this.add(model);
  }

  #generatePebbles(types) {
    for (let i = 0; i < CONFIG.randomPebblesCount; i++) {
      this.#generatePebble(types, this.#randomPlanePosition(), this.#randomPlanePosition());
    }
  }

  #randomPlanePosition() {
    return Math.random() * CONFIG.planeSize - CONFIG.planeSize / 2;
  }

  #generateTree(types, x, z) {
    const size = 4 + Math.random() * 4;
    const type = Random.choice(types);
    const model = this.#objLoader.get(type, size, new THREE.Vector3(x, 0, z));
    this.add(model);
  }

  #generateForest(trees) {
    for (let z = -CONFIG.planeSize / 2 + 10; z <= CONFIG.planeSize / 2 - 15;) {
      z += 4 + Math.random() * 3;
      const campfireOffset = (CONFIG.planeSize - Math.abs(z)) / 3 - 10;
      for (let x = -CONFIG.planeSize / 2 + 5; x < -campfireOffset;) {
        x += 4 + Math.random() * 3;
        this.#generateTree(trees, x, z);
      }
    }

    for (let z = -CONFIG.planeSize / 2 + 10; z <= CONFIG.planeSize / 2 - 15;) {
      z += 4 + Math.random() * 3;
      const campfireOffset = (CONFIG.planeSize - Math.abs(z)) / 3 - 10;
      for (let x = campfireOffset; x < CONFIG.planeSize / 2 - 10;) {
        x += 4 + Math.random() * 3;
        this.#generateTree(trees, x, z);
      }
    }
  }
}
