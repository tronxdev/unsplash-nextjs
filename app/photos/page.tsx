'use client';

import React, { useCallback, useMemo } from 'react';
import Header from './Header';
import Grid from './Grid';
import { usePhotos } from './PhotosContext';

export default function Page({ children }: { children?: React.ReactNode }) {
  const { photos, loadMore, hasMore, loading, recentQueries } = usePhotos();

  return (
    <>
      <Header />
      <Grid />
    </>
  );
}
