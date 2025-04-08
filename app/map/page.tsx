'use client';
import Map from '@/components/map/Map';
import { trpc } from '@/trpc/client';
import { EventDTO } from '@/types/Event';
import { MapEvent } from '@/types/Map/MapEvent';
import { useCallback, useEffect, useMemo, useState } from 'react';

import MapFilter from '@/components/map/MapFilter';
import TourDetails from '@/components/map/tourDetails/TourDetails';
import { MapRef } from 'react-map-gl/maplibre';
import { Drawer } from 'vaul';
import { ListFilter, Route } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Page() {
  const originalEvents = (
    (trpc.events.getEvents.useQuery({}).data ?? []) as unknown as EventDTO[]
  ).filter((event) => event.occurrences.length > 0);

  const preFilteredEvents = (
    (trpc.events.getEvents.useQuery({}).data ?? []) as unknown as EventDTO[]
  ).filter((event) => event.occurrences.length > 0);

  const [filteredEvents, setFilteredEvents] = useState<EventDTO[]>([]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [areTourDetailsOpen, setAreTourDetailsOpen] = useState(false);
  const [mapRef, setMapRef] = useState<MapRef | undefined>(undefined);

  useEffect(() => {
    setFilteredEvents(preFilteredEvents);
  }, [preFilteredEvents.length]); // syf

  const tours = useMemo(() => {
    const tours = filteredEvents.reduce((acc: Record<number, MapEvent[]>, event) => {
      event.occurrences.forEach((occurrence) => {
        const tourId = occurrence.tourId;

        if (!acc[tourId]) {
          acc[tourId] = [];
        }

        acc[tourId].push({
          lng: event.longitude,
          ltd: event.latidute,
          name: event.name,
          start: new Date(occurrence.start),
          end: new Date(occurrence.end),
          description: event.description ?? '',
          type: event.eventType,
          topic: event.fieldOfStudy.reduce((acc, fieldOfStudy) => {
            return acc + fieldOfStudy.name + ', ';
          }, ''),
          faculty: event.fieldOfStudy?.reduce((acc, fieldOfStudy) => {
            return acc + fieldOfStudy.faculty.name + ', ';
          }, ''),
        });
      });
      return acc;
    }, {});

    for (const key in tours) {
      tours[+key] = tours[+key].toSorted((a, b) => {
        return a.start.getTime() - b.start.getTime();
      });
    }

    return tours;
  }, [filteredEvents]);

  const tourKeys = Object.keys(tours);
  const tour = trpc.tours.getTours.useQuery({ tourId: Number(tourKeys[0]) }).data ?? [];

  const onAGHLeave = useCallback((isOnAGH: boolean) => console.log(isOnAGH), []);

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

      <Drawer.Root
        open={areTourDetailsOpen}
        onOpenChange={(open) => setAreTourDetailsOpen(open)}
        direction="left"
      >
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="fixed left-0 top-0 z-50 flex h-[calc(100vh-63px)] w-[440px] max-w-[100vw] flex-col bg-background p-4 text-foreground shadow-lg">
            <TourDetails
              tour={tour}
              onClose={() => setAreTourDetailsOpen(false)}
              map={mapRef}
              tourEvents={filteredEvents}
            />
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>

      {tourKeys.length == 1 && (
        <Button
          onClick={() => setAreTourDetailsOpen(true)}
          className="absolute left-4 top-[70px] z-40"
          variant="secondary"
        >
          {/* Szczegóły wycieczki */}
          <Route />
        </Button>
      )}

      <Map
        onAGHLeaveOrEnter={onAGHLeave}
        eventList={filteredEvents}
        tours={tours}
        ref={(mapRef) => setMapRef(mapRef)}
      />
    </div>
  );
}
