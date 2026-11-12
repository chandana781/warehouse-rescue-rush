import { Order } from './Order.js';
import { Customer } from './Customer.js';
import { SUPERMARKET_ITEMS } from '../data/supermarketItems.js';
import { WAREHOUSE_MAP } from '../data/warehouseMap.js';
import { getAisleAccessTile } from '../robots/RobotManager.js';

export class OrderManager {
  constructor() {
    this.orders = [];
    this.nextOrderId = 1;
    this.dropoffLocations = [
      { x: 8, y: 7 },
      { x: 7, y: 7 }
    ];
  }

  spawnOrder() {
    const item = SUPERMARKET_ITEMS[Math.floor(Math.random() * SUPERMARKET_ITEMS.length)];
    const dropoff = this.dropoffLocations[Math.floor(Math.random() * this.dropoffLocations.length)];
    const customer = new Customer(this.nextOrderId, dropoff);

    // Calculate open aisle access tile next to target shelf location
    const shelfTile = item.shelfTile || { x: 1, y: 1 };
    const aisleAccessTile = getAisleAccessTile(shelfTile.x, shelfTile.y, WAREHOUSE_MAP);

    const order = new Order(this.nextOrderId++, item, customer);
    order.targetTile = aisleAccessTile; // Assign walkable aisle tile for robot pathing
    order.shelfTile = shelfTile;        // Keep original shelf tile for orientation

    this.orders.push(order);
    return order;
  }

  removeOrder(orderId) {
    this.orders = this.orders.filter(o => o.id !== orderId);
  }
}