import type { Dispatch, Reducer } from 'react';
import type { Session } from 'next-auth';
import type { Nullable } from '@/types/typescript';

import React, { createContext, useContext, useReducer } from 'react';
import { useSession } from 'next-auth/react';

export interface IUserState {
  session: Nullable<Session>;
  status: 'authenticated' | 'unauthenticated' | 'loading';
  photoLikes: string[];
  loading: boolean;
  error?: { message: string };
}

const INITIAL_STATE: IUserState = {
  session: null,
  status: 'unauthenticated',
  photoLikes: [],
  loading: false,
};

export const UserContext = createContext<[IUserState, Dispatch<any>]>([
  INITIAL_STATE,
  () => {},
]);
UserContext.displayName = 'User';

export const UserProvider = ({
  children,
  initialState,
  reducer,
}: {
  children: React.ReactNode;
  initialState: IUserState;
  reducer: Reducer<IUserState, any>;
}) => {
  const { data: session, status } = useSession();

  const [userState, dispatch] = useReducer(reducer, {
    ...initialState,
    session,
    status,
  });

  return (
    <UserContext.Provider value={[userState, dispatch]}>
      {children}
    </UserContext.Provider>
  );
};

export function useUser() {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error('useUser must be used within UserProvider');
  }

  return context;
}
