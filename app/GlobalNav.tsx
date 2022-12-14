'use client';

import { demos } from '@/lib/demos';
import clsx from 'clsx';
import { useSelectedLayoutSegments } from 'next/navigation';
import Link from 'next/link';
import * as Unsplash from '@/types/unsplash';
import { NavItem } from '@/types/nav';

export default function GlobalNav() {
  const [selectedLayoutSegments] = useSelectedLayoutSegments();

  const navItems: NavItem[] = [
    {
      name: 'Photos',
      slug: 'photos',
    },
    {
      name: 'Collections',
      slug: 'collections',
    },
  ];

  return (
    <div className="space-y-5">
      {navItems.map((demo) => {
        const isActiveNav = demo.slug === selectedLayoutSegments;

        return (
          <div key={demo.slug}>
            <Link
              href={`/${demo.slug}`}
              className={clsx(
                'block rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-zinc-800 hover:text-zinc-100',
                { 'text-zinc-500': !isActiveNav, 'text-white': isActiveNav },
              )}
            >
              {demo.name}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
