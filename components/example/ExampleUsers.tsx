'use client';

import { trpc } from '@/trpc/client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
export default function ExampleUsers() {
  const users = trpc.user.getUsers.useQuery();
  const addUser = trpc.user.addUser.useMutation({
    onSettled: () => {
      users.refetch();
    },
  });

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  return (
    <div>
      <p>{users.isLoading ? 'Loading...' : JSON.stringify(users.data)}</p>
      Name: <input onChange={(e) => setName(e.target.value)} value={name} type="text" />
      Email: <input onChange={(e) => setEmail(e.target.value)} value={email} type="text" />
      <Button onClick={() => addUser.mutate({ name, email })}>Add</Button>
    </div>
  );
}
