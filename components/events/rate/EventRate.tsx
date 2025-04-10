'use client';

import StarsRating from './StarsRating';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { trpc } from '@/trpc/client';
import { useNotifications } from '@/hooks/useNotifications';
import { CircleCheck, CircleX, Info, Loader2 } from 'lucide-react';
import { RateEventResponse } from '@/trpc/routers/rating';
import { useRouter } from 'next/navigation';

type Props = {
  eventId: number;
};

const typeToText = (type: RateEventResponse['type']) => {
  if (type === 'error') {
    return { title: 'Wystąpił błąd', icon: <CircleX className="pr-1 text-destructive" /> };
  }

  if (type === 'info') {
    return { title: 'Sukces', icon: <Info className="pr-1 text-info" /> };
  }

  if (type === 'success') {
    return { title: 'Sukces', icon: <CircleCheck className="pr-1 text-success" /> };
  }

  return { title: '' };
};

export default function EventRate({ eventId }: Props) {
  const [rating, setRating] = useState(3);
  const { showToast } = useNotifications();
  const router = useRouter();

  const handleRatingChange = useCallback((rating: number) => {
    setRating(rating);
  }, []);

  const { data: events } = trpc.events.getEvents.useQuery({ eventId: eventId });
  const { data: rateResult, mutate: rateEvent, isPending } = trpc.rating.rateEvent.useMutation();

  const event = useMemo(() => (events?.length === 1 ? events[0] : null), [events]);

  const sendRating = useCallback(async () => {
    rateEvent({ eventId, rating });
  }, [rateEvent, rating, eventId]);

  useEffect(() => {
    if (rateResult === undefined) {
      return;
    }

    const toastProperties = typeToText(rateResult.type);

    showToast({
      title: toastProperties.title,
      description: rateResult.message,
      icon: toastProperties.icon,
      vibrate: 200,
    });

    router.push('/map');
  }, [showToast, rateResult, router]);

  return (
    <div className="relative flex size-full flex-col gap-y-4 rounded-none p-6">
      <div className="flex grow flex-col items-center justify-center overflow-auto p-1">
        <span className="mb-1 text-center text-muted-foreground">
          Jak bardzo podobało Ci się wydarzenie:
        </span>
        {event !== null ? (
          <>
            <span className="mb-4 text-center text-lg font-bold">{event?.name}</span>
            <StarsRating starCount={5} initialRating={3} onRatingChange={handleRatingChange} />
          </>
        ) : (
          <div className="flex flex-col space-y-3">
            <Skeleton className="rounded-lg" />
            <div className="flex flex-col items-center space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        )}
      </div>
      <div className="m-0 mb-4 flex w-full shrink-0 flex-col gap-4 p-0">
        <div className="flex w-full justify-center">
          <Button className="w-1/2" disabled={event === null || isPending} onClick={sendRating}>
            {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
            Prześlij
          </Button>
        </div>
      </div>
    </div>
  );
}
