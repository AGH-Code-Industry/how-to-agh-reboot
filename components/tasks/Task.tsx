import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export type TaskProps = {
  title: string;
  description: string;
};

export default function Task({ title, description }: TaskProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-4">
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="flex justify-end gap-2">
          <Button variant="outline">Szczegóły</Button>
          <Button>Rozpocznij</Button>
        </div>
      </CardContent>
    </Card>
  );
}
