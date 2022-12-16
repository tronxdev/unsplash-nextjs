'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Unsplash from '@/types/unsplash';

const GlobalContext = createContext<
  | {
      topics: Unsplash.Topic.Basic[];
      loading: boolean;
    }
  | undefined
>(undefined);

export function GlobalProvider({ children }: { children: React.ReactNode }) {
  const [topics, setTopics] = useState<Unsplash.Topic.Basic[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchTopics = async () => {
      setLoading(true);

      const res = await fetch(
        `http://localhost:3000/api/search/topics?page=1&perPage=20`,
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
