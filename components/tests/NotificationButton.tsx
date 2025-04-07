'use client';

import { Button } from '@/components/ui/button';
import { useNotifications } from '@/hooks/useNotifications';
import { useEffect, useState } from 'react';

export function LocalNotificationButton() {
  const { sendNotification } = useNotifications();

  const send = async () => {
    const randomNumber = Math.floor(Math.random() * 1000);
    await sendNotification({
      title: 'Powiadomienie',
      description: `To jest powiadomienie [${randomNumber}]`,
      url: 'settings',
    });
  };

  return <Button onClick={send}>Wyślij powiadomienie</Button>;
}

export function ScheduleNotificationButton() {
  const { scheduleNotification, cancelNotification, isNotificationScheduled } = useNotifications();
  const notificationId = 'fixed-notification-id';
  const [isScheduled, setIsScheduled] = useState(false);

  useEffect(() => {
    const checkIfScheduled = async () => {
      const scheduled = await isNotificationScheduled(notificationId);
      setIsScheduled(scheduled);
    };
    checkIfScheduled();
  }, [isNotificationScheduled, notificationId]);

  const schedule = async () => {
    const randomNumber = Math.floor(Math.random() * 1000);
    await scheduleNotification(
      notificationId,
      {
        title: 'Powiadomienie',
        description: `To jest powiadomienie [${randomNumber}]`,
        url: 'settings',
      },
      new Date(Date.now() + 5000)
    );
    setIsScheduled(true);
  };

  const cancel = async () => {
    await cancelNotification(notificationId);
    setIsScheduled(false);
  };

  return (
    <div>
      <Button onClick={schedule}>Zaplanuj powiadomienie za 5s</Button>
      <Button onClick={cancel} disabled={!isScheduled}>
        Odwołaj powiadomienie
      </Button>
      <p>{isScheduled ? 'Powiadomienie jest zaplanowane' : 'Powiadomienie nie jest zaplanowane'}</p>
    </div>
  );
}
