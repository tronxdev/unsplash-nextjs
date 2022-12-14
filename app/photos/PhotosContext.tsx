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

const PhotosContext = createContext<
  | {
      query: string;
      setQuery: React.Dispatch<React.SetStateAction<string>>;
      perPage: number;
      setPerPage: React.Dispatch<React.SetStateAction<number>>;
      page: number;
      recentQueries: string[];
      setRecentQueries: React.Dispatch<React.SetStateAction<string[]>>;
      photos: Unsplash.Photo.Basic[];
      total: number;
      loadMore: (p: number) => Promise<void>;
      hasMore: boolean;
      loading: boolean;
    }
  | undefined
>(undefined);

export function PhotosProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [perPage, setPerPage] = useState<number>(10);
  const [recentQueries, setRecentQueries] = useState<string[]>([]);
  const [photos, setPhotos] = useState<Unsplash.Photo.Basic[]>([]);
  const [total, setTotal] = useState<number>(100000);
  const [loading, setLoading] = useState<boolean>(false);

  const hasMore: boolean = useMemo(
    () => !loading && page < (!total ? 0 : Math.ceil(total / perPage)),
    [page, total, loading],
  );

  const loadMore = async (p: number) => {
    setLoading(true);

    const res = await fetch(
      `http://localhost:3000/api/search/photos?query=${query}&page=${p}&perPage=${perPage}`,
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
    setPage(0);
    setPhotos([]);
  }, [query]);

  return (
    <PhotosContext.Provider
      value={{
        query,
        setQuery,
        perPage,
        setPerPage,
        page,
        recentQueries,
        setRecentQueries,
        photos,
        total,
        loadMore,
        hasMore,
        loading,
      }}
    >
      {children}
    </PhotosContext.Provider>
  );
}

export function usePhotos() {
  const context = useContext(PhotosContext);
  if (context === undefined) {
    throw new Error('usePhotos must be used within a PhotosProvider');
  }
  return context;
}
