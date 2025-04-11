import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RedeemReward from './RedeemReward';
import { cn } from '@/lib/utils';
type RewardProps = {
  rewardId: number;
  title: string;
  description: string;
  completed: number;
  required: number;
  code?: string;
  redeemed: boolean;
};

export default function Reward({
  rewardId,
  title,
  description,
  completed,
  required,
  code,
  redeemed,
}: RewardProps) {
  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className={cn(redeemed ? 'line-through' : '')}>
            {completed < required ? '' : '✅ '}
            {title}
          </CardTitle>
          <CardDescription className={cn(redeemed ? 'line-through' : '')}>
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {redeemed === false && (
            <>
              <div className="mb-1 font-semibold">
                {completed < required ? completed + ' / ' + required : 'Ukończono'}
              </div>
              <Progress className="mb-4 h-4" value={(completed / required) * 100}></Progress>
            </>
          )}

          <RedeemReward
            completed={completed}
            required={required}
            code={code}
            rewardId={rewardId}
            redeemed={redeemed}
          />
        </CardContent>
      </Card>
    </>
  );
}
