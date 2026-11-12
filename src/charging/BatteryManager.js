export class BatteryManager {
  static checkBatteryLevels(robots, chargingManager) {
    robots.forEach(robot => {
      if (robot.battery <= 20 && robot.state === 'IDLE') {
        chargingManager.sendToCharge(robot);
      }
    });
  }
}