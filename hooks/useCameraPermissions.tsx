import { useState, useEffect } from 'react';

const useCameraPermissions = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const checkInitialPermission = async () => {
      try {
        if (navigator.permissions && navigator.permissions.query) {
          const permissionStatus = await navigator.permissions.query({ name: 'camera' });

          if (permissionStatus.state === 'granted') {
            setHasPermission(true);
          } else if (permissionStatus.state === 'denied') {
            setHasPermission(false);
          } else {
            setHasPermission(null);
          }

          permissionStatus.onchange = () => {
            if (permissionStatus.state === 'granted') {
              setHasPermission(true);
            } else if (permissionStatus.state === 'denied') {
              setHasPermission(false);
            } else {
              setHasPermission(null);
            }
          };
        }
      } catch {
        setHasPermission(false);
      }
    };

    checkInitialPermission();
  }, []);

  return { hasPermission };
};

export { useCameraPermissions };
