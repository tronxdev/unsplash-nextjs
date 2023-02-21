'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import InfiniteScroll from 'react-infinite-scroller';
import Masonry from 'react-responsive-masonry';
import Photo from '@/ui/PhotoItem';
import { useGlobal } from '../../GlobalContext';
import { uesTopic } from '../TopicContext';

export default function Page({ params }: { params: { id: string } }) {
  const topicId: string = params.id;

  const { topics } = useGlobal();

  const { topic, photos, loadMore, hasMore, setTopic } = uesTopic();

  useEffect(() => {
    if (topicId && topics.length > 0) {
      setTopic(topics.find((t) => t.id === topicId));
    } else {
      setTopic(undefined);
    }
  }, [topics, topicId]);

  return (
    <div className="w-full space-y-8">
      {topic ? (
        <>
          <div className="relative flex h-128 w-full flex-row bg-zinc-200">
            {topic.cover_photo && (
              <Image
                alt={topic.id}
                src={topic.cover_photo?.urls.full}
                fill={true}
                quality={100}
                className="object-cover object-center"
                // placeholder="blur"
                // blurDataURL={topic.cover_photo?.blur_hash || ''}
                sizes="640px"
              />
            )}
            <div className="absolute top-0 left-0 flex h-full w-2/3 flex-col justify-center space-y-6 px-16">
              <div className="text-4xl font-bold text-zinc-50">
                {topic.title}
              </div>
              <div className="max-w-2xl text-lg font-medium text-zinc-50">
                {topic.description}
              </div>
            </div>
            {topic.preview_photos && topic.preview_photos.length > 1 && (
              <div className="absolute top-0 left-2/3 right-0 flex h-full flex-col items-stretch bg-white bg-opacity-80">
                {topic.preview_photos?.slice(1, 4).map((p, idx) => (
                  <div
                    key={p.id}
                    className={`relative w-full flex-1 border-l-2 border-t-${
                      idx === 0 ? '0' : '2'
                    } border-l-white border-t-white`}
                  >
                    <Image
                      alt={p.id}
                      src={p.urls.small}
                      fill={true}
                      quality={100}
                      className="object-cover object-center"
                      sizes="640px"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          <InfiniteScroll
            pageStart={0}
            loadMore={loadMore}
            hasMore={hasMore}
            useWindow={true}
            threshold={250}
            className="px-4"
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
        </>
      ) : (
        <div>No topic found.</div>
      )}
    </div>
  );
}
