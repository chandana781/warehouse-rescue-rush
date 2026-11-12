export class OrderPanel {
  static render(orders, robots, onDispatch) {
    const container = document.getElementById('order-list');
    container.innerHTML = '';

    orders.forEach(order => {
      if (order.status !== 'PENDING') return;

      const card = document.createElement('div');
      card.className = 'card';

      const idleRobots = robots.filter(r => r.state === 'IDLE');
      const options = idleRobots.map(r => `<option value="${r.id}">${r.name}</option>`).join('');

      card.innerHTML = `
        <div class="card-title">
          <span>${order.product.name}</span>
          <span style="color: #4ade80;">+$${order.product.price}</span>
        </div>
        <div style="font-size: 0.75rem; color: #94a3b8;">${order.customer.name}</div>
        ${idleRobots.length > 0 ? `
          <select class="select-input robot-select">
            ${options}
          </select>
          <button class="btn btn-primary dispatch-btn">Dispatch</button>
        ` : `<div style="font-size: 0.75rem; color: #f87171; margin-top: 4px;">No Available AMRs</div>`}
      `;

      if (idleRobots.length > 0) {
        const btn = card.querySelector('.dispatch-btn');
        const select = card.querySelector('.robot-select');

        btn.addEventListener('click', () => {
          onDispatch(parseInt(select.value), order);
        });
      }

      container.appendChild(card);
    });
  }
}