import * as THREE from 'three';
import { SUPERMARKET_ITEMS } from '../data/supermarketItems.js';

export function createSupermarketShelf(x, z, scene) {
  const shelfGroup = new THREE.Group();

  // Blue Frame Uprights matching image
  const blueFrameMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, metalness: 0.5, roughness: 0.3 });
  
  const p1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 3.2, 0.1), blueFrameMat);
  p1.position.set(-1.2, 1.6, -0.4);
  const p2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 3.2, 0.1), blueFrameMat);
  p2.position.set(1.2, 1.6, -0.4);
  const p3 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 3.2, 0.1), blueFrameMat);
  p3.position.set(-1.2, 1.6, 0.4);
  const p4 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 3.2, 0.1), blueFrameMat);
  p4.position.set(1.2, 1.6, 0.4);
  shelfGroup.add(p1, p2, p3, p4);

  // 5 Shelf Tiers
  const shelfLevels = [0.2, 0.8, 1.4, 2.0, 2.6];
  shelfLevels.forEach((yPos) => {
    const shelfBoard = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.05, 0.8),
      blueFrameMat
    );
    shelfBoard.position.set(0, yPos, 0);
    shelfGroup.add(shelfBoard);
  });

  // Populate Products onto Shelves
  SUPERMARKET_ITEMS.forEach((item) => {
    const targetY = shelfLevels[item.shelfLevel - 1] + 0.18;
    const itemMat = new THREE.MeshStandardMaterial({ color: item.color, roughness: 0.4 });

    for (let i = -0.9; i <= 0.9; i += 0.3) {
      let geo;
      if (item.category === 'Beverages' || item.category === 'Household') {
        geo = new THREE.CylinderGeometry(0.08, 0.08, 0.3, 12);
      } else {
        geo = new THREE.BoxGeometry(0.18, 0.28, 0.12);
      }
      
      const itemMesh = new THREE.Mesh(geo, itemMat);
      itemMesh.position.set(i, targetY, (Math.random() - 0.5) * 0.2);
      itemMesh.userData = { itemId: item.id, shelfLevel: item.shelfLevel };
      shelfGroup.add(itemMesh);
    }
  });

  shelfGroup.position.set(x, 0, z);
  scene.add(shelfGroup);
  return shelfGroup;
}