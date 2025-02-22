import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type RewardProps = {
  reward: string;
  requirement: string;
  completion: number;
};

export default function Reward({ reward, requirement, completion }: RewardProps) {
  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{reward}</CardTitle>
          <CardDescription>
            {completion < 1 ? requirement : <i>Odbiór nagrody w namiocie wrss</i>}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={completion * 100}></Progress>
        </CardContent>
      </Card>
    </>
  );
}
