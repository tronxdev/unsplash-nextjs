'use client';

import '@/styles/dist.css';
import React from 'react';
import GlobalNav from './GlobalNav';
import { GlobalProvider } from './GlobalContext';
import { SearchCollectionsProvider } from './s/SearchCollectionsContext';
import { SearchPhotosProvider } from './s/SearchPhotosContext';

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
          <SearchCollectionsProvider>
            <SearchPhotosProvider>
              <div className="h-full w-full">
                <div className="sticky top-0 z-50 bg-zinc-100 drop-shadow-lg">
                  <GlobalNav />
                </div>
                <div className="h-full space-y-6">
                  <div className="w-full">{children}</div>
                </div>

                <div className="mt-28 flex items-center justify-center">
                  <div className="text-sm text-zinc-600">
                    Make something awesome.
                  </div>
                </div>
              </div>
            </SearchPhotosProvider>
          </SearchCollectionsProvider>
        </GlobalProvider>
      </body>
    </html>
  );
}
