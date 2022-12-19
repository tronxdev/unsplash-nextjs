'use client';

import React, { useEffect } from 'react';
import { useSelectedLayoutSegments } from 'next/navigation';
// import { useSearchPhotos } from './SearchPhotosContext';
// import { useSearchCollections } from './SearchCollectionsContext';

export default function Layout({ children }: { children?: React.ReactNode }) {
  const segments = useSelectedLayoutSegments();
  const query = segments[1];

  // const { setQuery: setPhotosQuery } = useSearchPhotos();
  // const { setQuery: setCollectionsQuery } = useSearchCollections();

  useEffect(() => {}, [query]);

  return (
    <div className="w-full px-4 py-8">
      <div className="m-auto w-full space-y-8 xl:w-[1232px]">
        <div className="text-3xl font-semibold text-zinc-900">
          {query.replaceAll('-', ' ')}
        </div>
        {children}
      </div>
    </div>
  );
}
