import * as THREE from 'three';
import { WAREHOUSE_MAP, GRID_SIZE } from '../data/warehouseMap.js';
import { createSupermarketShelf } from './Shelves.js';

export function createWarehouseScene(scene) {
  const rows = WAREHOUSE_MAP.length;
  const cols = WAREHOUSE_MAP[0].length;
  const mapWidth = cols * GRID_SIZE;
  const mapHeight = rows * GRID_SIZE;

  // Expanded epoxy floor plane
  const floorGeometry = new THREE.PlaneGeometry(200, 200);
  const floorMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xf1f5f9, 
    roughness: 0.8 
  });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, -0.01, 0);
  scene.add(floor);

  // Floor grid lines
  const gridHelper = new THREE.GridHelper(mapWidth + 12, cols * 2, 0x0284c7, 0xcbd5e1);
  gridHelper.position.set((mapWidth) / 2 - GRID_SIZE / 2, 0.01, (mapHeight) / 2 - GRID_SIZE / 2);
  scene.add(gridHelper);

  // Station materials
  const chargeMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4 });
  const dropMat = new THREE.MeshStandardMaterial({ color: 0x22c55e });

  // Render Map Modules
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const type = WAREHOUSE_MAP[r][c];
      const posX = c * GRID_SIZE;
      const posZ = r * GRID_SIZE;

      if (type === 1) { 
        // Render Supermarket Shelves stocked with items instead of orange crates
        createSupermarketShelf(posX, posZ, scene);

      } else if (type === 2) { 
        // Cyan Charging Stations
        const pad = new THREE.Mesh(
          new THREE.CylinderGeometry(1.2, 1.3, 0.1, 16),
          chargeMat
        );
        pad.position.set(posX, 0.05, posZ);
        scene.add(pad);

      } else if (type === 3) { 
        // Green Delivery Dropoff Zones
        const pad = new THREE.Mesh(
          new THREE.BoxGeometry(GRID_SIZE * 0.9, 0.08, GRID_SIZE * 0.9),
          dropMat
        );
        pad.position.set(posX, 0.04, posZ);
        scene.add(pad);
      }
    }
  }

  createConveyors(scene, mapWidth, mapHeight);
}

function createConveyors(scene, width, height) {
  const conveyorMat = new THREE.MeshStandardMaterial({ color: 0x334155 });
  const beltMat = new THREE.MeshStandardMaterial({ color: 0xe11d48 });

  const rail = new THREE.Mesh(new THREE.BoxGeometry(width + 8, 0.25, 0.9), conveyorMat);
  rail.position.set(width / 2 - 1.5, 0.1, -2.5);
  scene.add(rail);

  const belt = new THREE.Mesh(new THREE.BoxGeometry(width + 8, 0.28, 0.3), beltMat);
  belt.position.set(width / 2 - 1.5, 0.12, -2.5);
  scene.add(belt);
}