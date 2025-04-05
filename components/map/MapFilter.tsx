'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EventDTO } from '@/types/Event';

interface MapFilterProps {
  originalEvents: EventDTO[];
  eventList: EventDTO[];
  onFilterChange: (filteredEvents: EventDTO[]) => void;
  onClose: () => void;
}

export default function MapFilter({ originalEvents, onFilterChange, onClose }: MapFilterProps) {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('-');
  const [selectedRoute, setSelectedRoute] = useState<string>('-');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [showPastEvents, setShowPastEvents] = useState(true);

  const eventTypes = [...new Set(originalEvents.map((event) => event.eventType))];
  const routes = [
    ...new Set(originalEvents.flatMap((event) => event.occurrences.map((el) => el.tourId))),
  ];

  const applyFilters = () => {
    const now = new Date();

    let startDate = null;
    let endDate = null;

    if (startTime) {
      const [hours, minutes] = startTime.split(':');
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), +hours, +minutes);
    }

    if (endTime) {
      const [hours, minutes] = endTime.split(':');
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), +hours, +minutes);
    }

    const filtered = originalEvents
      .map((el) => ({ ...el }))
      .filter((event) => {
        let dateCheck = false;

        let newOccurrences = [...event.occurrences];

        for (const occurrence of event.occurrences) {
          const occStartHour = new Date(occurrence.start);
          occStartHour.setSeconds(0, 0);
          occStartHour.setFullYear(now.getFullYear(), now.getMonth(), now.getDate());

          const occEndHour = new Date(occurrence.end);
          occEndHour.setSeconds(0, 0);
          occEndHour.setFullYear(now.getFullYear(), now.getMonth(), now.getDate());

          if (
            (!startDate || occStartHour.getTime() >= startDate.getTime()) &&
            (!endDate || occEndHour.getTime() <= endDate.getTime()) &&
            (showPastEvents || occEndHour.getTime() >= now.getTime()) &&
            (selectedRoute === '-' || occurrence.tourId === Number(selectedRoute))
          ) {
            dateCheck = true;
            break;
          } else {
            newOccurrences = newOccurrences.filter((el) => el != occurrence);
          }
        }

        event.occurrences = newOccurrences;

        return (
          (search === '' ||
            event.name.toLowerCase().includes(search.toLowerCase()) ||
            (event.description &&
              event.description.toLowerCase().includes(search.toLowerCase()))) &&
          (selectedType === '-' || event.eventType === selectedType) &&
          dateCheck
        );
      });
    onFilterChange(filtered);
    onClose();
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedType('-');
    setSelectedRoute('-');
    setStartTime('');
    setEndTime('');
    setShowPastEvents(true);
    onFilterChange(originalEvents);
    onClose();
  };

  return (
    <div className="flex size-full flex-col bg-gradient-to-br from-green-800 via-black to-red-800 p-4 text-white">
      {/* Nagłówek */}
      <div className="mb-4 flex shrink-0 items-center justify-between">
        <h2 className="text-xl font-bold">Filtruj wydarzenia</h2>
        <button onClick={onClose} className="text-2xl text-white">
          ×
        </button>
      </div>

      {/* Przewijalna zawartość */}
      <div className="flex-1 overflow-y-auto pr-2">
        <Card className="border-none bg-transparent shadow-none">
          <CardContent className="grid grid-cols-1 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Wyszukaj:</label>
              <Input
                placeholder="Szukaj wydarzeń..."
                className="rounded-md border border-gray-300 bg-black p-2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Typ:</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="rounded-md border border-gray-300 bg-black p-2">
                  {selectedType}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={'-'}>-</SelectItem>
                  {eventTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Trasa:</label>
              <Select
                value={selectedRoute?.toString()}
                onValueChange={(val) => setSelectedRoute(val)}
              >
                <SelectTrigger className="rounded-md border border-gray-300 bg-black p-2">
                  {selectedRoute}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={'-'}>-</SelectItem>
                  {routes.map((route) => (
                    <SelectItem key={route} value={route.toString()}>
                      {route}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Godzina początkowa:</label>
              <Input
                type="time"
                className="rounded-md border border-gray-300 bg-black p-2"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Godzina końcowa:</label>
              <Input
                type="time"
                className="rounded-md border border-gray-300 bg-black p-2"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>

            <div className="mt-2 flex items-center gap-2">
              <Checkbox
                checked={showPastEvents}
                onCheckedChange={(checked) => setShowPastEvents(checked as boolean)}
              />
              <span>Pokaż zakończone wydarzenia</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Przyciski */}
      <div className="mt-4 flex shrink-0 gap-2">
        <Button onClick={applyFilters}>Zastosuj filtry</Button>
        <Button onClick={resetFilters} className="bg-gray-300 text-black hover:bg-gray-400">
          Pokaż wszystkie wydarzenia
        </Button>
      </div>
    </div>
  );
}
