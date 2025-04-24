import { Badge } from '@/components/ui/badge';
import { EventTypeDTO } from '@/types/Event';

type Props = {
  eventType: EventTypeDTO;
};

export default function EventTypeBadge({ eventType }: Props) {
  return (
    <Badge
      style={{ backgroundColor: eventType.color }}
      className="size-fit"
      data-testid="EventTypeBadge"
    >
      {eventType.name}
    </Badge>
  );
}
