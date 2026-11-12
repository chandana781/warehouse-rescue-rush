import { LEVELS } from '../data/levels.js';

export class LevelManager {
  constructor() {
    this.currentLevelIndex = 0;
  }

  getCurrentLevel() {
    return LEVELS[this.currentLevelIndex];
  }

  hasNextLevel() {
    return this.currentLevelIndex < LEVELS.length - 1;
  }

  nextLevel() {
    if (this.hasNextLevel()) {
      this.currentLevelIndex++;
      return this.getCurrentLevel();
    }
    return null;
  }
}