import { PriorityQueue } from './PriorityQueue.js';

export function greedyBestFirst(grid, start, goal) {
  const pq = new PriorityQueue();
  const heuristic = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

  pq.enqueue(start, heuristic(start, goal));
  const cameFrom = { [`${start.x},${start.y}`]: null };

  while (!pq.isEmpty()) {
    const current = pq.dequeue();
    if (current.x === goal.x && current.y === goal.y) break;

    const neighbors = getNeighbors(grid, current);
    for (const next of neighbors) {
      const key = `${next.x},${next.y}`;
      if (!(key in cameFrom)) {
        cameFrom[key] = current;
        pq.enqueue(next, heuristic(next, goal));
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