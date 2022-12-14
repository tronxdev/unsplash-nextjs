'use client';

import { useEffect, useRef } from 'react';
import { useDebouncedCallback } from 'use-debounce';

interface ISearchBar {
  className?: string;
  defaultQuery?: string;
  onQueryChange: (q: string) => void;
}

export default function SearchBar({
  className,
  defaultQuery,
  onQueryChange,
}: ISearchBar) {
  const inputRef = useRef<HTMLInputElement>(null);

  const debounced = useDebouncedCallback(onQueryChange, 1000);

  useEffect(() => {
    if (inputRef && inputRef.current && !!defaultQuery) {
      inputRef.current.value = defaultQuery;
    }
    debounced(defaultQuery || '');
  }, [defaultQuery, debounced, inputRef]);

  return (
    <div
      className={`flex w-full items-center space-x-1 rounded-md border border-zinc-50 p-2 outline-none ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        // stroke="currentColor"
        className="h-6 w-6 stroke-zinc-50"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
      </svg>
      <input
        ref={inputRef}
        type={'text'}
        defaultValue={defaultQuery}
        onChange={(e) => debounced(e.target.value)}
        placeholder="Search..."
        className="flex w-full bg-transparent px-1 text-sm text-zinc-50 outline-none"
      />
    </div>
  );
}
