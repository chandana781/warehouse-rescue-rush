import { OrderManager } from '../src/orders/OrderManager.js';

console.log("Running Order Tests...");
const orderManager = new OrderManager();
const order = orderManager.spawnOrder();
console.assert(order !== null, "Order successfully generated");
console.log("Order Tests Passed!");