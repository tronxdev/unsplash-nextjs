'use client';

import clsx from 'clsx';
import {
  useSelectedLayoutSegments,
  usePathname,
  useSearchParams,
} from 'next/navigation';
import SearchBar from '@/ui/SearchBar';
import TabNavItem from '@/ui/TabNavItem';
import HorizonalScroller from '@/ui/HorizonalScroller';
import Loading from '@/ui/Loading';
import { useGlobal } from './GlobalContext';

export default function GlobalNav() {
  const [selectedLayoutSegments] = useSelectedLayoutSegments();
  const pathname = usePathname();

  const { topics, loading } = useGlobal();

  return (
    <div
      className={clsx('flex min-h-[118px] flex-col', {
        'items-center justify-center': loading,
        'items-start justify-start': !loading,
      })}
    >
      {loading ? (
        <Loading kind="small" />
      ) : (
        <>
          <div className="w-full p-4">
            <SearchBar
              defaultQuery=""
              onQueryChange={() => {}}
              className="!rounded-full bg-zinc-200"
            />
          </div>
          <div className="flex h-12 w-full flex-row items-center space-x-2 pl-4">
            <TabNavItem
              key="__home__"
              href="/"
              itemId="__home__"
              isActive={!selectedLayoutSegments}
            >
              Home
            </TabNavItem>
            <div>
              <div className="mt-2 mb-2 h-8 w-px bg-zinc-500" />
            </div>
            <HorizonalScroller wrapperClassName="grow overflow-x-hidden h-full">
              {topics.map((topic) => {
                const isActive: boolean = `/topics/${topic.id}` === pathname;

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
        </>
      )}
    </div>
  );
}
