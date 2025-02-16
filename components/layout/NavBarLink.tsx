'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type NavBarLinkProps = {
  text: string;
  url: string;
  icon: LucideIcon;
};

export default function NavBarLink({ text, url, icon: Icon }: NavBarLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === url;

  return (
    <Link
      href={url}
      className={cn(
        'flex flex-col items-center justify-center gap-1 text-xs transition-colors text-muted-foreground',
        {
          'text-foreground ': isActive,
          'text-muted-foreground ': !isActive,
        }
      )}
      prefetch={true}
    >
      <Icon className="size-6" />
      {text}
    </Link>
  );
}
