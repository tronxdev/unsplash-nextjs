import React from 'react';
import { TopicProvider } from './TopicContext';

interface ILayout {
  children: React.ReactNode;
}

export default function Layout({ children }: ILayout) {
  return (
    <TopicProvider>
      <div className="w-full">{children}</div>
    </TopicProvider>
  );
}
