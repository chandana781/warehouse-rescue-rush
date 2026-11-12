import { aStar } from './AStar.js';
import { bfs } from './BFS.js';
import { dfs } from './DFS.js';
import { ucs } from './UCS.js';
import { greedyBestFirst } from './GreedyBestFirst.js';

export class Pathfinder {
  static findPath(algorithmName, grid, start, goal) {
    switch (algorithmName.toUpperCase()) {
      case 'BFS': return bfs(grid, start, goal);
      case 'DFS': return dfs(grid, start, goal);
      case 'UCS': return ucs(grid, start, goal);
      case 'GREEDY': return greedyBestFirst(grid, start, goal);
      case 'ASTAR':
      default: return aStar(grid, start, goal);
    }
  }
}