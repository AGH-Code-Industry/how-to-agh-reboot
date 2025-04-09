import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { trpc } from '@/trpc/server';
import EventTypeBadge from '@/components/events/EventTypeBadge';
import FieldOfStudyBadge from '@/components/events/FieldOfStudyBadge';
import { MapPin } from 'lucide-react';
import Link from 'next/link';
import EventOccurrence from './EventOccurrence';
import { Button } from '@/components/ui/button';
import EventVisitedStatus from '@/components/events/EventVisitedStatus';
import { EventDTO } from '@/types/Event';
import { Exclusive } from '@/types/utils';

type Props = Exclusive<{ id: number }, { data: EventDTO }> & { showDetails?: boolean };

export default async function Event({ id, data, showDetails = false }: Props) {
  let event = undefined;

  if (id !== undefined) {
    const events = await trpc.events.getEvents({ eventId: id });

    if (events.length !== 1) {
      return <span>Nie znaleziono żądanego wydarzenia.</span>;
    }

    event = events[0];
  } else if (data !== undefined) {
    event = data;
  }

  if (event === undefined) {
    return <span>Nie znaleziono żądanego wydarzenia.</span>;
  }

  const activeOccurrence = event.occurrences.find(
    (occurrence) => new Date(occurrence.end) > new Date(Date.now())
  );

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="mt-2 flex flex-col gap-2">
          <div className="mb-1 flex flex-wrap justify-between gap-2">
            <EventTypeBadge eventType={event.eventType} />
            <Link
              href={`/map?event=${event.id}`}
              className="flex shrink-0 items-center gap-2 hover:underline"
            >
              <MapPin />
              {event.building.name}, {event.building.room}, {event.building.floor}
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
        {showDetails ? (
          <div>
            <p>Czas trwania:</p>
            <div className="mt-1 flex flex-col gap-1">
              {event.occurrences.map((o) => (
                <EventOccurrence key={o.start.toString()} occurrence={o} />
              ))}
            </div>
          </div>
        ) : activeOccurrence ? (
          <div>
            <p>Najbliższe występienie:</p>
            <EventOccurrence occurrence={activeOccurrence} />
            <Link href={'/events/' + event.id}>
              <Button size="sm" className="mt-1">
                {event.occurrences.length > 1 ? 'Zobacz więcej' : 'Zobacz szczegóły'}
              </Button>
            </Link>
          </div>
        ) : (
          <Link href={'/events/' + event.id} className="flex justify-center">
            <Button size="sm">Zobacz szczegóły</Button>
          </Link>
        )}

        <EventVisitedStatus visited={event.visited} ended={!activeOccurrence} />
      </CardContent>
    </Card>
  );
}
