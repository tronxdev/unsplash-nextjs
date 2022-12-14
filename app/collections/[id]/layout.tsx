'use client';

import React from 'react';
import { CollectionProvider } from './CollectionContext';
import { UserProvider } from './UserContext';

export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <CollectionProvider>
      <UserProvider>
        <div className="h-full">{children}</div>
      </UserProvider>
    </CollectionProvider>
  );
}
