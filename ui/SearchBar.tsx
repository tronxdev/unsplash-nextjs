'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import SVG from './svg';

interface ISearchBar {
  className?: string;
  defaultQuery?: string;
  onQueryChange: (q: string) => void;
  onQuerySubmit: (q: string) => void;
  onFocus?: () => void;
}

export default function SearchBar({
  className,
  defaultQuery,
  onQueryChange,
  onQuerySubmit,
  onFocus,
}: ISearchBar) {
  const inputRef = useRef<HTMLInputElement>(null);

  const debounced = useDebouncedCallback(onQueryChange, 1000);

  const handleSubmit = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (
        e.key === 'Enter' &&
        inputRef &&
        inputRef.current &&
        inputRef.current.value
      ) {
        onQuerySubmit(inputRef.current.value);
      }
    },
    [inputRef, onQuerySubmit],
  );

  useEffect(() => {
    if (inputRef && inputRef.current && !!defaultQuery) {
      inputRef.current.value = defaultQuery;
    }
    debounced(defaultQuery || '');
  }, [defaultQuery, debounced, inputRef]);

  return (
    <div
      className={`${className} flex w-full items-center space-x-1 rounded-md border border-zinc-50 p-2 outline-none`}
    >
      <div className="h-5 w-5 stroke-zinc-500 text-zinc-500">
        {SVG.OutlineSearch}
      </div>
      <input
        ref={inputRef}
        type={'text'}
        defaultValue={defaultQuery}
        onChange={(e) => debounced(e.target.value)}
        onKeyDown={handleSubmit}
        onFocus={onFocus}
        placeholder="Search..."
        className="flex w-full bg-transparent px-1 text-sm text-zinc-900 outline-none"
      />
    </div>
  );
}
