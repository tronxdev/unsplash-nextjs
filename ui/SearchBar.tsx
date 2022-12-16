'use client';

import { useEffect, useRef } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import SearchSvg from './SearchSvg';

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
      className={`${className} flex w-full items-center space-x-1 rounded-md border border-zinc-50 p-2 outline-none`}
    >
      <SearchSvg />
      <input
        ref={inputRef}
        type={'text'}
        defaultValue={defaultQuery}
        onChange={(e) => debounced(e.target.value)}
        placeholder="Search..."
        className="flex w-full bg-transparent px-1 text-sm text-zinc-900 outline-none"
      />
    </div>
  );
}
