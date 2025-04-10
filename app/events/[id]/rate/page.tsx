import { PageLayout, PageTitle } from '@/components/layout/PageLayout';
import EventRate from '@/components/events/rate/EventRate';

export default async function EventsRatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsedId = parseInt(id, 10);

  if (isNaN(parsedId)) {
    throw new Error('Nie znaleziono żądanego wydarzenia');
  }

  return (
    <PageLayout className="size-full pb-16">
      <PageTitle>Ocen wydarzenie</PageTitle>
      <div className="flex size-full flex-col items-center gap-4">
        <EventRate eventId={parsedId} />
      </div>
    </PageLayout>
  );
}
