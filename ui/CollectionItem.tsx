import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import * as Unsplash from '@/types/unsplash';

interface CollectionItemProps {
  data: Unsplash.Collection.Basic;
}

const CollectionItem: React.FC<CollectionItemProps> = ({ data }) => {
  return (
    <Link
      href={`/collections/${data.id}`}
      className="flex flex-row space-x-4 border-b border-solid border-zinc-700 p-4 hover:bg-zinc-800"
    >
      <div className="h-full w-full space-y-2">
        <div className="flex flex-row items-baseline space-x-4">
          <div className="text-base font-bold text-zinc-300">{data.title}</div>
          <div className="text-xs font-light text-zinc-300">
            {data.total_photos} photos
          </div>
        </div>
        <div className="h-full overflow-hidden text-ellipsis text-xs font-light italic text-zinc-400">
          {data.description}
        </div>
      </div>
      <div className="relative h-24 w-32 bg-zinc-900">
        <Image
          alt={data.cover_photo?.alt_description || ''}
          src={data.cover_photo?.urls.small_s3 || ''}
          fill={true}
          quality={100}
          className="object-contain"
          sizes="128px"
        />
      </div>
    </Link>
  );
};

export default CollectionItem;
