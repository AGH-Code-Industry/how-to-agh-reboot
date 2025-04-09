import EventDetails from '@/components/events/EventDetails';
import { PageLayout, PageTitle } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsedId = parseInt(id, 10);

  if (isNaN(parsedId)) {
    throw new Error('Invalid ID');
  }

  return (
    <PageLayout>
      <PageTitle>Wydarzenie</PageTitle>
      <div className="flex flex-col items-center gap-4">
        <EventDetails id={parsedId} />
        <Link href="/events">
          <Button>Pokaż wszystkie</Button>
        </Link>
      </div>
    </PageLayout>
  );
}
