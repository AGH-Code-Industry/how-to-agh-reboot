'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CustomDatePicker } from '@/components/ui/DataPicker';

interface Event {
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  type: string;
  topic: string;
  faculty: string;
  lng: number;
  ltd: number;
}

interface MapFilterProps {
  eventList: Event[];
  onFilterChange: (filteredEvents: Event[]) => void;
  onClose: () => void;
}

export default function MapFilter({ eventList, onFilterChange, onClose }: MapFilterProps) {
  const [originalEvents, setOriginalEvents] = useState<Event[]>(eventList);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(eventList);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [showPastEvents, setShowPastEvents] = useState(true);

  useEffect(() => {
    if (originalEvents.length === 0) {
      setOriginalEvents(eventList);
    }
  }, [eventList]);

  const eventTypes = [...new Set(originalEvents.map((event) => event.type))];
  const routes = ['Trasa A', 'Trasa B', 'Trasa C'];

  const applyFilters = () => {
    const now = new Date();
    const filtered = originalEvents.filter((event) => {
      const eventDate = new Date(`2023-01-01T${event.startTime}`);
      return (
        (search === '' || event.name.includes(search) || event.description.includes(search)) &&
        (!selectedType || event.type === selectedType) &&
        (!selectedRoute || event.faculty === selectedRoute) &&
        (!startDate || eventDate.getTime() >= startDate.getTime()) &&
        (!endDate || eventDate.getTime() <= endDate.getTime()) &&
        (!startTime || event.startTime >= startTime) &&
        (!endTime || event.endTime <= endTime) &&
        (showPastEvents || eventDate.getTime() >= now.getTime())
      );
    });
    setFilteredEvents(filtered);
    onFilterChange(filtered);
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedType(null);
    setSelectedRoute(null);
    setStartDate(null);
    setEndDate(null);
    setStartTime('');
    setEndTime('');
    setShowPastEvents(true);
    setFilteredEvents(originalEvents);
    onFilterChange(originalEvents);
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Typ:</label>
              <Select value={selectedType || undefined} onValueChange={setSelectedType}>
                <SelectTrigger>Typ</SelectTrigger>
                <SelectContent>
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
              <Select value={selectedRoute || undefined} onValueChange={setSelectedRoute}>
                <SelectTrigger>Wybierz trasę</SelectTrigger>
                <SelectContent>
                  {routes.map((route) => (
                    <SelectItem key={route} value={route}>
                      {route}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Data początkowa:</label>
              <CustomDatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                placeholderText="Od daty"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Godzina początkowa:</label>
              <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Data końcowa:</label>
              <CustomDatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                placeholderText="Do daty"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Godzina końcowa:</label>
              <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
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
