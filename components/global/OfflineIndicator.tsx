'use client';

import { useOfflineDetection } from '@/hooks/useOfflineDetection';
import { WifiOff, Wifi } from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * Component that displays the current online/offline status
 */
export function OfflineIndicator() {
  const { isOnline, wasOffline } = useOfflineDetection();
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      // Show immediately when going offline
      setShowIndicator(true);
    } else if (wasOffline) {
      // Show briefly when coming back online
      setShowIndicator(true);
      const timer = setTimeout(() => {
        setShowIndicator(false);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      // Hide when online and wasn't recently offline
      setShowIndicator(false);
    }
  }, [isOnline, wasOffline]);

  if (!showIndicator) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg px-4 py-2 shadow-lg transition-all duration-300 ${
        isOnline
          ? 'bg-green-500 text-white'
          : 'bg-orange-500 text-white'
      }`}
      role="status"
      aria-live="polite"
    >
      {isOnline ? (
        <>
          <Wifi className="h-5 w-5" />
          <span className="text-sm font-medium">Połączono z internetem</span>
        </>
      ) : (
        <>
          <WifiOff className="h-5 w-5" />
          <span className="text-sm font-medium">Tryb offline</span>
        </>
      )}
    </div>
  );
}

