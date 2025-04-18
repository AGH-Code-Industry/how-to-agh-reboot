'use client';
import Map from '@/components/map/Map';
import { useEffect, useState } from 'react';

import MapFilter from '@/components/map/MapFilter';
import { ListFilter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AGHLeaveIndicator from '@/components/map/AGHLeaveIndicator';
import { useEventsStore } from '@/store/map/eventsStore';
import { EventDTO } from '@/types/Event';

type Props = {
  databaseEvents: EventDTO[];
};

export default function InnerPage({ databaseEvents }: Props) {
  const [isOnAGH, setIsOnAGH] = useState<boolean>(true);
  const setEventsFromDB = useEventsStore((state) => state.setEventsFromDB);

  useEffect(() => {
    if (databaseEvents == null) return;
    setEventsFromDB(databaseEvents);
  }, [databaseEvents, setEventsFromDB]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="relative flex h-full">
      <MapFilter isFilterOpen={isFilterOpen} setIsFilterOpen={setIsFilterOpen} />

      <Button
        onClick={() => setIsFilterOpen(true)}
        className="absolute left-4 top-4 z-40"
        variant="secondary"
      >
        <ListFilter />
      </Button>

      <Map onAGHLeaveOrEnter={setIsOnAGH} />

      {!isOnAGH && <AGHLeaveIndicator />}
    </div>
  );
}
