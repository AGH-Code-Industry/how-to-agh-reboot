import { useState } from 'react';
import { toast } from 'sonner';

type SystemNotificationData = {
  title: string;
  description: string;
  url: string;
};

type ToastNotificationData = {
  title: string;
  description: string;
  button?: {
    title: string;
    action: () => void;
  };
};

const useNotifications = () => {
  const [permission, setPermission] = useState(Notification.permission);

  const requestPermissions = async () => {
    if (permission === 'granted') {
      return true;
    }

    const newPermission = await Notification.requestPermission();
    setPermission(newPermission);

    if (newPermission === 'granted') {
      return true;
    }

    const toastData = {
      title: newPermission === 'default' ? 'Brak uprawnień' : 'Odmówiono uprawnień',
      description:
        newPermission === 'default'
          ? 'Aby otrzymywać powiadomienia, musisz zaakceptować uprawnienia'
          : 'Zezwól na powiadomienia w ustawieniach przeglądarki i spróbuj ponownie',
      button: {
        title: 'Ponów',
        action: () => setTimeout(requestPermissions, 50),
      },
    };

    await showToast(toastData);
    return false;
  };

  const sendNotification = async (data: SystemNotificationData) => {
    const permissionGranted = await requestPermissions();
    if (!permissionGranted) return;

    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;

      const { title, description, ...payload } = data;

      await registration.showNotification(title, {
        body: description,
        icon: '/logo.png',
        badge: '/logo.png',
        data: payload,
      });
    }
  };

  const showToast = async (data: ToastNotificationData) => {
    toast(data.title, {
      description: data.description,
      action: data.button
        ? {
            label: data.button!.title,
            onClick: () => {
              data.button!.action();
              console.log('zewnątrz akcji');
            },
          }
        : null,
    });
  };

  const scheduleNotification = async (data: SystemNotificationData, date: Date) => {
    const permissionGranted = await requestPermissions();
    if (!permissionGranted) return;

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.active?.postMessage({
          type: 'schedule-notification',
          data,
          date: date.getTime(),
        });
      });
    }
  };

  return { sendNotification, showToast, scheduleNotification };
};

export { useNotifications };
