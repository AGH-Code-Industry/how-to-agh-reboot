'use client';
import Map from '@/components/map/Map';
import { trpc } from '@/trpc/client';
import { useCallback, useState } from 'react';

export default function Page() {
  const events = trpc.events.getEvents.useQuery({}).data;

  let tours = events?.reduce(
    (
      acc: {
        [key: number]: Array<{
          longitude: number;
          latitude: number;
          name: string;
          start: Date;
          end: Date;
          description: string | null;
          type: string;
          topic: string;
          faculty: string;
        }>;
      },
      event
    ) => {
      event.occurrences.forEach((occurrence) => {
        const tourId = occurrence.tourId;

        if (!acc[tourId]) {
          acc[tourId] = [];
        }

        acc[tourId].push({
          longitude: event.longitude,
          latitude: event.latidute,
          name: event.name,
          start: new Date(occurrence.start),
          end: new Date(occurrence.end),
          description: event.description,
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
    },
    {}
  );

  for (let key in tours) {
    tours[+key] = tours[+key].toSorted((a, b) => {
      return a.start.getTime() - b.start.getTime();
    });
  }

  // const tours = trpc.tours.getTours.useQuery({}).data?.reduce<Record<number, {start: string, end: string}[]>>((acc, tour) => {
  //   const tourId = tour.id;

  //   acc[tourId] = tour.events.toSorted((a, b) => (new Date(a.start)).getTime() - (new Date(b.start)).getTime()).map((event) => ({
  //       return events?.find()
  //   }));

  //   return acc;
  // }, {});

  // const [tourId, setTourId] = useState<number|null>(null);
  // const [pattern, setPattern] = useState('');
  // const [events, setEvents] = useState<any[]>();

  // useEffect(() => {

  // }, [pattern, tourId]);

  // const [selectedTourId, setSelectedTourId] = useState<number | null>(null);

  // const [filteredTour, setFilteredTour] = useState();

  // useEffect(() => {
  //   const tour = trpc.tours.getTours.useQuery({ tourId: 4 }).data;
  //   const result = {};
  //   events?.forEach((event) => {});
  // }, [selectedTourId]);

  // const originalTours = trpc.tours.getTours.useQuery({ tourId: 4 }).data[0];

  // // const originalTours = trpc.events.getEvents({tourId: 4});

  // const filteredTours = console.log(tours);

  const onAGHLeave = useCallback((isOnAGH: boolean) => console.log(isOnAGH), []);
  return <Map onAGHLeaveOrEnter={onAGHLeave} eventList={events} />;
}
