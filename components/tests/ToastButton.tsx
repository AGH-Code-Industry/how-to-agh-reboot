'use client';

import { Button } from '@/components/ui/button';
import { useNotifications } from '@/hooks/useNotifications';
import { redirect } from 'next/navigation';

export default function ToastButton() {
  const { showToast } = useNotifications();

  const showToastNotification = async () => {
    const toastData = {
      title: 'Toast',
      description: 'To jest przykładowy toast',
      button: {
        title: 'Ustawienia',
        action: () => {
          // Async to wait for toast to close because redirect cancels it
          setTimeout(() => redirect('settings'), 0);
        },
      },
    };

    await showToast(toastData);
  };

  return <Button onClick={showToastNotification}>Pokaż toast</Button>;
}
