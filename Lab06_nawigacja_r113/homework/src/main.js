import Scene from './scene.js';
import { COLORS } from './constants.js';

/*
* SETUP
*/
// Canvas
const canvas = document.getElementById("webgl");

// Statistics
const stats = new Stats();
stats.setMode(0);
document.getElementById("stats").appendChild(stats.domElement);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
});
renderer.setClearColor(new THREE.Color(COLORS.black));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Update screen size function
const updateScreenSize = () => {
  // Update camera
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  // Update renderer
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};

// Update loop function
const clock = new THREE.Clock();

const updateFrame = (scene) => {
  stats.update();
  scene.update(clock.getDelta());
  renderer.render(scene, camera);
  requestAnimationFrame(() => updateFrame(scene));
};

// Event listeners
window.addEventListener('resize', () => {
  updateScreenSize();
});

window.addEventListener('DOMContentLoaded', () => {
  const scene = new Scene(camera, canvas);
  scene.initialize();

  const axesHelper = new THREE.AxesHelper(25);
  scene.add(axesHelper)

  updateScreenSize();
  updateFrame(scene);
});
