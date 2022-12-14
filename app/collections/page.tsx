'use client';

import React, { useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import InfiniteScroll from 'react-infinite-scroller';
import CollectionItem from '@/ui/CollectionItem';
import Loading from '@/ui/Loading';
import Header from './Header';
import { useCollections } from './CollectionsContext';

export default function Page({ children }: { children?: React.ReactNode }) {
  const searchParams = useSearchParams();
  const search: string | undefined = searchParams.get('search') as
    | string
    | undefined;

  const { collections, loadMore, hasMore, loading, recentQueries } =
    useCollections();

  return (
    <>
      <Header search={search as string} />
      <div className="mt-4 h-[48rem] overflow-auto">
        <InfiniteScroll
          pageStart={0}
          loadMore={loadMore}
          hasMore={hasMore}
          useWindow={false}
          threshold={50}
        >
          {collections?.map((collection) => (
            <CollectionItem key={collection.id} data={collection} />
          ))}
          {loading && <Loading />}
        </InfiniteScroll>
      </div>
    </>
  );
}
