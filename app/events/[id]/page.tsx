import EventDetails from '@/components/events/EventDetails';
import { PageLayout, PageSectionTitle, PageTitle } from '@/components/layout/PageLayout';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsedId = parseInt(id, 10);

  if (isNaN(parsedId)) {
    throw new Error('Invalid ID');
  }

  return (
    <PageLayout>
      <PageTitle>Wydarzenia</PageTitle>
      <PageSectionTitle>Aktywne wydarzenia</PageSectionTitle>
      <EventDetails id={parsedId} />
    </PageLayout>
  );
}
