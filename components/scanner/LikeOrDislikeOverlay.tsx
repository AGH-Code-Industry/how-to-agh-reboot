'use client';

import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import ScreenOverlay from '../global/ScreenOverlay';
import { trpc } from '@/trpc/client';
import { Skeleton } from '../ui/skeleton';
import StarsRating from './StarsRating';
import { CircleCheck, CircleX, Info, Loader2 } from 'lucide-react';
import { RateEventResponse } from '@/trpc/routers/rating';
import { useNotifications } from '@/hooks/useNotifications';

type Props = unknown;

export type LikeOrDislikeOverlayHandle = {
  open: (id: number) => void;
};

const starCount = 5;
const initialRating = 3;

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

const LikeOrDislikeOverlay = forwardRef<LikeOrDislikeOverlayHandle, Props>((props, ref) => {
  const [visible, setVisible] = useState(false);
  const [eventId, setEventId] = useState<number | undefined>(undefined);
  const [rating, setRating] = useState<number>(initialRating);
  const { showToast } = useNotifications();
  const { data, error } = trpc.events.getEvents.useQuery({ eventId: eventId });
  const {
    data: rateEventResult,
    mutateAsync: rateEvent,
    isPending,
  } = trpc.rating.rateEvent.useMutation();

  const event = useMemo(() => (data && data.length === 1 ? data[0] : null), [data]);

  const open = (id: number) => {
    setVisible(true);
    setEventId(id);
  };

  const handleClose = () => {
    setVisible(false);
    setEventId(undefined);
  };

  const handleRatingChange = (rating: number) => {
    setRating(rating);
  };

  const sendRatingAndClose = async () => {
    if (eventId === undefined) {
      return;
    }

    await rateEvent({ eventId, rating });
    handleClose();
  };

  useImperativeHandle(ref, () => ({
    open,
  }));

  useEffect(() => {
    if (error !== null) {
      handleClose();
    }
  }, [error]);

  useEffect(() => {
    if (rateEventResult === undefined) {
      return;
    }

    const toastProperties = typeToText(rateEventResult.type);

    showToast({
      title: toastProperties.title,
      description: rateEventResult.message,
      icon: toastProperties.icon,
      vibrate: 200,
    });
  }, [showToast, rateEventResult]);

  if (!visible) return null;

  return (
    <ScreenOverlay className="p-0">
      <Card className="relative flex size-full flex-col gap-y-4 rounded-none p-6">
        <CardHeader className="m-0 flex shrink-0 justify-center p-0 text-center text-2xl font-bold">
          Oceń wydarzenie
        </CardHeader>
        <CardContent className="flex grow flex-col items-center justify-center overflow-auto p-1">
          <span className="mb-1 text-center text-muted-foreground">
            Jak bardzo podobało Ci się wydarzenie:
          </span>
          {event !== null ? (
            <>
              <span className="mb-4 text-center text-lg font-bold">{event?.name}</span>
              <StarsRating
                starCount={starCount}
                initialRating={initialRating}
                onRatingChange={handleRatingChange}
              />
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
        </CardContent>
        <CardFooter className="m-0 mb-4 flex w-full shrink-0 flex-col gap-4 p-0">
          <div className="flex w-full justify-center">
            <Button
              className="w-1/2"
              disabled={event === null || isPending}
              onClick={sendRatingAndClose}
            >
              {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              Prześlij
            </Button>
          </div>
        </CardFooter>
      </Card>
    </ScreenOverlay>
  );
});

LikeOrDislikeOverlay.displayName = 'LikeOrDislikeOverlay';

export default LikeOrDislikeOverlay;
