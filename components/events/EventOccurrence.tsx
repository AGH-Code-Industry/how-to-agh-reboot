'use client';

import { useEffect, useState } from 'react';
import { Toggle } from '@/components/ui/toggle';
import { Bell } from 'lucide-react';
import { EventOccurrenceDTO } from '@/types/Event';
import { useNotifications } from '@/hooks/useNotifications';

type Props = {
  eventId: number;
  occurrence: EventOccurrenceDTO;
};

export default function EventOccurrence({ eventId, occurrence }: Props) {
  const { scheduleNotification, cancelNotification, isNotificationScheduled, showToast } =
    useNotifications();
  const [isScheduled, setIsScheduled] = useState(false);

  useEffect(() => {
    const checkNotification = async () => {
      const scheduled = await isNotificationScheduled(occurrence.id.toString());
      setIsScheduled(scheduled);
    };

    checkNotification();
  }, [occurrence.id, isNotificationScheduled]);

  const handleToggle = async () => {
    const startTimeFormatted = occurrence.start.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    if (isScheduled) {
      await cancelNotification(occurrence.id.toString());
      showToast({
        title: 'Powiadomienie anulowane',
        description: `Powiadomienie dla ${startTimeFormatted} zostało anulowane`,
      });
    } else {
      const notificationData = {
        title: 'Przypomnienie o wydarzeniu',
        description: `Wydarzenie rozpocznie się o ${startTimeFormatted}`,
        url: `/events/${eventId}`,
      };
      const notificationTime = new Date(occurrence.start.getTime() - 15 * 60 * 1000); // 15 min before
      await scheduleNotification(occurrence.id.toString(), notificationData, notificationTime);
      showToast({
        title: 'Powiadomienie zaplanowane',
        description: `Dostaniesz przypomnienie 15 min przed ${startTimeFormatted}`,
      });
    }
    setIsScheduled(!isScheduled);
  };

  return (
    <div
      key={occurrence.start.toString()}
      className="flex items-center gap-2 text-muted-foreground"
    >
      {occurrence.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
      {occurrence.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      <Toggle onClick={handleToggle} pressed={isScheduled} size="sm">
        <Bell size={20} />
      </Toggle>
    </div>
  );
}
