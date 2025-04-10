import { EventDTO } from '@/types/Event';
import { Button } from '../ui/button';
import Link from 'next/link';

export default function MapPopup({ event }: { event: EventDTO }) {
  return (
    <div className="min-w-36 bg-background text-foreground">
      <h2 className="text-center text-base">{event.name}</h2>
      <p className="mb-3 mt-5 text-center">
        Budynek {event.building.name}, sala {event.building.room}, {event.building.floor}
      </p>
      <Button asChild variant="default" className="w-full text-sm">
        <Link href={`/events/${event.id}`}>Zobacz więcej</Link>
      </Button>
    </div>
  );
}
