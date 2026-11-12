import { aStar } from '../src/algorithms/AStar.js';
import { WAREHOUSE_MAP } from '../src/data/warehouseMap.js';

console.log("Running Algorithm Tests...");
const path = aStar(WAREHOUSE_MAP, { x: 0, y: 0 }, { x: 9, y: 0 });
console.assert(path.length > 0, "A* should find a valid path to customer zone");
console.log("Algorithm Tests Passed!");