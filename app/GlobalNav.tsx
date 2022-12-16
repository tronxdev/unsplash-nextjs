'use client';

import clsx from 'clsx';
import { useSelectedLayoutSegments } from 'next/navigation';
import SearchBar from '@/ui/SearchBar';
import TabNavItem from '@/ui/TabNavItem';
import HorizonalScroller from '@/ui/HorizonalScroller';
import * as Unsplash from '@/types/unsplash';
import { useGlobal } from './GlobalContext';

export default function GlobalNav() {
  const [selectedLayoutSegments] = useSelectedLayoutSegments();
  const { topics, loading } = useGlobal();

  console.log(selectedLayoutSegments);

  return (
    <div>
      <div className="p-4">
        <SearchBar
          defaultQuery=""
          onQueryChange={() => {}}
          className="rounded-full bg-zinc-200"
        />
      </div>
      <div className="flex h-12 flex-row items-center space-x-2 pl-4">
        <TabNavItem
          key="__home__"
          href="/"
          itemId="__home__"
          isActive={!!selectedLayoutSegments}
        >
          Home
        </TabNavItem>
        <div>
          <div className="mt-2 mb-2 h-8 w-px bg-zinc-500" />
        </div>
        <HorizonalScroller wrapperClassName="grow overflow-x-hidden h-full">
          {topics.map((topic) => {
            const isActive: boolean = topic.id === selectedLayoutSegments;

            return (
              <TabNavItem
                key={topic.id}
                href={`/topics/${topic.id}`}
                itemId={topic.id}
                isActive={isActive}
              >
                {topic.title}
              </TabNavItem>
            );
          })}
        </HorizonalScroller>
      </div>
    </div>
  );
}
