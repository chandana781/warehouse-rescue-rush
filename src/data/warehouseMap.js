
// 0 = Walkable Floor / Aisle
// 1 = Shelf / Obstacle
// 2 = Charging Station
// 3 = Delivery / Dropoff Area

export const GRID_SIZE = 3; // Cell spacing size

export const WAREHOUSE_MAP = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 0, 1, 1, 0, 1, 0],
  [0, 1, 1, 0, 1, 1, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 0, 1, 1, 0, 1, 0],
  [0, 1, 1, 0, 1, 1, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [2, 2, 0, 0, 0, 0, 0, 3, 3]
];