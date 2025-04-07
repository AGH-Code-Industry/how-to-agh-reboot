self.addEventListener('notificationclick', function (event) {
  console.log('notificationclick event', event);
  event.notification.close();
  const url = event.notification.data.url;
  event.waitUntil(self.clients.openWindow(url));
});

self.addEventListener('message', (event) => {
  if (event.data.type === 'schedule-notification') {
    const { data, date } = event.data;
    const delay = date - Date.now();

    if (delay > 0) {
      setTimeout(() => {
        self.registration.showNotification(data.title, {
          body: data.description,
          icon: '/logo.png',
          data: { url: data.url },
        });
      }, delay);
    }
  }
});
