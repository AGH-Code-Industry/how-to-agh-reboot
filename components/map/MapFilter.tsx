'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Drawer } from 'vaul';
import { trpc } from '@/trpc/client';
import { EventFilterMask, useEventsStore } from '@/store/map/eventsStore';

interface MapFilterProps {
  isFilterOpen: boolean;
  setIsFilterOpen: (open: boolean) => void;
}

export default function MapFilter({ isFilterOpen, setIsFilterOpen }: MapFilterProps) {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('-');
  const [selectedFieldOfStudy, setSelectedFieldOfStudy] = useState<string>('-');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [showPastEvents, setShowPastEvents] = useState<boolean>(false);

  const eventTypes = trpc.events.getEventTypes.useQuery().data;
  const fieldsOfStudyList = trpc.events.getFieldsOfStudy.useQuery().data;

  const eventsFilterMask = useEventsStore((state) => state.eventsFilterMask);
  const resetEventFilterMask = useEventsStore((state) => state.resetEventFilterMask);
  const setEventsFilterMask = useEventsStore((state) => state.setEventsFilterMask);

  useEffect(() => {
    setSearch(eventsFilterMask.search);
    setSelectedType(eventsFilterMask.eventType);
    setSelectedFieldOfStudy(eventsFilterMask.fieldOfStudy);
    setStartTime(eventsFilterMask.startTime);
    setEndTime(eventsFilterMask.endTime);
    setShowPastEvents(eventsFilterMask.showPastEvents);
  }, [eventsFilterMask]);

  const applyFilters = (withClose = true) => {
    const filterMask: EventFilterMask = {
      search,
      eventType: selectedType,
      fieldOfStudy: selectedFieldOfStudy,
      startTime,
      endTime,
      showPastEvents,
    };
    setEventsFilterMask(filterMask);

    if (withClose) {
      setIsFilterOpen(false);
    }
  };

  const resetFilters = () => {
    resetEventFilterMask();
    setIsFilterOpen(false);
  };

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
