'use client';

import { useNotifications } from '@/hooks/useNotifications';
import './QRScanner.scss';

import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';
import { trpc } from '@/trpc/client';
import { useEffect, useMemo } from 'react';
import { SubmitQrResponseType } from '@/trpc/routers/qr';
import { CircleCheck, CircleX, Info } from 'lucide-react';
import { useCameraPermissions } from '@/hooks/useCameraPermissions';
import { useRouter } from 'next/navigation';

const typeToText = (type: SubmitQrResponseType) => {
  if (type === 'error') {
    return { title: 'Wystąpił błąd', icon: <CircleX className="pr-1 text-destructive" /> };
  }

  if (type === 'info') {
    return { title: 'Sukces', icon: <Info className="pr-1 text-info" /> };
  }

  if (type === 'success') {
    return { title: 'Sukces', icon: <CircleCheck className="pr-1 text-success" /> };
  }

  return { title: '' };
};

export default function QRScanner() {
  const { showToast } = useNotifications();
  const camera = useCameraPermissions();
  const router = useRouter();

  const { data, mutateAsync: submitQr } = trpc.qr.submitQr.useMutation();

  useEffect(() => {
    if (!data) {
      return;
    }

    const toastProperties = typeToText(data.type);

    showToast({
      title: toastProperties.title,
      description: data.message,
      icon: toastProperties.icon,
      vibrate: 200,
    });

    if (data.eventId !== undefined) {
      router.push(`/events/${data.eventId}/rate`);
    }
  }, [showToast, data, router]);

  const MemoizedScanner = useMemo(() => {
    const scanHandler = (codes: IDetectedBarcode[]) => {
      if (codes.length === 0) {
        return;
      }

      const value = codes[0].rawValue.replace('https://howtoagh.coin.agh.edu.pl/qr/', '');
      submitQr(value);
    };

    return (
      <Scanner
        classNames={{ container: 'relative', video: 'relative' }}
        onScan={(codes) => scanHandler(codes)}
        components={{
          torch: false,
        }}
        allowMultiple={true}
        scanDelay={1500}
      />
    );
  }, [submitQr]);

  return (
    <div className="flex size-full flex-col justify-center">
      {camera.hasPermission === false ? (
        <div className="flex flex-col items-center px-6">
          <Info />
          <span className="text-center">
            Aby korzystać ze skanera, musisz pozwolić aplikacji na wykorzystanie kamery.
          </span>
        </div>
      ) : (
        <>
          {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
          <div className="QRScanner-container">{MemoizedScanner}</div>
          <p className="mt-2 text-center text-sm text-muted-foreground">Umieść kod QR w ramce.</p>
        </>
      )}
    </div>
  );
}
