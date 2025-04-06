import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type RewardProps = {
  title: string;
  description: string;
  completed: number;
  required: number;
};

export default function Reward({ title, description, completed = 1, required = 2 }: RewardProps) {
  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            {completed < required ? '' : '✅ '}
            {title}
          </CardTitle>
          <CardDescription>
            {completed < required ? description : <i>Odbiór nagrody w namiocie wrss</i>}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="font-semibold">
            {completed < required ? completed + ' / ' + required : 'Ukończono'}
          </div>
          <Progress className="h-4" value={(completed / required) * 100}></Progress>
        </CardContent>
      </Card>
    </>
  );
}
