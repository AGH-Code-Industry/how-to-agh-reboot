import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { trpc } from '@/trpc/server';
import EventTypeBadge from '@/components/events/EventTypeBadge';
import FieldOfStudyBadge from '@/components/events/FieldOfStudyBadge';
import { Bell, MapPin } from 'lucide-react';
import Link from 'next/link';
import { Toggle } from '@/components/ui/toggle';

type Props = {
  id: number;
};

export default async function Event({ id }: Props) {
  const event = await trpc.events.getEvent({ id: id });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{event.name}</CardTitle>
        <div className="mt-2 flex justify-between">
          <EventTypeBadge eventType={event.eventType} />
          <Link href={`/map?event=${event.id}`} className="flex items-center gap-2 hover:underline">
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
            <div className="mt-2 flex flex-col gap-2">
              {event.occurrences.map((o) => (
                <div key={o.start.toString()} className="flex items-center gap-2">
                  {o.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                  {o.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  <Toggle size="sm">
                    <Bell />
                  </Toggle>
                </div>
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
      </CardContent>
    </Card>
  );
}
