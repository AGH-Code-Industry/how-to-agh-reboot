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
          startTime: 1744365600,
          endTime: 1744369200,
          type: 'Organizacja',
          topic: 'Temat wydarzenia',
          faculty: 'Wydział',
          lng: 19.904866064457725,
          ltd: 50.06811457654741,
        },
        {
          name: 'Wydarzenie1',
          description:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Quisquam, quos.',
          startTime: 1744365600,
          endTime: 1744369200,
          type: 'Organizacja',
          topic: 'Temat wydarzenia',
          faculty: 'Wydział',
          lng: 19.894775786145075,
          ltd: 50.07555948129213,
        },
        {
          name: 'Wydarzenie2',
          description:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Quisquam, quos.',
          startTime: 1744365600,
          endTime: 1744369200,
          type: 'Organizacja',
          topic: 'Temat wydarzenia',
          faculty: 'Wydział',
          lng: 19.921165148046157,
          ltd: 50.06587412299132,
        },
        {
          name: 'Wydarzenie3',
          description:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Quisquam, quos.',
          startTime: 1744365600,
          endTime: 1744369200,
          type: 'Organizacja',
          topic: 'Temat wydarzenia',
          faculty: 'Wydział',
          lng: 19.91142336553323,
          ltd: 50.066397525213,
        },
        {
          name: 'Wydarzenie4',
          description:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Quisquam, quos.',
          startTime: 1744365600,
          endTime: 1744369200,
          type: 'Organizacja',
          topic: 'Temat wydarzenia',
          faculty: 'Wydział',
          lng: 19.9085051223135,
          ltd: 50.06904199647304,
        },
      ]}
    />
  );
}
