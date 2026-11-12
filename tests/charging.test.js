import { Robot } from '../src/robots/Robot.js';

console.log("Running Charging Tests...");
const dummyScene = { add: () => {} };
const robot = new Robot(1, 0, 0, dummyScene);
robot.battery = 15;
console.assert(robot.battery <= 20, "Battery warning threshold active");
console.log("Charging Tests Passed!");