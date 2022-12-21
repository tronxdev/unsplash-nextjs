'use client';

import '@/styles/dist.css';
import React, { Suspense } from 'react';
import GlobalNav from './GlobalNav';
import Loading from './Loading';
import { GlobalProvider, useGlobal } from './GlobalContext';
import { SearchCollectionsProvider } from './s/SearchCollectionsContext';
import { SearchPhotosProvider } from './s/SearchPhotosContext';

function Container({ children }: { children: React.ReactNode }) {
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <title>Unsplash Demo | Next.js@latest</title>
      </head>
      <body className="overflow-y-scroll bg-zinc-50">
        <GlobalProvider>
          <Suspense fallback={<Loading />}>
            <SearchCollectionsProvider>
              <SearchPhotosProvider>
                <Container>{children}</Container>
              </SearchPhotosProvider>
            </SearchCollectionsProvider>
          </Suspense>
        </GlobalProvider>
      </body>
    </html>
  );
}
