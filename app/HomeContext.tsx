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
      popularPhoto?: Unsplash.Photo.Basic;
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
  const [popularPhoto, setPopularPhoto] = useState<Unsplash.Photo.Basic>();
  const [photos, setPhotos] = useState<Unsplash.Photo.Basic[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(MAX_TOTAL);

  const loadMore = useCallback(async (p: number) => {
    setLoading(true);

    const res = await fetch(
      `http://localhost:3000/api/search/photos?page=${p}&perPage=${PER_PAGE}&orderBy=${Unsplash.Search.SearchPhotoOrderBy.LATEST}`,
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

  useEffect(() => {
    const fetchTopics = async () => {
      setLoading(true);

      const res = await fetch(
        `http://localhost:3000/api/search/photos?page=1&perPage=${PER_PAGE}&orderBy=${Unsplash.Search.ListPhotosOrderBy.POPULAR}`,
      );

      if (res.ok) {
        const data = await res.json();
        // pick up one random out of top 20 popular photos
        setPopularPhoto(
          data.results[Math.round(Math.random() * data.results.length)],
        );
      }

      setLoading(false);
    };

    fetchTopics();
  }, []);

  const hasMore: boolean = useMemo(
    () => !loading && page < (!total ? 0 : Math.ceil(total / PER_PAGE)),
    [page, total, loading],
  );

  return (
    <HomeContext.Provider
      value={{
        popularPhoto,
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
