import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type RewardProps = {
  reward: string;
  requirement: string;
  completed: number;
  required: number;
};

export default function Reward({ reward, requirement, completed = 1, required = 2}: RewardProps) {
  return (
    <>
      <Card className='w-full'>
        <CardHeader>
          <CardTitle>{completed < required ? '' : '✅ '}{reward}</CardTitle>
          <CardDescription>
            {completed < required ? requirement : <i>Odbiór nagrody w namiocie wrss</i>}
          </CardDescription>
        </CardHeader>
        <CardContent>
        <div className= 'font-semibold'>{completed < required ? completed + ' / ' + required : 'Ukończono'}</div>
          <Progress className='h-4' value={completed / required * 100}></Progress>
        </CardContent>
      </Card>
    </>
  );
}
