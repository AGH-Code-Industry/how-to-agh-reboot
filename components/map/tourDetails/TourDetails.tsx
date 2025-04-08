import { Card, CardContent } from '../../ui/card';
import TourEvent from './TourEvent';
import { useMemo } from 'react';
import { MapRef } from 'react-map-gl/maplibre';
import { EventDTO } from '@/types/Event';
import { Drawer } from 'vaul';
import { TourDTO } from '@/types/Tour';

type Props = {
  tour: TourDTO[];
  onClose: () => void;
  map: MapRef | undefined;
  tourEvents: EventDTO[];
};

const TourDetails = ({ tour, onClose, map, tourEvents }: Props) => {
  const tourEventsSorted = useMemo(() => {
    return tourEvents.sort(
      (a, b) =>
        new Date(b.occurrences[0].start).getTime() - new Date(a.occurrences[0].start).getTime()
    );
  }, [tourEvents]);

  if (tour.length === 0) {
    return null;
  }

  const handleClick = (event: EventDTO) => {
    const coordinates: [number, number] = [event.longitude, event.latidute];
    map?.getMap().easeTo({ center: coordinates, zoom: 17 });
    onClose();
  };

  return (
    <div className="flex size-full flex-col bg-background p-4 text-foreground">
      <Drawer.Title className="mb-4 flex shrink-0 items-center justify-between">
        <span className="text-xl font-bold">{tour[0].name}</span>
        <button onClick={onClose} className="text-2xl">
          ×
        </button>
      </Drawer.Title>

      <div className="flex-1 overflow-y-auto pr-2">
        <Card className="border-none bg-transparent pt-7 shadow-none">
          <CardContent className="grid grid-cols-1 gap-4 p-0">
            <div>
              <p className="text-center text-lg">{tour[0].description}</p>
            </div>

            <div>
              <label className="mb-1 mt-16 block text-sm font-medium">Wydarzenia:</label>
            </div>
            {tourEventsSorted.map((event) => (
              <TourEvent key={event.id} event={event} onClick={() => handleClick(event)} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TourDetails;
