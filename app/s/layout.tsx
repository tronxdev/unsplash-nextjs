'use client';

import React from 'react';
import { useSelectedLayoutSegments } from 'next/navigation';

export default function Layout({ children }: { children?: React.ReactNode }) {
  const segments = useSelectedLayoutSegments();
  const query = segments[1];

  return (
    <div className="w-full px-4 py-8">
      <div className="m-auto w-full xl:w-[1232px]">
        <div className="text-4xl font-semibold text-zinc-900">
          {query.replaceAll('-', ' ')}
        </div>
        {children}
      </div>
    </div>
  );
}
