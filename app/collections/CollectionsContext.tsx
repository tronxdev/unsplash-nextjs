'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import _ from 'lodash';
import * as Unsplash from '@/types/unsplash';

const CollectionsContext = createContext<
  | {
      query: string;
      setQuery: React.Dispatch<React.SetStateAction<string>>;
      perPage: number;
      setPerPage: React.Dispatch<React.SetStateAction<number>>;
      page: number;
      recentQueries: string[];
      setRecentQueries: React.Dispatch<React.SetStateAction<string[]>>;
      collections: Unsplash.Collection.Basic[];
      total: number;
      loadMore: () => Promise<void>;
      hasMore: boolean;
      loading: boolean;
      fetchCollection: (id: string) => Promise<void>;
      collection?: Unsplash.Collection.Basic;
    }
  | undefined
>(undefined);

export function CollectionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [query, setQuery] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [perPage, setPerPage] = useState<number>(10);
  const [recentQueries, setRecentQueries] = useState<string[]>([]);
  const [collections, setCollections] = useState<Unsplash.Collection.Basic[]>(
    [],
  );
  const [total, setTotal] = useState<number>(100000);
  const [loading, setLoading] = useState<boolean>(false);
  const [collection, setCollection] = useState<
    Unsplash.Collection.Basic | undefined
  >();

  const hasMore: boolean = useMemo(
    () => !loading && page < (!total ? 0 : Math.ceil(total / perPage)),
    [page, total, loading],
  );

  const loadMore = async () => {
    setLoading(true);

    const res = await fetch(
      `http://localhost:3000/api/search/collections?query=${query}&page=${page}&perPage=${perPage}`,
    );

    const data = await res.json();

    setCollections((prev) => _.uniqBy([...prev, ...data.results], 'id'));
    setTotal(data.total);
    setPage(page + 1);
    setLoading(false);
  };

  useEffect(() => {
    setPage(0);
    setCollections([]);
  }, [query]);

  const fetchCollection = async (id: string) => {
    setLoading(true);

    const res = await fetch(`http://localhost:3000/api/collection/${id}`);

    const data = await res.json();

    setCollection(data);
    setLoading(false);
  };

  return (
    <CollectionsContext.Provider
      value={{
        query,
        setQuery,
        perPage,
        setPerPage,
        page,
        recentQueries,
        setRecentQueries,
        collections,
        total,
        loadMore,
        hasMore,
        loading,
        fetchCollection,
        collection,
      }}
    >
      {children}
    </CollectionsContext.Provider>
  );
}

export function useCollections() {
  const context = useContext(CollectionsContext);
  if (context === undefined) {
    throw new Error('useCollections must be used within a CollectionsProvider');
  }
  return context;
}
