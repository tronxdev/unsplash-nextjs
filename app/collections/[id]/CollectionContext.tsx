'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import * as Unsplash from '@/types/unsplash';

const MAX_TOTAL = 100000;

const CollectionContext = createContext<
  | {
      id?: string;
      setId: React.Dispatch<React.SetStateAction<string | undefined>>;
      collection?: Unsplash.Collection.Basic;
      loading: boolean;
      loadMore: (p: number) => Promise<void>;
      hasMore: boolean;
      photos: Unsplash.Photo.Basic[];
    }
  | undefined
>(undefined);

export function CollectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [id, setId] = useState<string | undefined>();
  const [collection, setCollection] = useState<
    Unsplash.Collection.Basic | undefined
  >();
  const [photos, setPhotos] = useState<Unsplash.Photo.Basic[]>([]);
  const [total, setTotal] = useState<number>(MAX_TOTAL);
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getCollection = async () => {
      setLoading(true);

      const res1 = await fetch(`${process.env.HOST}/api/collection/${id}`);
      const res2 = await fetch(
        `${
          process.env.HOST
        }/api/collection/${id}/photos?page=${1}&perPage=${perPage}`,
      );

      if (res1.ok && res2.ok) {
        const data1 = await res1.json();

        const data2: Unsplash.Search.Photos = await res2.json();

        setCollection(data1);
        setPhotos(data2.results);
        setTotal(data2.total);
      } else {
        setCollection(undefined);
        setPhotos([]);
        setTotal(MAX_TOTAL);
      }

      setLoading(false);
    };

    if (id) getCollection();
    else setCollection(undefined);
  }, [id]);

  const loadMore = useCallback(
    async (p: number) => {
      if (id) {
        setLoading(true);

        const res = await fetch(
          `${process.env.HOST}/api/collection/${id}/photos?page=${p}&perPage=${perPage}`,
        );

        if (res.ok) {
          const data = await res.json();

          setPhotos((prev) => [...prev, ...data.results]);
          setPage(p);
          setTotal(data.total);
        }

        setLoading(false);
      }
    },
    [id, perPage],
  );

  const hasMore: boolean = useMemo(
    () => !loading && page < (!total ? 0 : Math.ceil(total / perPage)),
    [page, total, loading],
  );

  return (
    <CollectionContext.Provider
      value={{
        id,
        setId,
        collection,
        loading,
        loadMore,
        hasMore,
        photos,
      }}
    >
      {children}
    </CollectionContext.Provider>
  );
}

export function useCollection() {
  const context = useContext(CollectionContext);

  if (context === undefined) {
    throw new Error('userCollection must be used within a CollectionProvider');
  }

  return context;
}
