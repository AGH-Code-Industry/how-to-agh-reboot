'use client';

import { useEffect, useState } from 'react';
import { Toggle } from '@/components/ui/toggle';
import { Bell, BellRing } from 'lucide-react';
import { EventOccurrenceDTO } from '@/types/Event';
import { useNotifications } from '@/hooks/useNotifications';

type Props = {
  eventId: number;
  eventName: string;
  eventLocation: string;
  occurrence: EventOccurrenceDTO;
};

export default function EventOccurrence({ eventId, eventName, eventLocation, occurrence }: Props) {
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

  const [disabled, setDisabled] = useState<boolean>(false);

  useEffect(() => {
    const isDisabled = () => {
      const notificationTime = new Date(occurrence.start.getTime() - 15 * 60 * 1000); // 15 min before
      return notificationTime.getTime() <= Date.now();
    };

    setDisabled(isDisabled());
    const interval = setInterval(() => {
      setDisabled(isDisabled());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleToggle = async () => {
    const notificationTime = new Date(occurrence.start.getTime() - 15 * 60 * 1000); // 15 min before

    if (isScheduled) {
      await cancelNotification(occurrence.id.toString());
      showToast({
        title: 'Powiadomienie anulowane',
        description: `Przypomnienie o ${formatTime(notificationTime)} zostało anulowane`,
      });
    } else {
      const notificationData = {
        title: 'Przypomnienie o wydarzeniu',
        description: `${eventName}\nGodzina: ${formatTime(occurrence.start)} - ${formatTime(occurrence.end)}\nLokalizacja: ${eventLocation}`,
        url: `/events/${eventId}`,
        keepAfterClick: true,
      };

      await scheduleNotification(occurrence.id.toString(), notificationData, notificationTime);
      showToast({
        title: 'Powiadomienie zaplanowane',
        description: `Dostaniesz przypomnienie 15 min przed wydarzeniem (${formatTime(notificationTime)})`,
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
      <Toggle
        onClick={handleToggle}
        pressed={isScheduled}
        size="sm"
        className="data-[state=on]:bg-successAlert data-[state=on]:text-successAlert-foreground"
        disabled={disabled}
      >
        {isScheduled ? <BellRing size={20} /> : <Bell size={20} />}
      </Toggle>
    </div>
  );
}

const formatTime = (date: Date) =>
  date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
