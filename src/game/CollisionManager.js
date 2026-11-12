export class CollisionManager {
  static resolveCollisions(robots) {
    // Basic priority offset if two robots occupy the same space
    for (let i = 0; i < robots.length; i++) {
      for (let j = i + 1; j < robots.length; j++) {
        const r1 = robots[i];
        const r2 = robots[j];

        if (r1.gridPos.x === r2.gridPos.x && r1.gridPos.y === r2.gridPos.y && r1.state === 'MOVING' && r2.state === 'MOVING') {
          r2.speed = 3.0; // Slow down yield
        } else {
          r2.speed = 6.0;
        }
      }
    }
  }
}