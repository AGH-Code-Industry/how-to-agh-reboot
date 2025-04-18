import { EventDTO } from '@/types/Event';
import { FeatureCollection } from 'geojson';
import { useCallback, useEffect, useState } from 'react';

const useGeoJsonData = (eventList: EventDTO[]) => {
  const getGeoJsonData = useCallback<() => FeatureCollection>(
    () => ({
      type: 'FeatureCollection',
      features: eventList.map((event) => {
        const foundOccurrence = event.occurrences.find(
          (occurrence) => occurrence.end.getTime() > Date.now()
        );

        return {
          type: 'Feature',
          properties: {
            cluster: false,
            ...event,
            eventTypeImageID: event.eventType.id,
            start_time: foundOccurrence?.start.toLocaleTimeString('en-GB', {
              hour: '2-digit',
              minute: '2-digit',
            }),
            end_time: foundOccurrence?.end.toLocaleTimeString('en-GB', {
              hour: '2-digit',
              minute: '2-digit',
            }),
          },
          geometry: {
            type: 'Point',
            coordinates: [event.longitude, event.latidute],
          },
        };
      }),
    }),
    [eventList]
  );

  const [geoJsonData, setGeoJsonData] = useState<FeatureCollection>(getGeoJsonData());

  useEffect(() => {
    setGeoJsonData(getGeoJsonData());
    const interval = setInterval(() => {
      setGeoJsonData(getGeoJsonData());
    }, 5000);

    return () => clearInterval(interval);
  }, [getGeoJsonData]);

  return geoJsonData;
};

export default useGeoJsonData;
