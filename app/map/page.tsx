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
          name: 'Wydarzenie 1',
          description: 'Opis wydarzenia 1',
          startTime: '10:00',
          endTime: '12:00',
          type: 'Konferencja',
          topic: 'Technologia',
          faculty: 'Informatyka',
          lng: 19.904866064457725,
          ltd: 50.06811457654741,
        },
        {
          name: 'Wydarzenie 2',
          description: 'Opis wydarzenia 2',
          startTime: '14:00',
          endTime: '16:00',
          type: 'Warsztaty',
          topic: 'AI',
          faculty: 'Elektronika',
          lng: 19.910314,
          ltd: 50.06788,
        },
        {
          name: 'Wydarzenie 3',
          description: 'Opis wydarzenia 3',
          startTime: '18:00',
          endTime: '20:00',
          type: 'Spotkanie',
          topic: 'Networking',
          faculty: 'Biznes',
          lng: 19.907631,
          ltd: 50.069104,
        },
        {
          name: 'Hackathon 2024',
          description: 'Całonocne programowanie i konkursy IT',
          startTime: '20:00',
          endTime: '08:00',
          type: 'Hackathon',
          topic: 'Programowanie',
          faculty: 'Informatyka',
          lng: 19.904479,
          ltd: 50.067616,
        },
        {
          name: 'Wykład o ML',
          description: 'Wprowadzenie do Machine Learningu',
          startTime: '12:00',
          endTime: '14:00',
          type: 'Wykład',
          topic: 'Machine Learning',
          faculty: 'Elektronika',
          lng: 19.908457,
          ltd: 50.066214,
        },
        {
          name: 'Targi Pracy AGH',
          description: 'Spotkania z firmami, rekrutacje i prelekcje',
          startTime: '09:00',
          endTime: '15:00',
          type: 'Targi',
          topic: 'Kariera',
          faculty: 'Zarządzanie',
          lng: 19.904082,
          ltd: 50.069006,
        },
        {
          name: 'Kurs UX/UI',
          description: 'Podstawy projektowania interfejsów użytkownika',
          startTime: '15:00',
          endTime: '17:00',
          type: 'Warsztaty',
          topic: 'UX/UI',
          faculty: 'Grafika',
          lng: 19.910163,
          ltd: 50.068983,
        },
        {
          name: 'Spotkanie Koła Naukowego',
          description: 'Nowe projekty i rekrutacja do zespołu',
          startTime: '17:30',
          endTime: '19:00',
          type: 'Spotkanie',
          topic: 'Nauka',
          faculty: 'Mechanika',
          lng: 19.905255,
          ltd: 50.068798,
        },
        {
          name: 'Prelekcja o AI',
          description: 'Sztuczna Inteligencja w 2024 roku',
          startTime: '13:00',
          endTime: '15:00',
          type: 'Wykład',
          topic: 'AI',
          faculty: 'Informatyka',
          lng: 19.910902,
          ltd: 50.068323,
        },
      ]}
    />
  );
}
