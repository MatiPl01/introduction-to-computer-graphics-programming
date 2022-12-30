import Scene from './scene.js';
import Player from './models/player.js';
import { COLORS, OBJECT } from './constants.js';

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

// DOM elements
const overlay = document.getElementById("overlay");
const crosshair = document.getElementById('crosshair');
const startBtn = document.getElementById('start-btn');

// Scene loading finish handler
const handleLoadingFinish = ({ player, objLoader }) => {
  overlay.classList.add('start');
  startBtn.addEventListener('click', handleStart);

  const scale = 15;
  player.setWeapons({
    rifle: {
      model: objLoader.get(OBJECT.uziGold, scale),
      ammo: objLoader.get(OBJECT.ammoUzi, scale),
      position: new THREE.Vector3(.75, -.9, -1.5),
      ammoOffset: new THREE.Vector3(0, .25, -.25),
      ammoVelocity: 40,
      shootingFrequency: 75
    },
    pistol: {
      model: objLoader.get(OBJECT.pistol, scale),
      ammo: objLoader.get(OBJECT.ammoPistol, scale),
      position: new THREE.Vector3(.75, -.8, -1.2),
      ammoOffset: new THREE.Vector3(0, .2, -.25),
      ammoVelocity: 25,
      shootingFrequency: 25
    },
    knife: {
      model: objLoader.get(OBJECT.knifeSharp, scale),
      position: new THREE.Vector3(.75, -.5, -1)
    }
  })
}

// Handle start
const handleStart = () => {
  overlay.classList.add('hidden');
}

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
  scene.update(clock.getDelta(), clock.getElapsedTime());
  renderer.render(scene, camera);
  requestAnimationFrame(() => updateFrame(scene));
};

// Event listeners
window.addEventListener('resize', () => {
  updateScreenSize();
});

window.addEventListener('DOMContentLoaded', () => {
  const player = new Player(camera, crosshair, 2);
  const scene = new Scene(player, canvas, handleLoadingFinish);
  scene.initialize();

  updateScreenSize();
  updateFrame(scene);
});
