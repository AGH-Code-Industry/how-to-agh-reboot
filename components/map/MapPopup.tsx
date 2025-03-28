import { MapEvent } from '@/types/Map/MapEvent';

export default function MapPopup({ event }: { event: MapEvent }) {
  return (
    <div className="min-w-36 text-black">
      <h2 className="text-center text-base">{event.name}</h2>
      <p className="mt-3">
        <b>Czas:</b> {event.startTime} - {event.endTime}
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
      <p className="mt-3">{event.description}</p>
    </div>
  );
}
