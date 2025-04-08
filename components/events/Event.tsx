import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { EventDTO } from '@/types/Event';
import EventTypeBadge from '@/components/events/EventTypeBadge';

export default function Event(event: EventDTO) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{event.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-4">
        <p className="text-sm text-muted-foreground">{event.description}</p>
        <EventTypeBadge eventType={event.eventType} />
        <div className="flex justify-end gap-2">
          <a href={'/events/' + event.id}>
            <Button variant="outline">Szczegóły</Button>
          </a>
          <Button>Rozpocznij</Button>
        </div>
      </CardContent>
    </Card>
  );
}
