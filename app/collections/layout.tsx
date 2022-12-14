'use client';

import React from 'react';
import { CollectionsProvider } from './CollectionsContext';

export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <CollectionsProvider>
      <div className="h-full">{children}</div>
    </CollectionsProvider>
  );
}
