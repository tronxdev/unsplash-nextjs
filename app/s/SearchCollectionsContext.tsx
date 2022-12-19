'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import _ from 'lodash';
import * as Unsplash from '@/types/unsplash';

const PER_PAGE: number = 20;

const SearchCollectionsContext = createContext<
  | {
      query: string;
      setQuery: React.Dispatch<React.SetStateAction<string>>;
      perPage: number;
      setPerPage: React.Dispatch<React.SetStateAction<number>>;
      page: number;
      collections: Unsplash.Collection.Basic[];
      total: number;
      loadMore: (p: number) => Promise<void>;
      hasMore: boolean;
      loading: boolean;
    }
  | undefined
>(undefined);

export function SearchCollectionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [query, setQuery] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [perPage, setPerPage] = useState<number>(PER_PAGE);
  const [collections, setCollections] = useState<Unsplash.Collection.Basic[]>(
    [],
  );
  const [total, setTotal] = useState<number>(-1);
  const [loading, setLoading] = useState<boolean>(false);

  const hasMore: boolean = useMemo(
    () => !loading && page < (total < 1 ? 0 : Math.ceil(total / perPage)),
    [page, total, loading],
  );

  const loadMore = async (p: number) => {
    setLoading(true);

    const res = await fetch(
      `${process.env.HOST}/api/search/collections?query=${query}&page=${p}&perPage=${perPage}`,
    );

    if (res.ok) {
      const data = await res.json();

      setCollections((prev) => _.uniqBy([...prev, ...data.results], 'id'));
      setTotal(data.total);
      setPage(p);
    }

    setLoading(false);
  };

  useEffect(() => {
    async function fetchInitialData() {
      setLoading(true);
      setPage(0);
      setCollections([]);

      const res = await fetch(
        `${
          process.env.HOST
        }/api/search/collections?query=${query}&page=${1}&perPage=${1}`,
      );

      if (res.ok) {
        const data = await res.json();
        setTotal(data.total);
      }

      setLoading(false);
    }

    if (query) {
      fetchInitialData();
    } else {
      setCollections([]);
      setTotal(-1);
    }
  }, [query]);

  return (
    <SearchCollectionsContext.Provider
      value={{
        query,
        setQuery,
        perPage,
        setPerPage,
        page,
        collections,
        total,
        loadMore,
        hasMore,
        loading,
      }}
    >
      {children}
    </SearchCollectionsContext.Provider>
  );
}

export function useSearchCollections() {
  const context = useContext(SearchCollectionsContext);
  if (context === undefined) {
    throw new Error(
      'useSearchCollections must be used within a SearchCollectionsProvider',
    );
  }
  return context;
}
