import * as THREE from 'three';
import { GRID_SIZE } from '../data/warehouseMap.js';
import { SUPERMARKET_ITEMS } from '../data/supermarketItems.js';

export class Robot {
  constructor(id, startX, startY, scene) {
    this.id = id;
    this.name = `AMR-0${id}`;
    this.gridPos = { x: startX, y: startY };
    this.battery = 100;
    this.state = 'IDLE';
    this.selectedAlgorithm = 'ASTAR';
    this.speed = 4.0; // Slightly tuned speed for precise aisle navigation
    this.currentOrder = null;
    this.path = [];
    this.targetIndex = 0;
    this.armHeightProgress = 0; // 0 = lowered, 1 = fully extended upwards
    
    // Root Group
    this.mesh = new THREE.Group();

    // Color Palette
    const yellowMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.3, metalness: 0.1 });
    const blueMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.4, metalness: 0.2 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 });
    const boxMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6 });

    // -------------------------------------------------------------
    // 1. TRACKED CRAWLER CART
    // -------------------------------------------------------------
    const crawlerGroup = new THREE.Group();

    // Crawler Body Platform (compacted slightly for grid clearance)
    const crawlerBed = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.4, 0.9), yellowMat);
    crawlerBed.position.set(0, 0.5, 0);
    crawlerGroup.add(crawlerBed);

    // Blue Safety Guardrails
    const railGeo = new THREE.BoxGeometry(1.2, 0.1, 0.05);
    const railLeft = new THREE.Mesh(railGeo, blueMat);
    railLeft.position.set(0, 0.75, 0.42);
    crawlerGroup.add(railLeft);

    const railRight = new THREE.Mesh(railGeo, blueMat);
    railRight.position.set(0, 0.75, -0.42);
    crawlerGroup.add(railRight);

    // Continuous Tracks (Left & Right Tread Belts)
    const trackGeo = new THREE.BoxGeometry(1.3, 0.35, 0.2);
    const trackLeft = new THREE.Mesh(trackGeo, blueMat);
    trackLeft.position.set(0, 0.2, 0.45);
    crawlerGroup.add(trackLeft);

    const trackRight = new THREE.Mesh(trackGeo, blueMat);
    trackRight.position.set(0, 0.2, -0.45);
    crawlerGroup.add(trackRight);

    // Wheels inside tracks
    for (let offset = -0.4; offset <= 0.4; offset += 0.4) {
      const wheelGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.22, 12);
      wheelGeo.rotateX(Math.PI / 2);

      const wLeft = new THREE.Mesh(wheelGeo, yellowMat);
      wLeft.position.set(offset, 0.2, 0.45);
      crawlerGroup.add(wLeft);

      const wRight = new THREE.Mesh(wheelGeo, yellowMat);
      wRight.position.set(offset, 0.2, -0.45);
      crawlerGroup.add(wRight);
    }

    // Cargo boxes on crawler bed
    this.cargoBox = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.5), boxMat);
    this.cargoBox.position.set(0, 0.85, 0);
    this.cargoBox.visible = false;
    crawlerGroup.add(this.cargoBox);

    crawlerGroup.position.set(0.3, 0, 0);
    this.mesh.add(crawlerGroup);

    // -------------------------------------------------------------
    // 2. HUMANOID PICKER ROBOT
    // -------------------------------------------------------------
    const humanoidGroup = new THREE.Group();

    // Legs & Feet
    const leftFoot = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.1, 0.3), yellowMat);
    leftFoot.position.set(-0.15, 0.05, 0.05);
    humanoidGroup.add(leftFoot);

    const rightFoot = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.1, 0.3), yellowMat);
    rightFoot.position.set(0.15, 0.05, 0.05);
    humanoidGroup.add(rightFoot);

    const legGeo = new THREE.CylinderGeometry(0.07, 0.06, 0.8, 12);
    const leftLeg = new THREE.Mesh(legGeo, yellowMat);
    leftLeg.position.set(-0.15, 0.5, 0);
    humanoidGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, yellowMat);
    rightLeg.position.set(0.15, 0.5, 0);
    humanoidGroup.add(rightLeg);

    // Knee Joints
    const kneeGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const leftKnee = new THREE.Mesh(kneeGeo, blueMat);
    leftKnee.position.set(-0.15, 0.5, 0);
    humanoidGroup.add(leftKnee);

    const rightKnee = new THREE.Mesh(kneeGeo, blueMat);
    rightKnee.position.set(0.15, 0.5, 0);
    humanoidGroup.add(rightKnee);

    // Torso Base
    const pelvis = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.2, 0.25), blueMat);
    pelvis.position.set(0, 0.95, 0);
    humanoidGroup.add(pelvis);

    const chest = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, 0.3), yellowMat);
    chest.position.set(0, 1.35, 0);
    humanoidGroup.add(chest);

    // Head Unit
    const headGroup = new THREE.Group();
    const headBase = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), yellowMat);
    headGroup.add(headBase);

    const visor = new THREE.Mesh(
      new THREE.SphereGeometry(0.16, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      blueMat
    );
    visor.rotation.x = Math.PI / 2;
    visor.position.set(0, 0.02, 0.07);
    headGroup.add(visor);

    headGroup.position.set(0, 1.8, 0);
    humanoidGroup.add(headGroup);

    // Static Left Arm
    const shoulderLeft = new THREE.Mesh(kneeGeo, blueMat);
    shoulderLeft.position.set(-0.3, 1.55, 0);
    humanoidGroup.add(shoulderLeft);

    const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.6, 12), yellowMat);
    leftArm.position.set(-0.32, 1.2, 0);
    humanoidGroup.add(leftArm);

    // -------------------------------------------------------------
    // 3. ARTICULATED RIGHT PICKING ARM
    // -------------------------------------------------------------
    this.rightShoulder = new THREE.Group();
    this.rightShoulder.position.set(0.3, 1.55, 0);

    const shoulderJoint = new THREE.Mesh(kneeGeo, blueMat);
    this.rightShoulder.add(shoulderJoint);

    this.upperArm = new THREE.Group();
    const upperArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.5, 12), yellowMat);
    upperArmMesh.position.y = 0.25;
    this.upperArm.add(upperArmMesh);

    this.elbowJoint = new THREE.Mesh(kneeGeo, blueMat);
    this.elbowJoint.position.y = 0.5;
    this.upperArm.add(this.elbowJoint);

    this.foreArm = new THREE.Group();
    this.foreArm.position.y = 0.5;

    const foreArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5, 12), yellowMat);
    foreArmMesh.position.y = 0.25;
    this.foreArm.add(foreArmMesh);

    // Hand Gripper
    const handMesh = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.12), blueMat);
    handMesh.position.y = 0.55;
    this.foreArm.add(handMesh);

    this.upperArm.add(this.foreArm);
    this.rightShoulder.add(this.upperArm);
    humanoidGroup.add(this.rightShoulder);

    humanoidGroup.position.set(-0.4, 0, 0);
    this.mesh.add(humanoidGroup);

    // Initial World Position centered in grid cell
    this.mesh.position.set(startX * GRID_SIZE, 0, startY * GRID_SIZE);
    scene.add(this.mesh);
  }

  setArmHeight(progress) {
    this.armHeightProgress = Math.max(0, Math.min(1, progress));

    this.rightShoulder.rotation.z = -Math.PI * 0.75 * this.armHeightProgress;
    this.rightShoulder.rotation.x = Math.PI * 0.2 * this.armHeightProgress;

    this.foreArm.rotation.z = Math.PI * 0.35 * (1 - this.armHeightProgress);
  }

  setArmHeightForLevel(level) {
    const progress = (level - 1) / 4.0;
    this.setArmHeight(progress);
  }

  setRoute(path, order = null) {
    if (!path || path.length === 0) return;
    this.path = path;
    this.targetIndex = 0;
    this.currentOrder = order;
    this.state = order ? 'DELIVERING' : 'CHARGING_ROUTE';
  }

  update(deltaTime, onTaskComplete, onChargeComplete) {
    if (this.state === 'DELIVERING') {
      if (this.targetIndex >= this.path.length - 1 && this.path.length > 0) {
        // Raise hand upwards when reaching pickup shelf aisle position
        this.setArmHeight(Math.sin(Date.now() * 0.005) * 0.4 + 0.6);
        this.cargoBox.visible = true;
      } else {
        // Keep arm low while moving
        this.setArmHeight(0.1);
      }
    } else {
      this.cargoBox.visible = false;
      this.setArmHeight(0);
    }

    // Movement & Pathing Logic
    if ((this.state === 'DELIVERING' || this.state === 'CHARGING_ROUTE') && this.path.length > 0) {
      this.battery = Math.max(0, this.battery - 1.5 * deltaTime);

      const targetCell = this.path[this.targetIndex];
      const targetWorldX = targetCell.x * GRID_SIZE;
      const targetWorldZ = targetCell.y * GRID_SIZE;

      const currentPos = this.mesh.position;
      const dx = targetWorldX - currentPos.x;
      const dz = targetWorldZ - currentPos.z;
      const distance = Math.hypot(dx, dz);

      const step = this.speed * deltaTime;

      // Smooth Rotation to Face Direction of Travel
      if (Math.abs(dx) > 0.01 || Math.abs(dz) > 0.01) {
        const targetAngle = Math.atan2(dx, dz);
        
        // Lerp rotation to avoid snappy turns into mesh borders
        let diff = targetAngle - this.mesh.rotation.y;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        this.mesh.rotation.y += diff * Math.min(1, 10 * deltaTime);
      }

      // Check for cell arrival threshold
      if (distance <= step) {
        this.mesh.position.x = targetWorldX;
        this.mesh.position.z = targetWorldZ;
        this.gridPos = { x: targetCell.x, y: targetCell.y };

        this.targetIndex++;

        if (this.targetIndex >= this.path.length) {
          this.path = [];
          if (this.state === 'DELIVERING') {
            if (onTaskComplete) onTaskComplete(this, this.currentOrder);
            this.currentOrder = null;
            this.state = 'IDLE';
          } else if (this.state === 'CHARGING_ROUTE') {
            this.state = 'CHARGING';
          }
        }
      } else {
        this.mesh.position.x += (dx / distance) * step;
        this.mesh.position.z += (dz / distance) * step;
      }
    } else if (this.state === 'CHARGING') {
      this.battery = Math.min(100, this.battery + 20 * deltaTime);
      if (this.battery >= 100) {
        this.state = 'IDLE';
        if (onChargeComplete) onChargeComplete(this);
      }
    }
  }
}