'use client';

import { Toggle } from '@/components/ui/toggle';
import { Bell } from 'lucide-react';
import { EventOccurrenceDTO } from '@/types/Event';

type Props = {
  occurrence: EventOccurrenceDTO;
};

export default function EventOccurrence({ occurrence }: Props) {
  return (
    <div
      key={occurrence.start.toString()}
      className="flex items-center gap-2 text-muted-foreground"
    >
      {occurrence.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
      {occurrence.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      <Toggle keepSvgStyle={true} size="sm">
        <Bell size={20} />
      </Toggle>
    </div>
  );
}
