'use client';

import { Button } from '@/components/ui/button';
import { usePWA } from '@/components/layout/PWAContext';

export function RequestPWAButton() {
  const { deferredPrompt, setDeferredPrompt } = usePWA();

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the PWA installation');
      } else {
        console.log('User dismissed the PWA installation');
      }
      setDeferredPrompt(null);
    }
  };

  return (
    <Button onClick={handleInstallClick} disabled={!deferredPrompt}>
      Zainstaluj PWA
    </Button>
  );
}
