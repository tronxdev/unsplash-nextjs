'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import InfiniteScroll from 'react-infinite-scroller';
import Masonry from 'react-responsive-masonry';
import Photo from '@/ui/PhotoItem';
import { useGlobal } from '../GlobalContext';
import { useDashboard, DashboardProvider } from './DashboardContext';

function Page() {
  const router = useRouter();

  const { bannerPhoto, changePhotoLike, photoLikes } = useGlobal();
  const { photos, hasMore, loadMore } = useDashboard();

  return (
    <div className="w-full space-y-8">
      <div className="relative h-128 w-full bg-zinc-200">
        {bannerPhoto && (
          <Image
            alt={bannerPhoto.id || 'home'}
            src={bannerPhoto.urls.full}
            fill={true}
            quality={100}
            className="!z-0 object-cover object-center"
            sizes="1024px"
            placeholder="blur"
            blurDataURL={bannerPhoto.urls.small}
          />
        )}
        <div className="absolute !z-10 flex h-full w-full flex-col justify-center space-y-8 p-32">
          <div className="text-4xl font-bold text-zinc-50">My Unsplash</div>
          <div className="w-64 text-base font-light text-zinc-50">
            The internet’s source for visuals. Powered by creators everywhere.
          </div>
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
        <Masonry gutter="2rem">
          {photos.map((photo) => (
            <Photo
              key={photo.id}
              photo={photo}
              favorite={!!photoLikes.find((p) => p === photo.id)}
              isProtected={true}
              onFavoriteChange={changePhotoLike}
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
      <DashboardProvider>
        <Page />
      </DashboardProvider>
    </div>
  );
}
