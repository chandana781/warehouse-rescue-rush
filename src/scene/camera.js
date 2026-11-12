import * as THREE from 'three';

export function setupCamera(width, height) {
  const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
  camera.position.set(28, 26, 36);
  camera.lookAt(13.5, 0, 9);
  return camera;
}