/**
 * HOME page
 * This is a client component
 */

'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import InfiniteScroll from 'react-infinite-scroller';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import Photo from '@/ui/PhotoItem';
import SearchBar from '@/ui/SearchBar';
import SearchPopover from '@/ui/SearchPopover';
import { useGlobal } from './GlobalContext';
import { useHome, HomeProvider } from './HomeContext';

function Page() {
  const router = useRouter();

  const [isSearchPopoverOpen, setIsSearchPopoverOpen] =
    useState<boolean>(false);

  const {
    bannerPhoto,
    recentQueries,
    addRecentQuery,
    recentCollections,
    addRecentCollection,
    recentTopics,
    addRecentTopic,
    changePhotoLike,
    photoLikes,
  } = useGlobal();
  const { photos, hasMore, loadMore } = useHome();

  const handleQueryChange = useCallback((q: string) => {}, []);

  const handleQuerySubmit = useCallback((q: string) => {
    setIsSearchPopoverOpen(false);

    router.push(`/s/photos/${q.replaceAll(' ', '-')}`);
  }, []);

  const handleSearchBarFocus = useCallback(() => {
    setIsSearchPopoverOpen(true);
  }, [setIsSearchPopoverOpen]);

  const handleSearchPopoverOutsideClick = useCallback(() => {
    setIsSearchPopoverOpen(false);
  }, [setIsSearchPopoverOpen]);

  return (
    <div className="flex w-full flex-col items-center space-y-8">
      <div className="relative h-128 w-full bg-zinc-200">
        {bannerPhoto && (
          <Image
            alt={bannerPhoto.id || 'home'}
            src={bannerPhoto.urls.full}
            fill={true}
            quality={100}
            className="!z-0 object-cover object-center"
            sizes="1024px"
            // placeholder="blur"
            // blurDataURL={bannerPhoto.urls.small}
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
        className="w-full px-0 md:w-[720px] md:px-8 lg:w-[1024px] lg:px-16 xl:w-[1280px]"
      >
        <ResponsiveMasonry
          columnsCountBreakPoints={{ 350: 1, 640: 1, 768: 2, 1024: 3 }}
        >
          <Masonry gutter="24px">
            {photos.map((photo) => (
              <Photo
                key={photo.id}
                photo={photo}
                favorite={!!photoLikes.find((p) => p === photo.id)}
                onFavoriteChange={(isFavorite) =>
                  changePhotoLike(photo, isFavorite)
                }
              />
            ))}
          </Masonry>
        </ResponsiveMasonry>
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
