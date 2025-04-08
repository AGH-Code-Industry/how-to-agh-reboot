import { Popup } from 'maplibre-gl';
import { useCallback, useEffect, useState } from 'react';
import { Marker, useMap } from 'react-map-gl/maplibre';
import { renderToString } from 'react-dom/server';
import type MapLibreGl from 'maplibre-gl';

const CampPopup = () => {
  return (
    <div className="min-w-36 bg-background text-foreground">
      <h3 className="text-center text-base">Miejsce odbioru nagród</h3>
    </div>
  );
};

const CampMarker = () => {
  const { current: mapRef } = useMap();
  const [popup, setPopup] = useState<Popup | null>(null);

  const handleMarkerClick = useCallback(
    (e: MapLibreGl.MapMouseEvent) => {
      if (!mapRef) return;
      const markerElement = e.originalEvent.target as HTMLElement;
      if (!markerElement.closest('.camp-marker')) {
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
        .setLngLat([19.907809, 50.068163])
        .setHTML(renderToString(<CampPopup />))
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
    <Marker longitude={19.907809} latitude={50.068163}>
      <img
        className="camp-marker"
        style={{ width: '40px' }}
        src="./images/camp.png"
        alt="camp marker"
      />
    </Marker>
  );
};

export default CampMarker;
