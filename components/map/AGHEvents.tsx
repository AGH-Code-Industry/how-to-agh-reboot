import { AGHEvent } from '@/types/Map/AGHEvent';
import { Marker } from 'react-map-gl/maplibre';
import { LngLat, Offset, Popup as Popup2 } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import './AGHEvents.css';

type Props = {
  eventList: AGHEvent[];
};

const markerHeight = 50,
  markerRadius = 20,
  linearOffset = 25;

const popupOffsets = {
  center: [0, 0],
  top: [0, 0],
  'top-left': [0, 0],
  'top-right': [0, 0],
  bottom: [0, -markerHeight],
  'bottom-left': [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
  'bottom-right': [-linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
  left: [markerRadius, (markerHeight - markerRadius) * -1],
  right: [-markerRadius, (markerHeight - markerRadius) * -1],
} satisfies Offset;

function getHTML(event: AGHEvent) {
  return `
  <div>
    <h1 class="text-lg text-center">${event.name}</h1>
    <p class="mt-3"><b>Czas:</b> ${event.startTime} - ${event.endTime}</p>
    <p><b>Typ:</b> ${event.type}</p>
    <p><b>Temat:</b> ${event.topic}</p>
    <p><b>Wydział:</b> ${event.faculty}</p>
    <p class="mt-3">${event.description}</p>
  </div>
`;
}

/**
 * TODO: W przyszłości może zmienić na pobieranie z bazy
 */

export default function AGHEvents(props: Props) {
  return (
    <>
      {props.eventList.map((event) => {
        const popup = new Popup2({
          offset: popupOffsets,
          className: 'text-black',
        })
          .setLngLat(new LngLat(event.lng, event.ltd))
          .setHTML(getHTML(event))
          .setMaxWidth('300px');

        return (
          <Marker
            key={event.name}
            longitude={event.lng}
            latitude={event.ltd}
            color="red"
            popup={popup}
          />
        );
      })}
    </>
  );
}
