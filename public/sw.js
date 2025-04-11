self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  const url = event.notification.data.url;
  event.waitUntil(self.clients.openWindow(url));
});

self.addEventListener('message', async (event) => {
  const { type, data, date, id } = event.data;

  if (type === 'schedule-notification') {
    const delay = date - Date.now();
    if (delay > 0) {
      await saveNotification(id, { data, date });
      setTimeout(async () => {
        self.registration.showNotification(data.title, {
          body: data.description,
          icon: '/logo.png',
          data: { url: data.url, id: id },
          requireInteraction: data.keepAfterClick,
        });
        await deleteNotification(id);
      }, delay);
    }
  } else if (type === 'cancel-notification') {
    const isScheduled = await isNotificationInDB(id);
    if (isScheduled) {
      await deleteNotification(id);
    }
  } else if (type === 'is-notification-scheduled') {
    const isScheduled = await isNotificationInDB(id);
    event.ports[0].postMessage({ isScheduled });
  }
});

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('notificationsDB', 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('notifications')) {
        db.createObjectStore('notifications', { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

async function saveNotification(id, data) {
  const db = await openDatabase();
  const transaction = db.transaction('notifications', 'readwrite');
  const store = transaction.objectStore('notifications');
  store.put({ id, data });
}

async function deleteNotification(id) {
  const db = await openDatabase();
  const transaction = db.transaction('notifications', 'readwrite');
  const store = transaction.objectStore('notifications');
  store.delete(id);
}

async function isNotificationInDB(id) {
  const db = await openDatabase();
  const transaction = db.transaction('notifications', 'readonly');
  const store = transaction.objectStore('notifications');
  return new Promise((resolve) => {
    const request = store.get(id);
    request.onsuccess = () => {
      resolve(!!request.result);
    };
    request.onerror = () => {
      resolve(false);
    };
  });
}
