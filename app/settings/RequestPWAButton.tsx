'use client';

import { Button } from '@/components/ui/button';
import { usePWA } from '@/components/layout/PWAContext';

export function RequestPWAButton() {
  const { deferredPrompt, setDeferredPrompt } = usePWA();

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    }
  };

  return (
    <Button onClick={handleInstallClick} disabled={!deferredPrompt}>
      Zainstaluj PWA
    </Button>
  );
}
