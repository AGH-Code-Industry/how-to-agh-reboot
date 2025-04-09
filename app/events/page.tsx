import { PageLayout, PageTitle } from '@/components/layout/PageLayout';
import { trpc } from '@/trpc/server';
import Event from '@/components/events/Event';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventDTO } from '@/types/Event';

type EventListProps = {
  events: EventDTO[];
};

function EventList({ events }: EventListProps) {
  return (
    <div className="flex flex-col gap-4">
      {events.map((event) => (
        <Event key={event.id} data={event} />
      ))}
    </div>
  );
}

export default async function Tasks() {
  const events = await trpc.events.getEvents({});
  const now = new Date();
  const activeEvents = events.filter((event) => event.occurrences.some((o) => o.end >= now));
  const pastEvents = events.filter((event) => event.occurrences.every((o) => o.end < now));

  return (
    <PageLayout>
      <PageTitle>Wydarzenia</PageTitle>
      <Tabs defaultValue="active">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Aktywne</TabsTrigger>
          <TabsTrigger value="past">Minione</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <EventList events={activeEvents} />
        </TabsContent>
        <TabsContent value="past">
          <EventList events={pastEvents} />
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}
