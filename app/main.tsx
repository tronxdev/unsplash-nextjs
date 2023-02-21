'use client';

import GlobalNav from './GlobalNav';
import { SessionProvider } from 'next-auth/react';
import { GlobalProvider } from './GlobalContext';
import { SearchCollectionsProvider } from './s/SearchCollectionsContext';
import { SearchPhotosProvider } from './s/SearchPhotosContext';
import { Session } from 'next-auth';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full w-full">
      <div className="sticky top-0 z-50 bg-zinc-100 drop-shadow-lg">
        <GlobalNav />
      </div>
      <div className="h-full space-y-6">
        <div className="w-full">{children}</div>
      </div>

      <div className="mt-28 flex items-center justify-center">
        <div className="text-sm text-zinc-600">Make something awesome.</div>
      </div>
    </div>
  );
}

export default function Main({
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
            <Layout>{children}</Layout>
          </SearchPhotosProvider>
        </SearchCollectionsProvider>
      </GlobalProvider>
    </SessionProvider>
  );
}
