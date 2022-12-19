'use client';

import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import {
  useSelectedLayoutSegments,
  usePathname,
  useSearchParams,
} from 'next/navigation';
import SearchBar from '@/ui/SearchBar';
import TabNavItem from '@/ui/TabNavItem';
import HorizonalScroller from '@/ui/HorizonalScroller';
import Loading from '@/ui/Loading';
import { useGlobal } from './GlobalContext';
import { useSearchPhotos } from './s/SearchPhotosContext';
import { useSearchCollections } from './s/SearchCollectionsContext';

export default function GlobalNav() {
  const selectedLayoutSegments = useSelectedLayoutSegments();
  const pathname = usePathname();

  const { topics, loading } = useGlobal();
  const { total: totalPhotos, setQuery: setPhotosQuery } = useSearchPhotos();
  const { total: totalCollections, setQuery: setCollectionsQuery } =
    useSearchCollections();

  const [searchQuery, setSearchQuery] = useState<string>();

  const isSearchPage: boolean = useMemo<boolean>(
    () =>
      selectedLayoutSegments.length > 0 && selectedLayoutSegments[0] === 's',
    [selectedLayoutSegments],
  );

  useEffect(() => {
    if (isSearchPage && selectedLayoutSegments) {
      // url format: /s/photos/[query]
      const q = selectedLayoutSegments[2];

      setSearchQuery(q);
      setPhotosQuery(q.replaceAll('-', ' '));
      setCollectionsQuery(q.replaceAll('-', ' '));
    }
  }, [isSearchPage, selectedLayoutSegments]);

  return (
    <div
      className={clsx('flex min-h-[118px] flex-col', {
        'items-center justify-center': loading,
        'items-start justify-start': !loading,
      })}
    >
      {loading ? (
        <Loading kind="small" />
      ) : (
        <>
          <div className="w-full p-4">
            <SearchBar
              defaultQuery=""
              onQueryChange={() => {}}
              className="!rounded-full bg-zinc-200"
            />
          </div>

          {isSearchPage && searchQuery ? (
            <div className="flex h-12 w-full flex-row items-center space-x-8 pl-4">
              <TabNavItem
                key="__photos__"
                href={`/s/photos/${searchQuery}`}
                itemId="__photos__"
                isActive={selectedLayoutSegments[1] === 'photos'}
                className={totalPhotos < 0 ? '' : 'space-x-2'}
              >
                <span>Photos</span>
                <span>
                  {totalPhotos < 0
                    ? ''
                    : totalPhotos > 1000000
                    ? `${Math.floor(totalPhotos / 1000000)}m`
                    : totalPhotos > 1000
                    ? `${Math.floor(totalPhotos / 1000)}k`
                    : totalPhotos}
                </span>
              </TabNavItem>
              <TabNavItem
                key="__collections__"
                href={`/s/collections/${searchQuery}`}
                itemId="__collections__"
                isActive={selectedLayoutSegments[1] === 'collections'}
                className={totalCollections < 0 ? '' : 'space-x-2'}
              >
                <span>Collections</span>
                <span>
                  {totalCollections < 0
                    ? ''
                    : totalCollections > 1000000
                    ? `${Math.floor(totalCollections / 1000000)}m`
                    : totalCollections > 1000
                    ? `${Math.floor(totalCollections / 1000)}k`
                    : totalCollections}
                </span>
              </TabNavItem>
              <TabNavItem
                key="__uesrs__"
                href={`/s/users/${searchQuery}`}
                itemId="__users__"
                isActive={selectedLayoutSegments[1] === 'users'}
              >
                Users
              </TabNavItem>
            </div>
          ) : (
            <div className="flex h-12 w-full flex-row items-center space-x-4 pl-4">
              <TabNavItem
                key="__home__"
                href="/"
                itemId="__home__"
                isActive={selectedLayoutSegments.length === 0}
              >
                Home
              </TabNavItem>
              <div>
                <div className="mt-2 mb-2 h-8 w-px bg-zinc-500" />
              </div>
              <HorizonalScroller wrapperClassName="grow overflow-x-hidden h-full">
                {topics.map((topic) => {
                  const isActive: boolean = `/topics/${topic.id}` === pathname;
                  return (
                    <TabNavItem
                      key={topic.id}
                      href={`/topics/${topic.id}`}
                      itemId={topic.id}
                      isActive={isActive}
                    >
                      {topic.title}
                    </TabNavItem>
                  );
                })}
              </HorizonalScroller>
            </div>
          )}
        </>
      )}
    </div>
  );
}
