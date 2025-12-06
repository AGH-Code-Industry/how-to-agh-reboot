'use client';

import { useState, useEffect } from 'react';

/**
 * Hook for detecting online/offline status
 */
export function useOfflineDetection() {
  const [isOnline, setIsOnline] = useState(true);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    // Check initial status
    setIsOnline(navigator.onLine);

    // Handle online event
    const handleOnline = () => {
      setIsOnline(true);
      setWasOffline(true);
      
      // Reset wasOffline after a delay
      setTimeout(() => {
        setWasOffline(false);
      }, 3000);
    };

    // Handle offline event
    const handleOffline = () => {
      setIsOnline(false);
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    isOnline,
    isOffline: !isOnline,
    wasOffline, // Indicates if the app just came back online
  };
}

