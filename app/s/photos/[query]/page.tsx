'use client';

import React, { useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import Masonry from 'react-responsive-masonry';
import Photo from '@/ui/PhotoItem';
import { useSearchPhotos } from '../../SearchPhotosContext';

export default function Page({ params }: { params: { query: string } }) {
  // const query = params.query.replaceAll('-', ' ');

  const { photos, loadMore, hasMore } = useSearchPhotos();

  return (
    <div className="w-full">
      <InfiniteScroll
        pageStart={0}
        loadMore={loadMore}
        hasMore={hasMore}
        useWindow={true}
        threshold={250}
      >
        <Masonry gutter="2rem">
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
