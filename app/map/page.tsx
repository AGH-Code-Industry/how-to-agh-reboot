'use client';
import Map from '@/components/map/Map';
import { useCallback } from 'react';

export default function Page() {
  const onAGHLeave = useCallback((isOnAGH: boolean) => console.log(isOnAGH), []);
  return (
    <Map
      onAGHLeaveOrEnter={onAGHLeave}
      eventList={[
        {
          name: 'Wydarzenie',
          description:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Quisquam, quos.',
          startTime: '12:00',
          endTime: '14:00',
          type: 'Organizacja',
          topic: 'Temat wydarzenia',
          faculty: 'Wydział',
          lng: 19.904866064457725,
          ltd: 50.06811457654741,
        },
      ]}
    />
  );
}
