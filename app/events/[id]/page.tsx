import Event from '@/components/events/Event';
import { PageLayout, PageTitle } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsedId = parseInt(id, 10);

  if (isNaN(parsedId)) {
    throw new Error('Nie znaleziono żądanego wydarzenia');
  }

  return (
    <PageLayout>
      <PageTitle>Wydarzenie</PageTitle>
      <div className="flex flex-col items-center gap-4">
        <Event id={parsedId} showDetails={true} />
        <Link href="/events">
          <Button>Pokaż wszystkie</Button>
        </Link>
      </div>
    </PageLayout>
  );
}
