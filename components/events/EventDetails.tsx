import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { trpc } from '@/trpc/server';
import EventTypeBadge from '@/components/events/EventTypeBadge';
import FieldOfStudyBadge from '@/components/events/FieldOfStudyBadge';
import { MapPin, QrCode } from 'lucide-react';
import Link from 'next/link';
import EventOccurrence from './EventOccurrence';

type Props = {
  id: number;
};

export default async function Event({ id }: Props) {
  const event = await trpc.events.getEvent({ id: id });

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="mt-2 flex justify-between gap-2">
          <div className="flex flex-col gap-2">
            <EventTypeBadge eventType={event.eventType} />
            <CardTitle>{event.name}</CardTitle>
          </div>
          <Link
            href={`/map?event=${event.id}`}
            className="flex shrink-0 items-center gap-2 hover:underline"
          >
            <MapPin />
            {event.building.name}
          </Link>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-4">
        <p className="text-sm text-muted-foreground">{event.description}</p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p>Czas trwania:</p>
            <div className="mt-1 flex flex-col gap-1">
              {event.occurrences.map((o) => (
                <EventOccurrence key={o.start.toString()} occurrence={o} />
              ))}
            </div>
          </div>
          <div>
            <p>{event.fieldOfStudy.length == 1 ? 'Powiązany kierunek:' : 'Powiązane kierunki:'}</p>
            <div className="mt-2 flex flex-wrap items-start gap-2">
              {event.fieldOfStudy.map((f) => (
                <FieldOfStudyBadge key={f.id} fieldOfStudy={f} />
              ))}
            </div>
          </div>
        </div>
        <div>
          {event.visited ? (
            <div className="flex gap-2">
              <QrCode className="text-success" /> Wydarzenie odwiedzone
            </div>
          ) : (
            <div className="flex gap-2">
              <QrCode className="text-info" /> Zeskanuj kod QR!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
