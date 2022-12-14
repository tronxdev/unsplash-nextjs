'use client';

import React from 'react';
import { PhotosProvider } from './PhotosContext';

export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <PhotosProvider>
      <div className="h-full">{children}</div>
    </PhotosProvider>
  );
}
