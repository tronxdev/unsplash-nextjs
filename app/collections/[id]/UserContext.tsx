'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Unsplash from '@/types/unsplash';

const UserContext = createContext<
  | {
      user?: Unsplash.User.Basic & { popularPhotos?: Unsplash.Photo.Basic[] };
      setUsername: React.Dispatch<React.SetStateAction<string | undefined>>;
      loading: boolean;
    }
  | undefined
>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<
    | (Unsplash.User.Basic & { popularPhotos?: Unsplash.Photo.Basic[] })
    | undefined
  >();
  const [username, setUsername] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getPhotos = async () => {
      setLoading(true);

      const res = await fetch(
        `${process.env.HOST}/api/user/${username}/photos?page=1&perPage=3&orderBy=popular&orientation=portrait`,
      );

      if (res.ok) {
        const data: Unsplash.Search.Photos = await res.json();

        setUser(
          (prev) =>
            ({
              ...prev,
              popularPhotos: data.results || [],
            } as Unsplash.User.Basic & {
              popularPhotos?: Unsplash.Photo.Basic[];
            }),
        );
      }

      setLoading(false);
    };

    if (username) getPhotos();
    else
      setUser(
        (prev) =>
          ({
            ...prev,
            popularPhotos: [],
          } as Unsplash.User.Basic & {
            popularPhotos?: Unsplash.Photo.Basic[];
          }),
      );
  }, [username]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUsername,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
}
