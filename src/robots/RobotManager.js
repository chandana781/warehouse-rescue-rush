import { Robot } from './Robot.js';
import { WAREHOUSE_MAP } from '../data/warehouseMap.js';

export function getAisleAccessTile(shelfX, shelfY, map) {
  // Check adjacent neighbor tiles (Down, Up, Right, Left) for a walkable floor (0)
  const neighbors = [
    { x: shelfX, y: shelfY + 1 }, // Below shelf
    { x: shelfX, y: shelfY - 1 }, // Above shelf
    { x: shelfX + 1, y: shelfY }, // Right of shelf
    { x: shelfX - 1, y: shelfY }  // Left of shelf
  ];

  for (const pos of neighbors) {
    if (
      pos.y >= 0 && pos.y < map.length &&
      pos.x >= 0 && pos.x < map[0].length &&
      map[pos.y][pos.x] === 0 // Must be walkable aisle
    ) {
      return pos;
    }
  }
  return { x: shelfX, y: shelfY };
}

export class RobotManager {
  constructor(scene) {
    this.scene = scene;
    this.robots = [];
  }

  initFleet(count) {
    // Clear existing
    this.robots.forEach(r => this.scene.remove(r.mesh));
    this.robots = [];

    for (let i = 0; i < count; i++) {
      // Spawn robots at charging station coordinates (type === 2)
      const robot = new Robot(i + 1, i, 7, this.scene);
      this.robots.push(robot);
    }
  }

  getRobot(id) {
    return this.robots.find(r => r.id === id);
  }

  dispatchRobotToOrder(robotId, order, pathfindingFn) {
    const robot = this.getRobot(robotId);
    if (!robot || robot.state !== 'IDLE') return false;

    // 1. Get path to aisle access tile next to shelf
    const pickupAisleTile = order.targetTile || getAisleAccessTile(order.shelfTile.x, order.shelfTile.y, WAREHOUSE_MAP);
    const pathToShelf = pathfindingFn(robot.gridPos, pickupAisleTile, WAREHOUSE_MAP);

    // 2. Get path from aisle to dropoff zone
    const pathToDropoff = pathfindingFn(pickupAisleTile, order.customer.dropoffLocation, WAREHOUSE_MAP);

    // Full path sequence
    const fullPath = [...pathToShelf, ...pathToDropoff.slice(1)];
    robot.setRoute(fullPath, order);
    return true;
  }

  update(deltaTime, onTaskComplete, onChargeComplete) {
    this.robots.forEach(robot => robot.update(deltaTime, onTaskComplete, onChargeComplete));
  }
}