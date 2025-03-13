'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CustomDatePicker } from '@/components/ui/DataPicker';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

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
}

export default function MapFilter({ eventList, onFilterChange }: MapFilterProps) {
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
  const routes = ['Trasa A', 'Trasa B', 'Trasa C']; // Przykładowe trasy

  const applyFilters = () => {
    const now = new Date();
    const filtered = originalEvents.filter((event) => {
      const eventDate = new Date(`2023-01-01T${event.startTime}`); // Zakładamy format daty
      return (
        (search === '' || event.name.includes(search) || event.description.includes(search)) &&
        (!selectedType || event.type === selectedType) &&
        (!selectedRoute || event.faculty === selectedRoute) &&
        (!startDate || eventDate >= startDate) &&
        (!endDate || eventDate <= endDate) &&
        (!startTime || event.startTime >= startTime) &&
        (!endTime || event.endTime <= endTime) &&
        (showPastEvents || eventDate >= now)
      );
    });
    setFilteredEvents(filtered);
    onFilterChange(filtered);
  };

  const resetFilters = () => {
    setFilteredEvents(originalEvents);
    onFilterChange(originalEvents);
  };

  return (
    <div className="relative">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="absolute left-4 top-4 z-50 rounded-md bg-white/80 px-4 py-2 text-black shadow-md backdrop-blur-md hover:bg-white">
            Filtruj wydarzenia
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filtruj wydarzenia</DialogTitle>
          </DialogHeader>
          <Card className="p-4">
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Input
                placeholder="Szukaj wydarzeń..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
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
              <CustomDatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                placeholderText="Od daty"
              />
              <CustomDatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                placeholderText="Do daty"
              />
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="Od godziny"
              />
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="Do godziny"
              />
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={showPastEvents}
                  onCheckedChange={(checked) => setShowPastEvents(checked as boolean)}
                />
                <span>Pokaż zakończone wydarzenia</span>
              </div>
            </CardContent>
          </Card>
          <DialogFooter>
            <Button onClick={applyFilters}>Zastosuj filtry</Button>
            <Button onClick={resetFilters} className="ml-2 bg-gray-300 hover:bg-gray-400">
              Pokaż wszystkie wydarzenia
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
