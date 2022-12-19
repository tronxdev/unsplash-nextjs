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
  const selectedLayoutSegments = useSelectedLayoutSegments();
  const pathname = usePathname();

  const { topics, loading } = useGlobal();

  const isSearchPage: boolean =
    selectedLayoutSegments.length > 0 && selectedLayoutSegments[0] === 's';

  let searchQuery: string = '';
  if (isSearchPage) {
    // url format: /s/photos/[query]
    searchQuery = selectedLayoutSegments[2];
  }

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

          {isSearchPage ? (
            <div className="flex h-12 w-full flex-row items-center space-x-8 pl-4">
              <TabNavItem
                key="__photos__"
                href={`/s/photos/${searchQuery}`}
                itemId="__photos__"
                isActive={selectedLayoutSegments[1] === 'photos'}
              >
                Photos
              </TabNavItem>
              <TabNavItem
                key="__collections__"
                href={`/s/collections/${searchQuery}`}
                itemId="__collections__"
                isActive={selectedLayoutSegments[1] === 'collections'}
              >
                Collections
              </TabNavItem>
              <TabNavItem
                key="__uesrs__"
                href={`/s/users/${searchQuery}`}
                itemId="__users__"
                isActive={selectedLayoutSegments[1] === 'users'}
              >
                Users
              </TabNavItem>
            </div>
          ) : (
            <div className="flex h-12 w-full flex-row items-center space-x-4 pl-4">
              <TabNavItem
                key="__home__"
                href="/"
                itemId="__home__"
                isActive={selectedLayoutSegments.length === 0}
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
          )}
        </>
      )}
    </div>
  );
}
