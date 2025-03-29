'use client';

import { useState } from 'react';
import AboutUsOverlay from '@/components/settings/AboutUsOverlay';
import { Button } from '../ui/button';

export default function AboutUsButton() {
  const [showAboutUs, setShowAboutUs] = useState(false);
  return (
    <>
      <Button onClick={() => setShowAboutUs(true)}>O nas</Button>
      <AboutUsOverlay visible={showAboutUs} onClose={() => setShowAboutUs(false)} />
    </>
  );
}
