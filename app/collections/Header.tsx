'use client';

import { useCallback } from 'react';
import SearchBar from '@/ui/SearchBar';
import { useCollections } from './CollectionsContext';
import { TabNavItem } from '@/ui/TabNavItem';
import _ from 'lodash';

interface IHeader {
  search?: string;
}

export default function Header({ search }: IHeader) {
  const { query, recentQueries, setQuery, setRecentQueries } = useCollections();

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
    <div className="flex w-full flex-col">
      <SearchBar defaultQuery={search} onQueryChange={onQueryChange} />
      <div className="mt-2 flex flex-row space-x-2">
        {recentQueries.map((q) => (
          <TabNavItem
            key={q}
            href={`/collections?search=${q}`}
            isActive={search === query && q === query}
          >
            {q}
          </TabNavItem>
        ))}
      </div>
    </div>
  );
}
