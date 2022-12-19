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

const HomeContext = createContext<
  | {
      photos: Unsplash.Photo.Basic[];
      loadMore: (p: number) => void;
      loading: boolean;
      hasMore: boolean;
    }
  | undefined
>(undefined);

const MAX_TOTAL: number = 100000;
const PER_PAGE: number = 20;

export function HomeProvider({ children }: { children: React.ReactNode }) {
  const [photos, setPhotos] = useState<Unsplash.Photo.Basic[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(MAX_TOTAL);

  const loadMore = useCallback(async (p: number) => {
    setLoading(true);

    const res = await fetch(
      `${process.env.HOST}/api/search/photos?page=${p}&perPage=${PER_PAGE}&orderBy=${Unsplash.Search.SearchPhotoOrderBy.LATEST}`,
    );

    if (res.ok) {
      const data = await res.json();

      setPhotos((prev) => _.uniqBy([...prev, ...data.results], 'id'));
      setTotal(data.total);
    } else {
      setPhotos([]);
    }

    setLoading(false);
  }, []);

  const hasMore: boolean = useMemo(
    () => !loading && page < (!total ? 0 : Math.ceil(total / PER_PAGE)),
    [page, total, loading],
  );

  return (
    <HomeContext.Provider
      value={{
        photos,
        loading,
        loadMore,
        hasMore,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
}

export function useHome() {
  const context = useContext(HomeContext);

  if (context === undefined) {
    throw new Error('useHome must be used within a HomeProvider');
  }

  return context;
}
