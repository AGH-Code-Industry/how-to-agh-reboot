'use client';
import Map from '@/components/map/Map';
import { trpc } from '@/trpc/client';
import { EventDTO } from '@/types/Event';
import { useEffect, useMemo, useState } from 'react';

import MapFilter from '@/components/map/MapFilter';
import { MapRef } from 'react-map-gl/maplibre';
import { ListFilter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AGHLeaveIndicator from '@/components/map/AGHLeaveIndicator';

export default function Page() {
  const [isOnAGH, setIsOnAGH] = useState<boolean>(true);

  const { data: databaseEvents } = trpc.events.getEvents.useQuery({});

  const originalEvents = useMemo(() => {
    if (!databaseEvents) return [];

    return databaseEvents.filter((event) => event.occurrences.length > 0 && event.display);
  }, [databaseEvents]);

  const [filteredEvents, setFilteredEvents] = useState<EventDTO[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [mapRef, setMapRef] = useState<MapRef | undefined>(undefined);

  useEffect(() => {
    setFilteredEvents([...originalEvents]);
  }, [originalEvents]);

  return (
    <div className="relative flex h-full">
      {/* Panel z filtrem */}

      <MapFilter
        originalEvents={originalEvents}
        eventList={filteredEvents}
        onFilterChange={setFilteredEvents}
        // onClose={() => setIsFilterOpen(false)}
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        mapRef={mapRef}
      />

      {/* Mapa zajmuje resztę miejsca */}
      <Button
        onClick={() => setIsFilterOpen(true)}
        className="absolute left-4 top-4 z-40"
        variant="secondary"
      >
        {/* Filtruj wydarzenia */}
        <ListFilter />
      </Button>

      <Map
        onAGHLeaveOrEnter={setIsOnAGH}
        eventList={filteredEvents}
        ref={(mapRef) => setMapRef(mapRef)}
      />

      {!isOnAGH && <AGHLeaveIndicator />}
    </div>
  );
}
