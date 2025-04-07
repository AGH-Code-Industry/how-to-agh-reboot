'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { trpc } from '@/trpc/client';
import { useState } from 'react';

export default function Scanner() {
  const [code, setCode] = useState('');
  const result = trpc.qr.submitQr.useMutation();

  const handleSumbit = () => {
    result.mutate(code);
    setCode('');
  };

  return (
    <div>
      {result.data && (
        <p>
          Error: {result.data.error ? 'true' : 'false'}, Message: {result.data.message}
        </p>
      )}
      <Input type="text" value={code} onChange={(event) => setCode(event.target.value)} />
      <Button onClick={handleSumbit}>Wyślij</Button>
    </div>
  );
}
