'use client';

import { useEffect } from 'react';
import Header from './Header';
import { useCollection } from './CollectionContext';
import Grid from './Grid';

export default function Page({ params }: { params: { id: string } }) {
  const { collection, setId } = useCollection();
  // const { setUser } = useUser();

  useEffect(() => {
    setId(params.id);
  }, [params.id]);

  // useEffect(() => {
  //   setUser(collection?.user);
  // }, [collection?.user.username]);

  return (
    <div>
      <Header />
      <Grid />
    </div>
  );
}
