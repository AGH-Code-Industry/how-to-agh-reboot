'use client';

import { useState } from 'react';
import WelcomeOverlay from '@/components/global/WelcomeOverlay';
import { Button } from '../ui/button';

export default function AboutApplicationButton() {
  const [showWelcome, setShowWelcome] = useState(false);
  return (
    <>
      <Button onClick={() => setShowWelcome(true)}>O aplikacji</Button>
      <WelcomeOverlay
        mode={'force-open'}
        forceOpen={showWelcome}
        onClose={() => setShowWelcome(false)}
      />
    </>
  );
}
