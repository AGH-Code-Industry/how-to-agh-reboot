'use client';

import { trpc } from '@/trpc/client';
import ManageRedeemCode from './ManageRedeemCode';
import { cn } from '@/lib/utils';

export default function ManageRewardList() {
  const { data, refetch } = trpc.prizes.getRedeemCodes.useQuery(
    { redeemed: false },
    { refetchInterval: 10000 }
  );

  return (
    <div className="size-full">
      {data !== undefined && data.length > 0 ? (
        <div className="flex flex-col">
          {data?.map((code, i) => (
            <ManageRedeemCode
              className={cn('p-2', i % 2 ? 'bg-gray-800' : '')}
              key={code.id}
              prizeRedeemCode={code}
              onRemove={() => refetch()}
            />
          ))}
        </div>
      ) : (
        <div className="text-center">Brak kodów do odbioru upominków.</div>
      )}
    </div>
  );
}
