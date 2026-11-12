import { ChargingStation } from './ChargingStation.js';
import { Pathfinder } from '../algorithms/Pathfinder.js';
import { WAREHOUSE_MAP } from '../data/warehouseMap.js';

export class ChargingManager {
  constructor() {
    this.stations = [
      new ChargingStation(0, 0),
      new ChargingStation(0, 1),
      new ChargingStation(0, 2)
    ];
  }

  sendToCharge(robot) {
    const availableStation = this.stations.find(s => !s.isOccupied);
    if (!availableStation) return false;

    const path = Pathfinder.findPath('ASTAR', WAREHOUSE_MAP, robot.gridPos, availableStation.pos);
    if (path.length > 0) {
      availableStation.isOccupied = true;
      robot.chargingStation = availableStation;
      robot.state = 'CHARGING_ROUTE';
      robot.setRoute(path, null);
      return true;
    }
    return false;
  }

  releaseStation(robot) {
    if (robot.chargingStation) {
      robot.chargingStation.isOccupied = false;
      robot.chargingStation = null;
    }
  }
}