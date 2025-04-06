import { EventDTO } from '@/types/Event';

export default function MapPopup({ event }: { event: EventDTO }) {
  const tableOfHours = event.occurrences.map((occurrence) => {
    const startFormatted = new Date(occurrence.start).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    const endFormatted = new Date(occurrence.end).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    return `${startFormatted} - ${endFormatted}`;
  });

  return (
    <div className="min-w-36 text-black">
      <h2 className="text-center text-base">{event.name}</h2>
      <p className="mt-3">
        <b>Czasy:</b> {tableOfHours.join(', ')}
      </p>
      <p>
        <b>Typ:</b> {event.eventType}
      </p>
      <p>
        <b>Budynek:</b> {event.building.name}
      </p>
      <p>
        <b>Wydział:</b> {event.fieldOfStudy[0]?.faculty?.name || 'Brak'}
      </p>
      <p className="mt-3">{event.description}</p>
    </div>
  );
}
