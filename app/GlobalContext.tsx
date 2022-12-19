'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import _ from 'lodash';
import * as Unsplash from '@/types/unsplash';

const GlobalContext = createContext<
  | {
      topics: Unsplash.Topic.Basic[];
      recentQueries: string[];
      addRecentQuery: (q: string) => void;
      recentCollections: Unsplash.Collection.Basic[];
      addRecentCollection: (c: Unsplash.Collection.Basic) => void;
      recentTopics: Unsplash.Topic.Basic[];
      addRecentTopic: (t: Unsplash.Topic.Basic) => void;
      loading: boolean;
    }
  | undefined
>(undefined);

export function GlobalProvider({ children }: { children: React.ReactNode }) {
  const [topics, setTopics] = useState<Unsplash.Topic.Basic[]>([]);
  const [recentQueries, setRecentQueries] = useState<string[]>([]);
  const [recentCollections, setRecentCollections] = useState<
    Unsplash.Collection.Basic[]
  >([]);
  const [recentTopics, setRecentTopics] = useState<Unsplash.Topic.Basic[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const addRecentQuery = useCallback((q: string) => {
    setRecentQueries((prev) => _.uniq([q, ...prev]).slice(0, 5));
  }, []);

  const addRecentCollection = useCallback(
    (c: Unsplash.Collection.Basic) => {
      setRecentCollections(
        _.uniqBy([c, ...recentCollections], 'id').slice(0, 5),
      );
    },
    [recentCollections],
  );

  const addRecentTopic = useCallback(
    (t: Unsplash.Topic.Basic) => {
      setRecentTopics(_.uniqBy([t, ...recentTopics], 'id').slice(0, 5));
    },
    [recentTopics],
  );

  useEffect(() => {
    const fetchTopics = async () => {
      setLoading(true);

      const res = await fetch(
        `${process.env.HOST}/api/search/topics?page=1&perPage=20`,
      );

      if (res.ok) {
        const data = await res.json();
        setTopics(data.results);
      } else {
        setTopics([]);
      }

      setLoading(false);
    };

    fetchTopics();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        topics,
        recentQueries,
        addRecentQuery,
        recentCollections,
        addRecentCollection,
        recentTopics,
        addRecentTopic,
        loading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobal() {
  const context = useContext(GlobalContext);

  if (context === undefined) {
    throw new Error('useGlobal must be used within a GlobalProvider');
  }

  return context;
}
