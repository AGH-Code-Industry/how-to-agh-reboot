import { trpc } from '@/trpc/server';

export default async function ExampleServerComponent() {
  const exampleData = await trpc.example.getExampleDataWithInput('server component');

  return (
    <div>
      <h3>Example server component</h3>
      <span>{exampleData}</span>
    </div>
  );
}
