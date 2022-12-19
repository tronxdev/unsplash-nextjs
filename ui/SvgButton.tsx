import React from 'react';
import SVG, { Kind } from './svg';

interface IButton {
  kind: Kind;
  className?: string;
  onClick: () => void;
}

export default function Button({ kind, className, onClick }: IButton) {
  return (
    <div className={className} onClick={onClick}>
      {SVG[kind]}
    </div>
  );
}
