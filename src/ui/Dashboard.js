export class Dashboard {
  static updateStats(score, level, robotCount, totalRobots) {
    document.getElementById('score-val').innerText = score;
    document.getElementById('level-val').innerText = level;
    document.getElementById('robot-count-val').innerText = `${robotCount} / ${totalRobots}`;
  }

  static toggleNextLevelButton(show, onClick) {
    const btn = document.getElementById('next-level-btn');
    if (show) {
      btn.classList.remove('hidden');
      btn.onclick = onClick;
    } else {
      btn.classList.add('hidden');
    }
  }
}