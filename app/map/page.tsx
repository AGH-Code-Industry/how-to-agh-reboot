'use client';
import Map from '@/components/map/Map';
import { trpc } from '@/trpc/client';
import { EventDTO } from '@/types/Event';
import { useEffect, useState } from 'react';

import MapFilter from '@/components/map/MapFilter';
import { MapRef } from 'react-map-gl/maplibre';
import { Drawer } from 'vaul';
import { ListFilter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AGHLeaveIndicator from '@/components/map/AGHLeaveIndicator';

export default function Page() {
  const [isOnAGH, setIsOnAGH] = useState<boolean>(true);

  const originalEvents = (
    (trpc.events.getEvents.useQuery({}).data ?? []) as unknown as EventDTO[]
  ).filter((event) => event.occurrences.length > 0 && event.display);

  const preFilteredEvents = (
    (trpc.events.getEvents.useQuery({}).data ?? []) as unknown as EventDTO[]
  ).filter((event) => event.occurrences.length > 0);

  const [filteredEvents, setFilteredEvents] = useState<EventDTO[]>([]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [mapRef, setMapRef] = useState<MapRef | undefined>(undefined);

  useEffect(() => {
    setFilteredEvents(preFilteredEvents);
  }, [preFilteredEvents.length]); // syf

  return (
    <div className="relative flex h-full">
      {/* Panel z filtrem */}

      <Drawer.Root
        open={isFilterOpen}
        onOpenChange={(open) => setIsFilterOpen(open)}
        direction="left"
      >
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="fixed left-0 top-0 z-50 flex h-[calc(100vh-63px)] w-[440px] max-w-[100vw] flex-col bg-background p-4 text-foreground shadow-lg">
            <MapFilter
              originalEvents={originalEvents}
              eventList={filteredEvents}
              onFilterChange={setFilteredEvents}
              onClose={() => setIsFilterOpen(false)}
              mapRef={mapRef}
            />
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>

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
