export class NotificationPanel {
  static showToast(message) {
    const container = document.getElementById('notifications');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
}