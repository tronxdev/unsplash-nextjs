import React from 'react';

interface ILayout {
  children: React.ReactNode;
}

export default function Layout({ children }: ILayout) {
  return (
    <div>
      <div>topic layout</div>
      {children}
    </div>
  );
}
