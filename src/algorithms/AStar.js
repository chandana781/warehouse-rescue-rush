import { PriorityQueue } from './PriorityQueue.js';

export function aStar(grid, start, goal) {
  const pq = new PriorityQueue();
  pq.enqueue(start, 0);

  const cameFrom = { [`${start.x},${start.y}`]: null };
  const costSoFar = { [`${start.x},${start.y}`]: 0 };
  const heuristic = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

  while (!pq.isEmpty()) {
    const current = pq.dequeue();
    const currKey = `${current.x},${current.y}`;

    if (current.x === goal.x && current.y === goal.y) break;

    const neighbors = getNeighbors(grid, current);
    for (const next of neighbors) {
      const nextKey = `${next.x},${next.y}`;
      const newCost = costSoFar[currKey] + 1;

      if (!(nextKey in costSoFar) || newCost < costSoFar[nextKey]) {
        costSoFar[nextKey] = newCost;
        const priority = newCost + heuristic(next, goal);
        pq.enqueue(next, priority);
        cameFrom[nextKey] = current;
      }
    }
  }
  return reconstructPath(cameFrom, start, goal);
}

function getNeighbors(grid, pos) {
  const rows = grid.length, cols = grid[0].length;
  return [{ x: pos.x + 1, y: pos.y }, { x: pos.x - 1, y: pos.y }, { x: pos.x, y: pos.y + 1 }, { x: pos.x, y: pos.y - 1 }]
    .filter(p => p.x >= 0 && p.x < cols && p.y >= 0 && p.y < rows && grid[p.y][p.x] !== 1);
}

function reconstructPath(cameFrom, start, goal) {
  const path = [];
  let currKey = `${goal.x},${goal.y}`;
  if (!(currKey in cameFrom)) return [];
  let curr = goal;
  while (curr) {
    path.push(curr);
    currKey = `${curr.x},${curr.y}`;
    curr = cameFrom[currKey];
  }
  return path.reverse();
}