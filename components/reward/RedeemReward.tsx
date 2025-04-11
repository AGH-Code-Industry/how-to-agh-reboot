'use client';

import { trpc } from '@/trpc/client';
import { useEffect, useState } from 'react';

type Props = {
  code?: string;
  redeemed: boolean;
  completed: number;
  required: number;
  rewardId: number;
};

export default function RedeemReward({ code, completed, required, rewardId, redeemed }: Props) {
  const [redeemCode, setRedeemCode] = useState<string | undefined>(code);
  const { data, mutateAsync: createRedeemCode } = trpc.prizes.createRedeemCode.useMutation();

  useEffect(() => {
    if (completed < required) {
      return;
    }

    createRedeemCode({ rewardId });
  }, [completed, required, rewardId, createRedeemCode]);

  useEffect(() => {
    if (data && data.code !== undefined) {
      setRedeemCode(data.code);
    }
  }, [data]);

  if (redeemCode === undefined) {
    return null;
  }

  return (
    <div>
      {redeemed ? (
        <p className="text-sm text-muted-foreground">Upominek odebrany.</p>
      ) : (
        <>
          <span className="text-3xl font-bold tracking-widest text-successAlert-foreground">
            {redeemCode}
          </span>
          <p className="text-sm text-muted-foreground">Podaj ten kod przy odbiorze upominku.</p>
        </>
      )}
    </div>
  );
}
