'use client';

import { useCallback } from 'react';
import Image from 'next/image';
import SearchBar from '@/ui/SearchBar';
import { usePhotos } from './PhotosContext';
import { TabNavItem } from '@/ui/TabNavItem';
import _ from 'lodash';

interface IHeader {
  search?: string;
}

export default function Header({ search }: IHeader) {
  const { query, recentQueries, setQuery, setRecentQueries } = usePhotos();

  const onQueryChange = useCallback(
    (q: string) => {
      setQuery(q);
      if (!!q) {
        setRecentQueries((prev) => {
          const idx = prev.findIndex((qq) => qq === q);
          if (idx === -1) {
            return [q, ...prev].slice(0, 5);
          }
          return prev;
        });
      }
    },
    [setQuery],
  );

  return (
    <div className="relative flex h-[24rem] w-full flex-col">
      <Image
        alt="bg"
        src="/main-bg.jpeg"
        fill={true}
        quality={100}
        className="object-fit"
        sizes="640px"
      />
      <div className="absolute left-32 top-32 z-10 text-3xl font-medium text-zinc-50">
        My Unsplash
      </div>
      <div className="absolute left-32 top-44 z-10 w-64 text-sm font-light text-zinc-50">
        The internet’s source for visuals. Powered by creators everywhere.
      </div>
      <SearchBar
        className="w-aut absolute left-32 right-32 bottom-24 z-10 w-auto"
        defaultQuery={search}
        onQueryChange={onQueryChange}
      />
    </div>
  );
}
