import { ReactNode, useCallback, useState } from 'react';
import { toast } from 'sonner';

type SystemNotificationData = {
  title: string;
  description: string;
  url: string;
  keepAfterClick?: boolean;
};

type ToastNotificationData = {
  title: string;
  description?: string;
  button?: {
    title: string;
    action: () => void;
  };
  vibrate?: number;
  icon?: ReactNode;
};

const useNotifications = () => {
  const [permission, setPermission] = useState(Notification.permission);

  const showToast = useCallback(async (data: ToastNotificationData) => {
    toast(data.title, {
      description: data.description,
      action: data.button
        ? {
            label: data.button!.title,
            onClick: () => {
              data.button!.action();
            },
          }
        : null,
      icon: data.icon,
    });

    if (
      data.vibrate !== undefined &&
      'vibrate' in navigator &&
      typeof navigator.vibrate === 'function'
    ) {
      navigator.vibrate(data.vibrate);
    }
  }, []);

  const requestPermissions = useCallback(async () => {
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
  }, [permission, showToast]);

  const sendNotification = useCallback(
    async (data: SystemNotificationData) => {
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
    },
    [requestPermissions]
  );

  const scheduleNotification = async (id: string, data: SystemNotificationData, date: Date) => {
    const permissionGranted = await requestPermissions();
    if (!permissionGranted) return;

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.active?.postMessage({
          type: 'schedule-notification',
          data,
          date: date.getTime(),
          id,
        });
      });
    }
  };

  const isNotificationScheduled = async (id: string): Promise<boolean> => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      return new Promise((resolve) => {
        const messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = (event) => {
          resolve(event.data.isScheduled);
        };
        registration.active?.postMessage({ type: 'is-notification-scheduled', id }, [
          messageChannel.port2,
        ]);
      });
    }
    return false;
  };

  const cancelNotification = async (id: string) => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.active?.postMessage({
          type: 'cancel-notification',
          id,
        });
      });
    }
  };

  return {
    sendNotification,
    showToast,
    scheduleNotification,
    isNotificationScheduled,
    cancelNotification,
  };
};

export { useNotifications };
