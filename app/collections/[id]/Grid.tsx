import InfiniteScroll from 'react-infinite-scroller';
import Masonry from 'react-responsive-masonry';
import Photo from '@/ui/PhotoItem';
import { useCollection } from './CollectionContext';

export default function Grid() {
  const { hasMore, loadMore, photos } = useCollection();

  return (
    <div className="h-[32rem] w-full">
      <div className="mt-4 h-full overflow-auto">
        <InfiniteScroll
          pageStart={0}
          loadMore={loadMore}
          hasMore={hasMore}
          useWindow={false}
          threshold={150}
        >
          <Masonry gutter="2rem">
            {photos.map((photo) => (
              <Photo
                key={photo.id}
                photo={photo}
                favorite={false}
                onFavoriteChange={() => {}}
              />
            ))}
          </Masonry>
        </InfiniteScroll>
      </div>
    </div>
  );
}
