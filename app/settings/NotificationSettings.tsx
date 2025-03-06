import { Switch } from '@/components/ui/switch';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { PageSectionTitle } from '@/components/layout/PageLayout';

export default function NotificationSettings() {
  return (
    <>
      <PageSectionTitle>Powiadomienia</PageSectionTitle>
      <div className="flex flex-col gap-4">
        <NotificationCard
          title="Przypomnienia o wydarzeniach"
          description="Przypomnienia i szczegóły wydarzeń w których bierzesz udział"
        />
        <NotificationCard
          title="Ważne komunikaty"
          description="Zmiany harmonogramu, komunikaty od organizatorów i inne ważne informacje"
        />
      </div>
    </>
  );
}

type Card2Props = {
  title: string;
  description: string;
};

function NotificationCard({ title, description }: Card2Props) {
  return (
    <Card className="flex items-center justify-between">
      <div className="flex flex-col space-y-1.5 p-4">
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </div>
      <div
        className="p-4
      "
      >
        <Switch />
      </div>
    </Card>
  );
}
