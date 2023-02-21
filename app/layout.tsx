import '@/styles/dist.css';
import 'react-tooltip/dist/react-tooltip.css';

import React, { Suspense } from 'react';
import { Session } from 'next-auth';
import { headers } from 'next/headers';
import Loading from './Loading';
import Main from './main';

async function getSession(cookie: string): Promise<Session> {
  const response = await fetch(`${process.env.NEXTAUTH_URL}/session`, {
    headers: {
      cookie,
    },
  });

  const session = await response.json();

  return Object.keys(session).length > 0 ? session : null;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession(headers().get('cookie') ?? '');

  return (
    <html>
      <head>
        <title>Unsplash Demo | Next.js@latest</title>
      </head>
      <body className="overflow-y-scroll bg-zinc-50">
        <Suspense fallback={<Loading />}>
          <Main session={session}>{children}</Main>
        </Suspense>
      </body>
    </html>
  );
}
