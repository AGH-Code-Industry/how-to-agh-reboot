'use client';
import Map from '@/components/map/Map';
import { trpc } from '@/trpc/client';
import { EventDTO } from '@/types/Event';
import { MapEvent } from '@/types/Map/MapEvent';
import { useCallback, useEffect, useMemo, useState } from 'react';

import MapFilter from '@/components/map/MapFilter';

export default function Page() {
  const originalEvents = (
    (trpc.events.getEvents.useQuery({}).data ?? []) as unknown as EventDTO[]
  ).filter((event) => event.occurrences.length > 0);

  const preFilteredEvents = (
    (trpc.events.getEvents.useQuery({}).data ?? []) as unknown as EventDTO[]
  ).filter((event) => event.occurrences.length > 0);

  const [filteredEvents, setFilteredEvents] = useState<EventDTO[]>([]);

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

  const onAGHLeave = useCallback((isOnAGH: boolean) => console.log(isOnAGH), []);

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="relative flex h-full">
      {/* Panel z filtrem */}
      <div
        className={`fixed left-0 top-0 z-50 flex h-[calc(100vh-63px)] w-[440px] max-w-[100vw] flex-col bg-gradient-to-br from-green-800 via-black to-red-800 p-4 text-white shadow-lg transition-all duration-300 ${
          isFilterOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <MapFilter
          originalEvents={originalEvents}
          eventList={filteredEvents}
          onFilterChange={setFilteredEvents}
          onClose={() => setIsFilterOpen(false)}
        />
      </div>

      {/* Mapa zajmuje resztę miejsca */}
      <div className={`flex-1 transition-all ${isFilterOpen ? 'opacity-50' : ''}`}>
        <button
          onClick={() => setIsFilterOpen(true)}
          className="absolute left-4 top-4 z-40 rounded-md bg-white/80 px-4 py-2 text-black shadow-md backdrop-blur-md hover:bg-white"
        >
          Filtruj wydarzenia
        </button>
      </div>
      <Map onAGHLeaveOrEnter={onAGHLeave} eventList={filteredEvents} tours={tours} />
    </div>
  );
}
