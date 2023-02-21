'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import _ from 'lodash';
import { useGlobal } from 'app/GlobalContext';
import * as Unsplash from '@/types/unsplash';
import type { RecentQuery } from '@prisma/client';

const PER_PAGE: number = 20;

const SearchPhotosContext = createContext<
  | {
      query: string;
      setQuery: React.Dispatch<React.SetStateAction<string>>;
      perPage: number;
      setPerPage: React.Dispatch<React.SetStateAction<number>>;
      page: number;
      photos: Unsplash.Photo.Basic[];
      total: number;
      loadMore: (p: number) => Promise<void>;
      hasMore: boolean;
      loading: boolean;
    }
  | undefined
>(undefined);

export function SearchPhotosProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setRecentQueries } = useGlobal();

  const [query, setQuery] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [perPage, setPerPage] = useState<number>(PER_PAGE);
  const [photos, setPhotos] = useState<Unsplash.Photo.Basic[]>([]);
  const [total, setTotal] = useState<number>(-1);
  const [loading, setLoading] = useState<boolean>(false);

  const hasMore: boolean = useMemo(
    () => !loading && page < (total < 1 ? 0 : Math.ceil(total / perPage)),
    [page, total, loading],
  );

  const loadMore = async (p: number) => {
    setLoading(true);

    const res = await fetch(
      `${process.env.HOST}/api/search/photos?query=${query}&page=${p}&perPage=${perPage}`,
    );

    if (res.ok) {
      const data = await res.json();

      setPhotos((prev) => _.uniqBy([...prev, ...data.results], 'id'));
      setTotal(data.total);
      setPage(p);
    }

    setLoading(false);
  };

  useEffect(() => {
    async function fetchInitialData() {
      setRecentQueries((prev) => _.uniq([query, ...prev]).slice(0, 5));
      setLoading(true);
      setPage(0);
      setPhotos([]);

      const res = await fetch(
        `${
          process.env.HOST
        }/api/search/photos?query=${query}&page=${1}&perPage=${1}`,
      );

      if (res.ok) {
        const data = (await res.json()) as Unsplash.Search.Photos & {
          recentQueries?: RecentQuery[];
        };
        setTotal(data.total);
        setRecentQueries(
          data.recentQueries ? data.recentQueries.map((q) => q.query) : [],
        );
      }

      setLoading(false);
    }

    if (query) {
      fetchInitialData();
    } else {
      setPhotos([]);
      setTotal(-1);
    }
  }, [query]);

  return (
    <SearchPhotosContext.Provider
      value={{
        query,
        setQuery,
        perPage,
        setPerPage,
        page,
        photos,
        total,
        loadMore,
        hasMore,
        loading,
      }}
    >
      {children}
    </SearchPhotosContext.Provider>
  );
}

export function useSearchPhotos() {
  const context = useContext(SearchPhotosContext);
  if (context === undefined) {
    throw new Error(
      'useSearchPhotos must be used within a SearchPhotosProvider',
    );
  }
  return context;
}
