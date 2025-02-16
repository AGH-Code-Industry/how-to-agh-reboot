'use client';

import React from 'react';
import { AwardIcon, ClipboardListIcon, MapIcon, QrCodeIcon, SettingsIcon } from 'lucide-react';
import NavBarLink from '@/components/layout/NavBarLink';

export default function NavBar() {
  return (
    <nav className="flex h-16 items-center justify-around border-t-2">
      <NavBarLink text={'Mapa'} url={'/map'} icon={MapIcon} />
      <NavBarLink text={'Zadania'} url={'/tasks'} icon={ClipboardListIcon} />
      <NavBarLink text={'Skaner'} url={'/scanner'} icon={QrCodeIcon} />
      <NavBarLink text={'Nagrody'} url={'/prizes'} icon={AwardIcon} />
      <NavBarLink text={'Ustawienia'} url={'/settings'} icon={SettingsIcon} />
    </nav>
  );
}
