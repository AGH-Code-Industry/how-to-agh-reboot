import { QrCode } from 'lucide-react';

type Props = {
  visited: boolean;
  ended: boolean;
};

export default function EventVisitedStatus({ visited, ended }: Props) {
  return (
    <>
      {visited ? (
        <div className="flex gap-2" data-testid="visit-status">
          <QrCode className="text-success" /> Wydarzenie odwiedzone
        </div>
      ) : (
        !ended && (
          <div className="flex gap-2" data-testid="qr-message">
            <QrCode className="text-info" /> Zeskanuj kod QR!
          </div>
        )
      )}
    </>
  );
}
