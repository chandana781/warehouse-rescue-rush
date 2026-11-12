import * as THREE from 'three';
import { setupCamera } from './scene/camera.js';
import { setupLighting } from './scene/lighting.js';
import { createWarehouseScene } from './scene/warehouse.js';
import { GameManager } from './game/GameManager.js';

const container = document.getElementById('game-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b0f19);

const camera = setupCamera(window.innerWidth, window.innerHeight);
setupLighting(scene);
createWarehouseScene(scene);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

const gameManager = new GameManager(scene);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const deltaTime = clock.getDelta();
  gameManager.update(deltaTime);
  renderer.render(scene, camera);
}

animate();