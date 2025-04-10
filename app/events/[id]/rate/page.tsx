import { PageLayout, PageTitle } from '@/components/layout/PageLayout';
import EventRate from '@/components/events/rate/EventRate';
import { trpc } from '@/trpc/server';
import { ReactNode } from 'react';

export default async function EventsRatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsedId = parseInt(id, 10);

  if (isNaN(parsedId)) {
    return (
      <ContentWrapper>
        <span>Nie znaleziono żądanego wydarzenia</span>
      </ContentWrapper>
    );
  }

  const events = await trpc.events.getEvents({ eventId: parsedId });

  if (events.length !== 1) {
    return (
      <ContentWrapper>
        <span>Nie znaleziono żądanego wydarzenia</span>
      </ContentWrapper>
    );
  }

  const event = events[0];

  return (
    <ContentWrapper>
      <EventRate eventId={parsedId} eventName={event.name} />
    </ContentWrapper>
  );
}

const ContentWrapper = ({ children }: { children: ReactNode }) => (
  <PageLayout className="size-full pb-16">
    <PageTitle>Oceń wydarzenie</PageTitle>
    <div className="flex size-full flex-col items-center gap-4">{children}</div>
  </PageLayout>
);
