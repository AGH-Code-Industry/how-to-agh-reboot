import { Marker } from 'react-map-gl/maplibre';
import { LngLat, Offset, Popup as Popup2 } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import './MapEvents.css';
import { renderToString } from 'react-dom/server';
import { EventDTO } from '@/types/Event';

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

type Props = {
  eventList: EventDTO[];
};

function getHTML(event: {
  longitude: number;
  latidute: number;
  name: string;
  start: string;
  end: string;
  description: string | null;
  type: string;
  topic?: string;
  faculty?: string;
}) {
  return renderToString(
    <div>
      <h1 className="text-center text-lg">{event.name}</h1>
      <p className="mt-3">
        <b>Czas:</b> {event.start} - {event.end}
      </p>
      <p>
        <b>Typ:</b> {event.type}
      </p>
      <p>
        <b>Temat:</b> {event.topic}
      </p>
      <p>
        <b>Wydział:</b> {event.faculty}
      </p>
      {event.description && <p className="mt-3">{event.description}</p>}
    </div>
  );
}

export default function MapEvents({ eventList }: Props) {
  // const events = trpc.events.getEvents.useQuery({}).data;

  return (
    <>
      {eventList?.map((event) => {
        const popup = new Popup2({
          offset: popupOffsets,
          className: 'text-black',
        })
          .setLngLat(new LngLat(event.longitude, event.latidute))
          .setHTML(
            getHTML({
              longitude: event.longitude,
              latidute: event.latidute,
              name: event.name,
              start: new Date(event.occurrences[0].start).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              }),
              end: new Date(event.occurrences[0].end).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              }),
              description: event.description,
              type: event.eventType,
              topic: event.fieldOfStudy[0]?.name,
              faculty: event.fieldOfStudy[0]?.faculty.name,
            })
          )
          .setMaxWidth('300px');

        return (
          <Marker
            key={event.id}
            longitude={event.longitude}
            latitude={event.latidute}
            color="red"
            popup={popup}
          />
        );
      })}
    </>
  );
}
