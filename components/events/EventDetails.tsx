import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { trpc } from '@/trpc/server';
import EventTypeBadge from '@/components/events/EventTypeBadge';
import FieldOfStudyBadge from '@/components/events/FieldOfStudyBadge';
import { MapPin } from 'lucide-react';
import Link from 'next/link';
import EventOccurrence from './EventOccurrence';
import EventVisitedStatus from '@/components/events/EventVisitedStatus';

type Props = {
  id: number;
};

export default async function EventDetails({ id }: Props) {
  const event = await trpc.events.getEvent({ id: id });

  const activeOccurrence = event.occurrences.find(
    (occurrence) => new Date(occurrence.end) > new Date(Date.now())
  );

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="mt-2 flex flex-col gap-2">
          <div className="flex justify-between gap-2">
            <EventTypeBadge eventType={event.eventType} />
            <Link
              href={`/map?event=${event.id}`}
              className="flex shrink-0 items-center gap-2 hover:underline"
            >
              <MapPin />
              {event.building.name}
            </Link>
          </div>
          <CardTitle className="leading-tight">{event.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-4">
        <p className="text-sm text-muted-foreground">{event.description}</p>
        <div>
          <p>{event.fieldOfStudy.length == 1 ? 'Powiązany kierunek:' : 'Powiązane kierunki:'}</p>
          <div className="mt-2 flex flex-wrap items-start gap-2">
            {event.fieldOfStudy.map((f) => (
              <FieldOfStudyBadge key={f.id} fieldOfStudy={f} />
            ))}
          </div>
        </div>
        <div>
          <p>Czas trwania:</p>
          <div className="mt-1 flex flex-col gap-1">
            {event.occurrences.map((o) => (
              <EventOccurrence key={o.start.toString()} occurrence={o} />
            ))}
          </div>
        </div>
        <EventVisitedStatus visited={event.visited} ended={!activeOccurrence} />
      </CardContent>
    </Card>
  );
}
