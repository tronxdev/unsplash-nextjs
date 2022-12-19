'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import InfiniteScroll from 'react-infinite-scroller';
import Masonry from 'react-responsive-masonry';
import Photo from '@/ui/Photo';
import SearchBar from '@/ui/SearchBar';
import SearchPopover from '@/ui/SearchPopover';
import { useGlobal } from './GlobalContext';
import { useHome, HomeProvider } from './HomeContext';

function Page() {
  const [isSearchPopoverOpen, setIsSearchPopoverOpen] =
    useState<boolean>(false);

  const {
    recentQueries,
    addRecentQuery,
    recentCollections,
    addRecentCollection,
    recentTopics,
    addRecentTopic,
  } = useGlobal();
  const { popularPhoto, photos, hasMore, loadMore } = useHome();

  const handleQueryChange = useCallback((q: string) => {}, []);

  const handleQuerySubmit = useCallback((q: string) => {
    addRecentQuery(q);
    setIsSearchPopoverOpen(false);
  }, []);

  const handleSearchBarFocus = useCallback(() => {
    setIsSearchPopoverOpen(true);
  }, [setIsSearchPopoverOpen]);

  const handleSearchPopoverOutsideClick = useCallback(() => {
    setIsSearchPopoverOpen(false);
  }, [setIsSearchPopoverOpen]);

  return (
    <div className="w-full space-y-4">
      <div className="relative h-128 w-full bg-zinc-200">
        {popularPhoto && (
          <Image
            alt={popularPhoto.id || 'home'}
            src={popularPhoto.urls.full}
            fill={true}
            quality={100}
            className="!z-0 object-cover object-center"
            sizes="1024px"
            placeholder="blur"
            blurDataURL={popularPhoto.urls.small}
          />
        )}
        <div className="absolute !z-10 flex h-full w-full flex-col justify-center space-y-8 p-32">
          <div className="text-4xl font-bold text-zinc-50">My Unsplash</div>
          <div className="w-64 text-base font-light text-zinc-50">
            The internet’s source for visuals. Powered by creators everywhere.
          </div>

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
          >
            <SearchBar
              className="w-full !rounded-full bg-zinc-200"
              onQueryChange={handleQueryChange}
              onQuerySubmit={handleQuerySubmit}
              onFocus={handleSearchBarFocus}
            />
          </SearchPopover>
        </div>
      </div>

      <InfiniteScroll
        pageStart={0}
        loadMore={loadMore}
        hasMore={hasMore}
        useWindow={true}
        threshold={250}
        className="px-4"
      >
        <Masonry gutter="1rem">
          {photos.map((photo) => (
            <Photo
              key={photo.id}
              photo={photo}
              favorite={false}
              onFavoriteChange={() => {}}
            />
          ))}
        </Masonry>
      </InfiniteScroll>
    </div>
  );
}

export default function PageWrapper() {
  return (
    <div>
      <HomeProvider>
        <Page />
      </HomeProvider>
    </div>
  );
}
