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

const TopicContext = createContext<
  | {
      topic?: Unsplash.Topic.Basic;
      setTopic: React.Dispatch<
        React.SetStateAction<Unsplash.Topic.Basic | undefined>
      >;
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

export function TopicProvider({ children }: { children: React.ReactNode }) {
  const [topic, setTopic] = useState<Unsplash.Topic.Basic | undefined>();
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
    console.log('load more', p);
    if (topic) {
      setLoading(true);

      const res = await fetch(
        `${process.env.HOST}/api/topic/${topic.id}/photos?page=${p}&perPage=${perPage}`,
      );

      if (res.ok) {
        const data = await res.json();

        setPhotos((prev) => _.uniqBy([...prev, ...data.results], 'id'));
        setTotal(data.total);
        setPage(p);
      }

      setLoading(false);
    }
  };

  useEffect(() => {
    async function fetchInitialData() {
      setTotal(-1);
      setPage(0);
      setPhotos([]);
      setLoading(true);

      const res = await fetch(
        `${process.env.HOST}/api/topic/${
          topic?.id
        }/photos?page=${1}&perPage=${perPage}`,
      );

      if (res.ok) {
        const data = await res.json();

        setPhotos((prev) => _.uniqBy([...prev, ...data.results], 'id'));
        setTotal(data.total);
        setPage(1);
      }

      setLoading(false);
    }

    if (topic?.id) {
      fetchInitialData();
    }
  }, [topic?.id]);

  return (
    <TopicContext.Provider
      value={{
        topic,
        setTopic,
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
    </TopicContext.Provider>
  );
}

export function uesTopic() {
  const context = useContext(TopicContext);
  if (context === undefined) {
    throw new Error('uesTopic must be used within a TopicProvider');
  }
  return context;
}
