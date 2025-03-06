'use client';
import Map from '@/components/map/Map';
import { useCallback } from 'react';

export default function Page() {
  const onAGHLeave = useCallback((isOnAGH: boolean) => console.log(isOnAGH), []);

  return <Map onAGHLeaveOrEnter={onAGHLeave} />;
}
