import ExampleClientComponent from '@/components/example/ExampleClientComponent';
import ExampleServerComponent from '@/components/example/ExampleServerComponent';
import ExampleUsers from '@/components/example/ExampleUsers';

export default function Home() {
  return (
    <div>
      <h3>Example page</h3>

      <ExampleClientComponent />
      <ExampleServerComponent />

      <ExampleUsers />
    </div>
  );
}
