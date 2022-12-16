import React from 'react';
import clsx from 'clsx';
import Link from 'next/link';

interface ITabNavItem {
  href: string;
  isActive?: boolean;
  itemId: string;
  children: React.ReactNode;
  className?: string;
}

export default function TabNavItem({
  children,
  href,
  itemId,
  isActive,
  className,
}: ITabNavItem) {
  return (
    <div
      className={clsx('flex h-full items-center justify-center', {
        'border-b-2 border-b-zinc-900': isActive,
      })}
    >
      <Link
        href={href}
        className={clsx(
          'block w-fit px-3 py-2 text-xs font-semibold capitalize tracking-wider hover:text-zinc-900',
          {
            'text-zinc-500': !isActive,
            'text-zinc-900': isActive,
          },
          className,
        )}
      >
        {children}
      </Link>
    </div>
  );
}
