'use client';

import { Button } from '@/components/ui/button';
import { useNotifications } from '@/hooks/useNotifications';

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
  const { scheduleNotification } = useNotifications();

  const send = async () => {
    const randomNumber = Math.floor(Math.random() * 1000);
    await scheduleNotification(
      {
        title: 'Powiadomienie',
        description: `To jest powiadomienie [${randomNumber}]`,
        url: 'settings',
      },
      new Date(Date.now() + 5000)
    );
  };

  return <Button onClick={send}>Zaplanuj powiadomienie za 5s</Button>;
}
