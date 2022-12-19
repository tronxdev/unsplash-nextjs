'use client';

import React from 'react';
import { useSearchPhotos } from '../../SearchPhotosContext';

export default function Page({ params }: { params: { query: string } }) {
  // console.log(params.query);

  const { photos, setQuery } = useSearchPhotos();

  return <div>users page</div>;
}
