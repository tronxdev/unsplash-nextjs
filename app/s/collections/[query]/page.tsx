'use client';

import React, { useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import Masonry from 'react-responsive-masonry';
import CollectionItem from '@/ui/CollectionItem';
import { useSearchCollections } from '../../SearchCollectionsContext';

export default function Page({ params }: { params: { query: string } }) {
  // const query = params.query.replaceAll('-', ' ');

  const { collections, loadMore, hasMore } = useSearchCollections();

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
          {collections.map((collection) => (
            <CollectionItem key={collection.id} collection={collection} />
          ))}
        </Masonry>
      </InfiniteScroll>
    </div>
  );
}
