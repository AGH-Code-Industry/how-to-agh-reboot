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
    <div className="p-6 mx-auto">
      <h1 className="text-center text-2xl font-bold mb-6">Zadania</h1>

      <div>
        <h2 className="text-lg font-semibold mb-2">Aktywne zadania</h2>
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
