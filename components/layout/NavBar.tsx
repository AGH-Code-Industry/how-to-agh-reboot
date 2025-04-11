import React from 'react';
import { AwardIcon, ClipboardListIcon, MapIcon, QrCodeIcon, SettingsIcon } from 'lucide-react';
import NavBarLink from '@/components/layout/NavBarLink';

export default function NavBar() {
  return (
    <nav className="grid h-16 min-h-16 grid-cols-5 items-center border-t-2">
      <NavBarLink text="Mapa" url="/map">
        <MapIcon className="size-6" />
      </NavBarLink>
      <NavBarLink text="Wydarzenia" url="/events">
        <ClipboardListIcon className="size-6" />
      </NavBarLink>
      <NavBarLink text="Skaner" url="/scanner">
        <QrCodeIcon className="size-6" />
      </NavBarLink>
      <NavBarLink text="Upominki" url="/prizes">
        <AwardIcon className="size-6" />
      </NavBarLink>
      <NavBarLink text="Ustawienia" url="/settings">
        <SettingsIcon className="size-6" />
      </NavBarLink>
    </nav>
  );
}
