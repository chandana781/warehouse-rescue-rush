export class RobotPanel {
  static render(robots, onAlgorithmChange) {
    const container = document.getElementById('robot-list');
    container.innerHTML = '';

    robots.forEach(robot => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="card-title">
          <span>${robot.name}</span>
          <span class="badge ${robot.state.toLowerCase()}">${robot.state}</span>
        </div>
        <div class="battery-container">
          <div class="battery-fill" style="width: ${robot.battery}%"></div>
        </div>
        <select class="select-input" data-robot-id="${robot.id}">
          <option value="ASTAR" ${robot.selectedAlgorithm === 'ASTAR' ? 'selected' : ''}>A* Search</option>
          <option value="BFS" ${robot.selectedAlgorithm === 'BFS' ? 'selected' : ''}>Breadth-First (BFS)</option>
          <option value="DFS" ${robot.selectedAlgorithm === 'DFS' ? 'selected' : ''}>Depth-First (DFS)</option>
          <option value="UCS" ${robot.selectedAlgorithm === 'UCS' ? 'selected' : ''}>Uniform Cost (UCS)</option>
          <option value="GREEDY" ${robot.selectedAlgorithm === 'GREEDY' ? 'selected' : ''}>Greedy Best-First</option>
        </select>
      `;

      card.querySelector('select').addEventListener('change', (e) => {
        onAlgorithmChange(robot.id, e.target.value);
      });

      container.appendChild(card);
    });
  }
}