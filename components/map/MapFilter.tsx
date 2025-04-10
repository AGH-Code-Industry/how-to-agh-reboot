'use client';

import { useCallback, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EventDTO } from '@/types/Event';
import { Drawer } from 'vaul';
import { MapRef } from 'react-map-gl/maplibre';
import { trpc } from '@/trpc/client';
import Cookies from 'js-cookie';

interface MapFilterProps {
  mapRef: MapRef | undefined;
  originalEvents: EventDTO[];
  eventList: EventDTO[];
  onFilterChange: (filteredEvents: EventDTO[]) => void;
  isFilterOpen: boolean;
  setIsFilterOpen: (open: boolean) => void;
}

export default function MapFilter({
  originalEvents,
  onFilterChange,
  mapRef,
  isFilterOpen,
  setIsFilterOpen,
}: MapFilterProps) {
  const [search, setSearch] = useState(Cookies.get('name') ?? '');
  const [selectedType, setSelectedType] = useState<string>(Cookies.get('type') ?? '-');
  const [selectedFieldOfStudy, setSelectedFieldOfStudy] = useState<string>(
    Cookies.get('fieldOfStudy') ?? '-'
  );
  const [startTime, setStartTime] = useState<string>(Cookies.get('startTime') ?? '');
  const [endTime, setEndTime] = useState<string>(Cookies.get('endTime') ?? '');
  const [showPastEvents, setShowPastEvents] = useState<boolean>(
    Cookies.get('showPastEvents') ? Cookies.get('showPastEvents') === 'false' : false
  );

  const eventTypes = trpc.events.getEventTypes.useQuery().data;

  const fieldsOfStudyList = trpc.events.getFieldsOfStudy.useQuery().data;

  const zoomInToEvents = useCallback(
    (eventList: EventDTO[]) => {
      const map = mapRef?.getMap();
      if (!map) return;

      // Brak eventów – nie robimy nic
      if (eventList.length === 0) return;

      // Jeśli jest dokładnie jedno wydarzenie, przybliżamy się na nie
      if (eventList.length === 1) {
        const singleEvent = eventList[0];
        map.easeTo({
          center: [singleEvent.longitude, singleEvent.latidute],
          zoom: 18, // lub inny docelowy zoom
          duration: 600,
        });
        return;
      }

      // W innym wypadku (więcej niż 1 event) ustawiamy bounding box
      const [minLng, minLat, maxLng, maxLat] = eventList.reduce(
        ([minLng, minLat, maxLng, maxLat], event) => [
          Math.min(minLng, event.longitude),
          Math.min(minLat, event.latidute),
          Math.max(maxLng, event.longitude),
          Math.max(maxLat, event.latidute),
        ],
        [180, 90, -180, -90]
      );

      // Jeśli bounding box sprowadza się do jednego punktu (te same współrzędne)
      if (minLng === maxLng && minLat === maxLat) {
        map.easeTo({
          center: [minLng, minLat],
          zoom: 14,
          duration: 600,
        });
      } else {
        map.fitBounds(
          [
            [minLng, minLat],
            [maxLng, maxLat],
          ],
          {
            padding: 50,
            duration: 600,
            bearing: -30,
          }
        );
      }
    },
    [mapRef]
  );

  const applyFilters = (withClose = true) => {
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

        const isAvailableFieldOfStudy = event.fieldOfStudy.find(
          (el) => el.name === selectedFieldOfStudy
        );

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
            (showPastEvents || occEndHour.getTime() >= now.getTime())
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
          (selectedType === '-' || event.eventType.name === selectedType) &&
          dateCheck &&
          (selectedFieldOfStudy === '-' || isAvailableFieldOfStudy != undefined)
        );
      });

    Cookies.set('name', search, { expires: 365 });
    Cookies.set('type', selectedType, { expires: 365 });
    Cookies.set('fieldOfStudy', selectedFieldOfStudy, { expires: 365 });
    Cookies.set('startTime', startTime, { expires: 365 });
    Cookies.set('endTime', endTime, { expires: 365 });
    Cookies.set('showPastEvents', showPastEvents.toString(), { expires: 365 });

    onFilterChange(filtered);

    if (withClose) {
      zoomInToEvents(filtered);
      setIsFilterOpen(false);
    }
  };

  const resetFilters = () => {
    setSearch('');

    Cookies.set('name', '', { expires: 365 });
    Cookies.set('type', '-', { expires: 365 });
    Cookies.set('fieldOfStudy', '-', { expires: 365 });
    Cookies.set('startTime', '', { expires: 365 });
    Cookies.set('endTime', '', { expires: 365 });
    Cookies.set('showPastEvents', 'false', { expires: 365 });

    setSelectedType('-');
    setSelectedFieldOfStudy('-');
    setStartTime('');
    setEndTime('');
    setShowPastEvents(false);
    zoomInToEvents(originalEvents);
    onFilterChange(originalEvents);
    setIsFilterOpen(false);
  };

  useEffect(() => {
    setTimeout(() => {
      applyFilters(false);
    }, 2);
  }, [originalEvents]);

  return (
    <Drawer.Root
      open={isFilterOpen}
      onOpenChange={(open) => setIsFilterOpen(open)}
      direction="left"
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="fixed left-0 top-0 z-50 flex h-[calc(100vh-63px)] w-[440px] max-w-[100vw] flex-col bg-background p-4 text-foreground shadow-lg">
          <div className="flex size-full flex-col bg-background p-4 text-foreground">
            {/* Nagłówek */}
            <Drawer.Title className="mb-4 flex shrink-0 items-center justify-between">
              <span className="text-xl font-bold">Filtruj wydarzenia</span>
              <button onClick={() => setIsFilterOpen(false)} className="text-2xl ">
                ×
              </button>
            </Drawer.Title>

            {/* Przewijalna zawartość */}
            <div className="flex-1 overflow-y-auto pr-2">
              <Card className="border-none bg-transparent shadow-none">
                <CardContent className="grid grid-cols-1 gap-4 p-0">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Wyszukaj:</label>
                    <Input
                      placeholder="Szukaj wydarzeń..."
                      className="rounded-md border p-2"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">Typ:</label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger className="rounded-md border p-2">
                        {selectedType}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={'-'}>-</SelectItem>
                        {eventTypes?.map((type) => (
                          <SelectItem key={type.id} value={type.name}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">Kierunek:</label>
                    <Select value={selectedFieldOfStudy} onValueChange={setSelectedFieldOfStudy}>
                      <SelectTrigger className="rounded-md border p-2">
                        {selectedFieldOfStudy}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={'-'}>-</SelectItem>
                        {fieldsOfStudyList?.map((fieldOfStudy) => (
                          <SelectItem key={fieldOfStudy.id} value={fieldOfStudy.name}>
                            {fieldOfStudy.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">Godzina początkowa:</label>
                    <Input
                      type="time"
                      className="rounded-md border p-2"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">Godzina końcowa:</label>
                    <Input
                      type="time"
                      className="rounded-md border p-2"
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
              <Button onClick={() => applyFilters()}>Zastosuj filtry</Button>
              <Button onClick={resetFilters} className="">
                Reset
              </Button>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
