import { PageLayout, PageSectionTitle, PageTitle } from '@/components/layout/PageLayout';
import Task, { TaskProps } from '@/components/tasks/Task';

const tasks: TaskProps[] = [
  {
    title: 'Znajdź salę 101',
    description: 'Zeskanuj kod QR w sali 101, aby ukończyć zadanie.',
  },
  {
    title: 'Poznaj uczelnię',
    description: 'Odwiedź co najmniej 3 stanowiska tematyczne i zaznacz swoją obecność.',
  },
  {
    title: 'Znajdź salę 102',
    description: 'Zeskanuj kod QR w sali 102, aby ukończyć zadanie.',
  },
  {
    title: 'Znajdź salę 103',
    description: 'Zeskanuj kod QR w sali 103, aby ukończyć zadanie.',
  },
  {
    title: 'Znajdź salę 104',
    description: 'Zeskanuj kod QR w sali 104, aby ukończyć zadanie.',
  },
];

export default function Tasks() {
  return (
    <PageLayout>
      <PageTitle>Zadania</PageTitle>
      <PageSectionTitle>Aktywne zadania</PageSectionTitle>
      <div className="flex flex-col gap-4">
        {tasks.map((task) => (
          <Task key={task.title} {...task} />
        ))}
      </div>
    </PageLayout>
  );
}
