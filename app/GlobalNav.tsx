'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import {
  useSelectedLayoutSegments,
  usePathname,
  useRouter,
} from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { Popover } from 'react-tiny-popover';
import SearchBar from '@/ui/SearchBar';
import SearchPopover from '@/ui/SearchPopover';
import TabNavItem from '@/ui/TabNavItem';
import HorizonalScroller from '@/ui/HorizonalScroller';
import Loading from '@/ui/Loading';
import SVG from '@/ui/svg';
import { useGlobal } from './GlobalContext';
import { useSearchPhotos } from './s/SearchPhotosContext';
import { useSearchCollections } from './s/SearchCollectionsContext';
import { BasicRoute, RoutingConfig } from '@/types/app';

const ROUTING_CONFIG: RoutingConfig = {
  '/': {
    basePath: '/',
    pathPattern: /^\/$/g,
    protected: true,
    searchSupported: true,
  },
  '/account': {
    basePath: '/account',
    pathPattern: /^\/account$/g,
    protected: true,
    searchSupported: false,
  },
  '/collections': {
    basePath: '/collections',
    pathPattern: /^\/collections($|\/\w+)/g,
    protected: true,
    searchSupported: true,
  },
  '/dashboard': {
    basePath: '/dashboard',
    pathPattern: /^\/dashboard$/g,
    protected: false,
    searchSupported: false,
  },
  '/s': {
    basePath: '/s',
    pathPattern: /^\/s\/w+/g,
    protected: true,
    searchSupported: true,
  },
  '/topics': {
    basePath: '/topics',
    pathPattern: /^\/topics\/w+/g,
    protected: true,
    searchSupported: true,
  },
};

function MenuContent() {
  return (
    <div className="mt-1 flex w-28 flex-col rounded border border-zinc-300 bg-white drop-shadow">
      <Link
        href="/account"
        className="cursor-pointer p-2 text-sm font-bold text-zinc-500 hover:text-zinc-700"
      >
        Account
      </Link>
      <div className="mx-1 h-[1px] bg-zinc-200"></div>
      <div
        className="cursor-pointer p-2 text-sm font-bold text-zinc-500 hover:text-zinc-700"
        onClick={() => signOut()}
      >
        Log out
      </div>
    </div>
  );
}

export default function GlobalNav() {
  const router = useRouter();
  const selectedLayoutSegments = useSelectedLayoutSegments();
  const pathname = usePathname();
  const basePathname = '/' + pathname?.split('/')[1];
  const routeConfig: BasicRoute = ROUTING_CONFIG[basePathname];

  const isActive: (_pathname: string) => boolean = (_pathname) =>
    pathname === _pathname;

  const { data: session, status } = useSession();

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
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const isSearchPage: boolean = useMemo<boolean>(
    () => basePathname === '/s',
    [basePathname],
  );

  const handleQueryChange = useCallback((q: string) => {}, []);

  const handleQuerySubmit = useCallback((q: string) => {
    // addRecentQuery(q);
    setIsSearchPopoverOpen(false);

    router.push(`/s/photos/${q.replaceAll(' ', '-')}`);
  }, []);

  const handleSearchBarFocus = useCallback(() => {
    setIsSearchPopoverOpen(true);
  }, [setIsSearchPopoverOpen]);

  const handleSearchPopoverOutsideClick = useCallback(() => {
    setIsSearchPopoverOpen(false);
  }, [setIsSearchPopoverOpen]);

  const handleUserClick = useCallback(() => {
    setIsMenuOpen(true);
  }, [setIsMenuOpen]);

  const handleUserPopoverOutsideClick = useCallback(() => {
    setIsMenuOpen(false);
  }, [setIsMenuOpen]);

  useEffect(() => {
    if (isSearchPage && selectedLayoutSegments) {
      // url format: /s/photos/[query]
      const q = selectedLayoutSegments[2];

      setSearchQuery(q);
      setPhotosQuery(q.replaceAll('-', ' '));
      setCollectionsQuery(q.replaceAll('-', ' '));
    }
  }, [isSearchPage, selectedLayoutSegments]);

  // useEffect(() => {
  //   if (!session) {
  //     router.push('/dashboard');
  //   }
  // }, [session, router]);

  if (status === 'authenticated' && !!session) {
    return (
      <div
        className={clsx(
          `flex min-h-[${
            routeConfig.searchSupported ? `118px` : `72px`
          }] flex-col`,
        )}
      >
        {/* TOP */}
        {routeConfig.searchSupported ? (
          <div className="flex w-full flex-row items-center space-x-4 p-4">
            {/* LOGO */}
            <Link href="/">
              <div className="text-base font-bold text-zinc-900">
                Unsplashee
              </div>
              <div className="text-xs font-light text-zinc-500">
                Supported by tronx.dev
              </div>
            </Link>

            {/* SEARCH BAR */}
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
                  defaultQuery={searchQuery}
                  onQueryChange={handleQueryChange}
                  onQuerySubmit={handleQuerySubmit}
                  onFocus={handleSearchBarFocus}
                />
              </SearchPopover>
            </div>

            {/* MENU */}
            <Popover
              isOpen={isMenuOpen}
              positions={['bottom']}
              onClickOutside={handleUserPopoverOutsideClick}
              containerClassName={`!z-50`}
              content={<MenuContent />}
            >
              <div
                className="flex h-9 cursor-pointer flex-row items-center space-x-1 rounded-full bg-rose-500 px-2 text-xs text-white hover:bg-rose-600"
                onClick={handleUserClick}
              >
                {SVG.OutlineUserCircle} <span>{session.user?.name}</span>
              </div>
            </Popover>
          </div>
        ) : (
          <div className="grid w-full grid-cols-3 justify-between p-4">
            <div></div>
            {/* LOGO */}
            <div className="flex items-center justify-center">
              <Link href="/">
                <div className="text-3xl font-bold text-zinc-900">
                  Unsplashee
                </div>
              </Link>
            </div>

            {/* MENU */}
            <div className="flex items-center justify-end">
              <Popover
                isOpen={isMenuOpen}
                positions={['bottom']}
                onClickOutside={handleUserPopoverOutsideClick}
                containerClassName={`!z-50`}
                content={<MenuContent />}
              >
                <div
                  className="flex h-9 cursor-pointer flex-row items-center space-x-1 rounded-full bg-rose-500 px-2 text-xs text-white hover:bg-rose-600"
                  onClick={handleUserClick}
                >
                  {SVG.OutlineUserCircle} <span>{session.user?.name}</span>
                </div>
              </Popover>
            </div>
          </div>
        )}

        {/* BOTTOM */}
        {routeConfig.searchSupported ? (
          isSearchPage && searchQuery ? (
            <div className="flex h-12 w-full flex-row items-center space-x-8 pl-4">
              <TabNavItem
                key="__photos__"
                href={`/s/photos/${searchQuery}`}
                itemId="__photos__"
                isActive={selectedLayoutSegments[1] === 'photos'}
                className={`flex flex-row items-center ${
                  totalPhotos < 0 ? '' : 'space-x-2'
                }`}
              >
                <div className="flex flex-row items-center space-x-1">
                  <div className="h-5 w-5">
                    {selectedLayoutSegments[1] === 'photos'
                      ? SVG.SolidPhoto
                      : SVG.OutlinePhoto}
                  </div>
                  <div>Photos</div>
                </div>
                <div>
                  {totalPhotos < 0
                    ? ''
                    : totalPhotos > 1000000
                    ? `${Math.floor(totalPhotos / 1000000)}m`
                    : totalPhotos > 1000
                    ? `${Math.floor(totalPhotos / 1000)}k`
                    : totalPhotos}
                </div>
              </TabNavItem>
              <TabNavItem
                key="__collections__"
                href={`/s/collections/${searchQuery}`}
                itemId="__collections__"
                isActive={selectedLayoutSegments[1] === 'collections'}
                className={`flex flex-row items-center ${
                  totalCollections < 0 ? '' : 'space-x-2'
                }`}
              >
                <div className="flex flex-row items-center space-x-1">
                  <div className="h-5 w-5">
                    {selectedLayoutSegments[1] === 'collections'
                      ? SVG.SolidStack
                      : SVG.OutlineStack}
                  </div>
                  <div>Collections</div>
                </div>
                <div>
                  {totalCollections < 0
                    ? ''
                    : totalCollections > 1000000
                    ? `${Math.floor(totalCollections / 1000000)}m`
                    : totalCollections > 1000
                    ? `${Math.floor(totalCollections / 1000)}k`
                    : totalCollections}
                </div>
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
                  const _isActive: boolean = `/topics/${topic.id}` === pathname;
                  return (
                    <TabNavItem
                      key={topic.id}
                      href={`/topics/${topic.id}`}
                      itemId={topic.id}
                      isActive={_isActive}
                    >
                      {topic.title}
                    </TabNavItem>
                  );
                })}
              </HorizonalScroller>
            </div>
          )
        ) : (
          <></>
        )}
      </div>
    );
  } else {
    return (
      <div
        className={clsx(
          `grid min-h-[72px] w-full grid-cols-3 justify-between p-4`,
        )}
      >
        <div></div>
        {/* LOGO */}
        <div className="flex items-center justify-center">
          <Link href="/">
            <div className="text-3xl font-bold text-zinc-900">Unsplashee</div>
          </Link>
        </div>

        {/* MENU */}
        <div className="flex items-center justify-end">
          <Link
            href={'/api/auth/signin'}
            className="cursor-pointer rounded-full bg-green-600 py-2 px-4 text-xs font-bold text-white hover:bg-green-700"
          >
            Log in
          </Link>
        </div>
      </div>
    );
  }
}
