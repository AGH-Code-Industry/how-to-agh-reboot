'use client';

import { cn } from '@/lib/utils';
import { ComponentProps, useState } from 'react';

type Props = {
  starCount: number;
  onRatingChange?: (rating: number) => void;
  initialRating: number;
};

export default function StarsRating({ starCount, onRatingChange, initialRating }: Props) {
  const [rating, setRating] = useState(initialRating);

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    onRatingChange?.(rating);
  };

  return (
    <div className="flex cursor-pointer items-center gap-1">
      {Array(starCount)
        .fill(0)
        .map((_, i) => (
          <StarIcon
            key={i + 1}
            className={cn(
              'size-8',
              i + 1 <= rating ? 'fill-primary' : 'fill-muted stroke-muted-foreground'
            )}
            onClick={() => handleRatingChange(i + 1)}
          />
        ))}
    </div>
  );
}

function StarIcon(props: ComponentProps<'svg'>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
