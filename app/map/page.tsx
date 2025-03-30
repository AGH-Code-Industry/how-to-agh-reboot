'use client';
import Map from '@/components/map/Map';
import { trpc } from '@/trpc/client';
import { EventDTO } from '@/types/Event';
import { MapEvent } from '@/types/Map/MapEvent';
import { useCallback } from 'react';

export default function Page() {
  const events = (trpc.events.getEvents.useQuery({}).data ?? []) as unknown as EventDTO[];

  console.log(events);

  const tours = events.reduce((acc: Record<number, MapEvent[]>, event) => {
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

  const onAGHLeave = useCallback((isOnAGH: boolean) => console.log(isOnAGH), []);
  return <Map onAGHLeaveOrEnter={onAGHLeave} eventList={events} tours={tours} />;
}
