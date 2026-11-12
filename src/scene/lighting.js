import * as THREE from 'three';

export function setupLighting(scene) {
  // Bright ambient lighting for clear visibility
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
  sunLight.position.set(20, 50, 30);
  sunLight.castShadow = true;
  scene.add(sunLight);

  const fillLight = new THREE.DirectionalLight(0xbae6fd, 0.8);
  fillLight.position.set(-20, 30, -20);
  scene.add(fillLight);
}