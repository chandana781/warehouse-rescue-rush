import * as THREE from 'three';
import { GRID_SIZE } from '../data/warehouseMap.js';

export class RobotMovement {
  static moveAlongPath(robot, deltaTime) {
    if (robot.path.length === 0) return true; // Destination reached

    const target = robot.path[0];
    const targetPos = new THREE.Vector3(target.x * GRID_SIZE, 0.5, target.y * GRID_SIZE);
    
    const moveStep = robot.speed * deltaTime;
    robot.mesh.position.moveTowards(targetPos, moveStep);

    if (robot.mesh.position.distanceTo(targetPos) < 0.05) {
      robot.gridPos = { x: target.x, y: target.y };
      robot.path.shift();
      if (robot.path.length === 0) return true;
    }
    return false;
  }
}