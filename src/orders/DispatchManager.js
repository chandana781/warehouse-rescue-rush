import { Pathfinder } from '../algorithms/Pathfinder.js';
import { WAREHOUSE_MAP } from '../data/warehouseMap.js';

export class DispatchManager {
  static dispatchOrder(robot, order) {
    if (robot.state !== 'IDLE') return false;

    // Pick up product then route to dropoff
    const pathToProduct = Pathfinder.findPath(
      robot.selectedAlgorithm,
      WAREHOUSE_MAP,
      robot.gridPos,
      order.product.rackPos
    );

    const pathToCustomer = Pathfinder.findPath(
      robot.selectedAlgorithm,
      WAREHOUSE_MAP,
      order.product.rackPos,
      order.customer.dropoffPos
    );

    const fullPath = [...pathToProduct, ...pathToCustomer];

    if (fullPath.length > 0) {
      order.status = 'DISPATCHED';
      robot.setRoute(fullPath, order);
      return true;
    }
    return false;
  }
}