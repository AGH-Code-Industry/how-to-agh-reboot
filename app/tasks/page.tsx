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
];

export default function Tasks() {
  return (
    <div className="mx-auto p-6">
      <h1 className="mb-6 text-center text-2xl font-bold">Zadania</h1>

      <div>
        <h2 className="mb-2 text-lg font-semibold">Aktywne zadania</h2>
        <hr className="mb-4 border-muted" />
        <div className="flex flex-col gap-4">
          {tasks.map((task) => (
            <Task key={task.title} {...task} />
          ))}
        </div>
      </div>
    </div>
  );
}
