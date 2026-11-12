import { RobotManager } from '../robots/RobotManager.js';
import { OrderManager } from '../orders/OrderManager.js';
import { DispatchManager } from '../orders/DispatchManager.js';
import { ChargingManager } from '../charging/ChargingManager.js';
import { BatteryManager } from '../charging/BatteryManager.js';
import { ScoreManager } from './ScoreManager.js';
import { LevelManager } from './LevelManager.js';
import { CollisionManager } from './CollisionManager.js';
import { RobotPanel } from '../ui/RobotPanel.js';
import { OrderPanel } from '../ui/OrderPanel.js';
import { Dashboard } from '../ui/Dashboard.js';
import { NotificationPanel } from '../ui/NotificationPanel.js';

export class GameManager {
  constructor(scene) {
    this.scene = scene;
    this.robotManager = new RobotManager(scene);
    this.orderManager = new OrderManager();
    this.chargingManager = new ChargingManager();
    this.scoreManager = new ScoreManager();
    this.levelManager = new LevelManager();

    this.spawnTimer = null;
    this.initLevel();
  }

  initLevel() {
    const currentLevel = this.levelManager.getCurrentLevel();
    this.robotManager.initFleet(currentLevel.robotCount);

    Dashboard.updateStats(this.scoreManager.score, currentLevel.level, currentLevel.robotCount, currentLevel.robotCount);
    Dashboard.toggleNextLevelButton(false);

    if (this.spawnTimer) clearInterval(this.spawnTimer);
    this.spawnTimer = setInterval(() => {
      const newOrder = this.orderManager.spawnOrder();
      NotificationPanel.showToast(`New Order: ${newOrder.product.name}`);
      this.refreshUI();
    }, currentLevel.spawnInterval);

    this.refreshUI();
  }

  handleDispatch(robotId, order) {
    const robot = this.robotManager.getRobot(robotId);
    if (robot && DispatchManager.dispatchOrder(robot, order)) {
      NotificationPanel.showToast(`${robot.name} assigned via ${robot.selectedAlgorithm}`);
      this.refreshUI();
    }
  }

  onTaskComplete(robot, order) {
    const pts = order.product.price;
    const total = this.scoreManager.addPoints(pts);
    this.orderManager.removeOrder(order.id);
    NotificationPanel.showToast(`Delivered! +$${pts}`);

    const level = this.levelManager.getCurrentLevel();
    if (total >= level.targetScore && this.levelManager.hasNextLevel()) {
      Dashboard.toggleNextLevelButton(true, () => this.advanceLevel());
    }
    this.refreshUI();
  }

  advanceLevel() {
    this.levelManager.nextLevel();
    this.initLevel();
    NotificationPanel.showToast(`Advanced to Level ${this.levelManager.getCurrentLevel().level}!`);
  }

  refreshUI() {
    RobotPanel.render(this.robotManager.robots, (robotId, algo) => {
      const robot = this.robotManager.getRobot(robotId);
      if (robot) robot.selectedAlgorithm = algo;
    });

    OrderPanel.render(
      this.orderManager.orders,
      this.robotManager.robots,
      (robotId, order) => this.handleDispatch(robotId, order)
    );

    const level = this.levelManager.getCurrentLevel();
    Dashboard.updateStats(this.scoreManager.score, level.level, this.robotManager.robots.filter(r => r.state === 'IDLE').length, level.robotCount);
  }

  update(deltaTime) {
    this.robotManager.update(
      deltaTime,
      (robot, order) => this.onTaskComplete(robot, order),
      (robot) => {
        this.chargingManager.releaseStation(robot);
        NotificationPanel.showToast(`${robot.name} Fully Charged`);
        this.refreshUI();
      }
    );

    BatteryManager.checkBatteryLevels(this.robotManager.robots, this.chargingManager);
    CollisionManager.resolveCollisions(this.robotManager.robots);
    
    // Smooth UI updates for battery bars
    RobotPanel.render(this.robotManager.robots, (robotId, algo) => {
      const robot = this.robotManager.getRobot(robotId);
      if (robot) robot.selectedAlgorithm = algo;
    });
  }
}