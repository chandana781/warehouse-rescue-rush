export class ScoreManager {
  constructor() {
    this.score = 0;
  }

  addPoints(amount) {
    this.score += amount;
    return this.score;
  }

  reset() {
    this.score = 0;
  }
}