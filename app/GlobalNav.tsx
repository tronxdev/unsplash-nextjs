'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import {
  useSelectedLayoutSegments,
  usePathname,
  useRouter,
} from 'next/navigation';
import Link from 'next/link';
import SearchBar from '@/ui/SearchBar';
import SearchPopover from '@/ui/SearchPopover';
import TabNavItem from '@/ui/TabNavItem';
import HorizonalScroller from '@/ui/HorizonalScroller';
import Loading from '@/ui/Loading';
import { useGlobal } from './GlobalContext';
import { useSearchPhotos } from './s/SearchPhotosContext';
import { useSearchCollections } from './s/SearchCollectionsContext';

export default function GlobalNav() {
  const router = useRouter();
  const selectedLayoutSegments = useSelectedLayoutSegments();
  const pathname = usePathname();

  const {
    topics,
    loading,
    recentQueries,
    addRecentQuery,
    recentCollections,
    recentTopics,
  } = useGlobal();
  const { total: totalPhotos, setQuery: setPhotosQuery } = useSearchPhotos();
  const { total: totalCollections, setQuery: setCollectionsQuery } =
    useSearchCollections();

  const [searchQuery, setSearchQuery] = useState<string>();
  const [isSearchPopoverOpen, setIsSearchPopoverOpen] =
    useState<boolean>(false);

  const isSearchPage: boolean = useMemo<boolean>(
    () =>
      selectedLayoutSegments.length > 0 && selectedLayoutSegments[0] === 's',
    [selectedLayoutSegments],
  );

  const handleQueryChange = useCallback((q: string) => {}, []);

  const handleQuerySubmit = useCallback((q: string) => {
    addRecentQuery(q);
    setIsSearchPopoverOpen(false);

    router.push(`/s/photos/${q.replaceAll(' ', '-')}`);
  }, []);

  const handleSearchBarFocus = useCallback(() => {
    setIsSearchPopoverOpen(true);
  }, [setIsSearchPopoverOpen]);

  const handleSearchPopoverOutsideClick = useCallback(() => {
    setIsSearchPopoverOpen(false);
  }, [setIsSearchPopoverOpen]);

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
          <div className="flex w-full flex-row items-center space-x-4 p-4">
            <Link href="/">
              <div className="text-base font-bold text-zinc-900">
                My Unsplashee
              </div>
              <div className="text-xs font-light text-zinc-500">
                Supported by tronx.dev
              </div>
            </Link>
            <div className="flex-1">
              <SearchPopover
                isOpen={isSearchPopoverOpen}
                positions={['bottom']}
                data={[
                  {
                    id: 'search',
                    title: 'Recent queries',
                    items: recentQueries.map((q) => ({
                      id: q.replaceAll(' ', '_'),
                      title: q,
                      href: `/s/photos/${q.replaceAll(' ', '%20')}`,
                    })),
                  },
                  {
                    id: 'collections',
                    title: 'Recent collections',
                    items: recentCollections.map((c) => ({
                      id: c.id,
                      title: c.title,
                      href: `/s/collections/${c.id}`,
                    })),
                  },
                  {
                    id: 'topics',
                    title: 'Recent topics',
                    items: recentTopics.map((t) => ({
                      id: t.id,
                      title: t.title,
                      href: `/s/topics/${t.id}`,
                    })),
                  },
                ]}
                onClickOutside={handleSearchPopoverOutsideClick}
                className={'!right-64'}
                // className="flex-1 !rounded-full bg-zinc-200"
              >
                <SearchBar
                  className="w-full !rounded-full bg-zinc-200"
                  onQueryChange={handleQueryChange}
                  onQuerySubmit={handleQuerySubmit}
                  onFocus={handleSearchBarFocus}
                />
              </SearchPopover>
            </div>
            {/* <SearchBar
              defaultQuery=""
              onQueryChange={() => {}}
              className="flex-1 !rounded-full bg-zinc-200"
            /> */}
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
