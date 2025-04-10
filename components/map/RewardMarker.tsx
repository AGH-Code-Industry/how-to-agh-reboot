import { Popup } from 'maplibre-gl';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Marker, useMap } from 'react-map-gl/maplibre';
import { renderToString } from 'react-dom/server';
import type MapLibreGl from 'maplibre-gl';

const RewardPopup = () => {
  return (
    <div className="min-w-48 bg-background text-foreground">
      <h3 className="text-center text-base">Miejsce odbioru nagród</h3>
      <p className="mt-2 text-center">B1, pokój 1, parter</p>
      <p className="mt-2 text-center leading-tight">Odbiór upominków możliwy do godziny 14:45</p>
    </div>
  );
};

const RewardMarker = () => {
  const { current: mapRef } = useMap();
  const [popup, setPopup] = useState<Popup | null>(null);
  const rewardLocation = useRef<[number, number]>([19.919389, 50.065912]);

  const handleMarkerClick = useCallback(
    (e: MapLibreGl.MapMouseEvent) => {
      if (!mapRef) return;
      const markerElement = e.originalEvent.target as HTMLElement;
      if (!markerElement.closest('.reward-marker')) {
        if (popup) {
          popup.remove();
          setPopup(null);
        }
        return;
      }

      if (popup) {
        popup.remove();
        setPopup(null);
      }

      const newPopup = new Popup({ closeOnClick: true, offset: [0, -20] })
        .setLngLat(rewardLocation.current)
        .setHTML(renderToString(<RewardPopup />))
        .addTo(mapRef.getMap());

      setPopup(newPopup);
    },
    [mapRef, popup]
  );

  useEffect(() => {
    const map = mapRef?.getMap();

    if (!map) return;

    map.on('click', handleMarkerClick);
    return () => {
      map.off('click', handleMarkerClick);
    };
  }, [handleMarkerClick, mapRef]);

  return (
    <Marker longitude={rewardLocation.current[0]} latitude={rewardLocation.current[1]}>
      <img
        className="reward-marker"
        style={{ width: '40px' }}
        src="./images/reward.webp"
        alt="reward marker"
      />
    </Marker>
  );
};

export default RewardMarker;
