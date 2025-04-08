import { EventDTO } from '@/types/Event';

export default function TourEvent({ event, onClick }: { event: EventDTO; onClick: () => void }) {
  return (
    <div
      className="grid grid-cols-[auto_10px] rounded-lg border-2 bg-background p-4 text-foreground shadow-md"
      onClick={onClick}
    >
      <div className={`flex flex-col gap-2 `}>
        <h3 className="text-lg font-semibold">{event.name}</h3>
        <p className="text-sm text-gray-500">
          {/* {event.start.toLocaleDateString()} {event.start.toLocaleTimeString()} */}
          {event.eventType.name}
        </p>
        <p className="text-sm text-gray-500">{event.building.name}</p>
        {event.occurrences[0] && (
          <p className="text-sm text-gray-500">
            {event.occurrences[0].start.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
            {' - '}
            {event.occurrences[0].end.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        )}
      </div>
      <div className="flex place-content-center items-center">
        <div className="h-min text-xl">&gt;</div>
      </div>
    </div>
  );
}
