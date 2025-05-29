import { trpc } from '@/trpc/server';
import InnerPage from './InnerPage';

export default async function Page() {
  const databaseEvents = await trpc.events.getEvents({});

  return <InnerPage databaseEvents={databaseEvents} />;
}
