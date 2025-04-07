'use client';

import { useNotifications } from '@/hooks/useNotifications';
import './QRScanner.scss';

import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';
import { trpc } from '@/trpc/client';
import { useEffect, useMemo } from 'react';
import { SubmitQrResponseType } from '@/trpc/routers/qr';
import { CircleCheck, CircleX, Info } from 'lucide-react';

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
  const notifications = useNotifications();
  const { data, mutateAsync: submitQr } = trpc.qr.submitQr.useMutation();

  useEffect(() => {
    if (!data) {
      return;
    }

    const toastProperties = typeToText(data.type);

    notifications.showToast({
      title: toastProperties.title,
      description: data.message,
      icon: toastProperties.icon,
      vibrate: 200,
    });
  }, [notifications, data]);

  const MemoizedScanner = useMemo(() => {
    const scanHandler = (codes: IDetectedBarcode[]) => {
      if (codes.length === 0) {
        return;
      }

      submitQr(codes[0].rawValue);
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
      {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
      <div className="QRScanner-container">{MemoizedScanner}</div>
      <p className="mt-2 text-center text-sm text-muted-foreground">Umieść kod QR w ramce.</p>
    </div>
  );
}
