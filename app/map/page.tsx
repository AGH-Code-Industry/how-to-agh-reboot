'use client';
// import { trpc } from '@/trpc/server';
import { trpc } from '@/trpc/client';
import InnerPage from './InnerPage';

export default function Page() {
  const { data: databaseEvents, isLoading } = trpc.events.getEvents.useQuery({});

  if (isLoading || databaseEvents == null) {
    return (
      <div className="flex h-screen items-center justify-center text-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return <InnerPage databaseEvents={databaseEvents} />;
}
