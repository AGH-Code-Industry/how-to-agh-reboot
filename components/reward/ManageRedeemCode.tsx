'use client';

import { PrizeRedeemCodeDTO } from '@/types/Prize';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { useCallback, useEffect, useState } from 'react';
import { trpc } from '@/trpc/client';
import { Loader2 } from 'lucide-react';

type Props = {
  prizeRedeemCode: PrizeRedeemCodeDTO;
  className: string;
  onRemove?: () => void;
};

export default function ManageRedeemCode({
  prizeRedeemCode: { id, code },
  className,
  onRemove,
}: Props) {
  const [isConfirm, setIsConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { mutateAsync: redeemCode } = trpc.prizes.useRedeemCode.useMutation();

  useEffect(() => {
    if (isConfirm === false) {
      return;
    }

    const timeout = setTimeout(() => {
      setIsConfirm(false);
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [isConfirm]);

  const handleClick = useCallback(() => {
    if (isConfirm === false) {
      setIsConfirm(true);
      return;
    }

    setIsLoading(true);
    redeemCode({ redeemCodeId: id }).then(() => onRemove?.());
  }, [isConfirm, id, redeemCode, onRemove]);

  return (
    <div className={cn('flex items-center justify-between', className)}>
      <span className="text-2xl tracking-widest">{code}</span>
      {isConfirm || isLoading ? (
        <Button variant="destructive" disabled={isLoading} onClick={handleClick}>
          {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
          Na pewno?
        </Button>
      ) : (
        <Button variant="outline" className="border-red-700" onClick={handleClick}>
          Zużyj kod
        </Button>
      )}
    </div>
  );
}
