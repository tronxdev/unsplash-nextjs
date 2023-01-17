'use client';

import GlobalNav from './GlobalNav';
import Loading from './Loading';
import { SessionProvider } from 'next-auth/react';
import { GlobalProvider, useGlobal } from './GlobalContext';
import { SearchCollectionsProvider } from './s/SearchCollectionsContext';
import { SearchPhotosProvider } from './s/SearchPhotosContext';
import { Session } from 'next-auth';

function Wrapper({ children }: { children: React.ReactNode }) {
  const { loading } = useGlobal();

  return (
    <div className="h-full w-full">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="sticky top-0 z-50 bg-zinc-100 drop-shadow-lg">
            <GlobalNav />
          </div>
          <div className="h-full space-y-6">
            <div className="w-full">{children}</div>
          </div>

          <div className="mt-28 flex items-center justify-center">
            <div className="text-sm text-zinc-600">Make something awesome.</div>
          </div>
        </>
      )}
    </div>
  );
}

export default function Container({
  session,
  children,
}: {
  session: Session;
  children: React.ReactNode;
}) {
  return (
    <SessionProvider session={session}>
      <GlobalProvider>
        <SearchCollectionsProvider>
          <SearchPhotosProvider>
            <Wrapper>{children}</Wrapper>
          </SearchPhotosProvider>
        </SearchCollectionsProvider>
      </GlobalProvider>
    </SessionProvider>
  );
}
