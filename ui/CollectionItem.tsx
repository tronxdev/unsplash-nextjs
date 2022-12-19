import { useCallback, useState } from 'react';
import Image from 'next/image';
import * as Unsplash from '@/types/unsplash';
import download from '@/lib/download';
import SvgButton from '@/ui/SvgButton';

interface ICollectionItem {
  collection: Unsplash.Collection.Basic;
}

export default function CollectionItem({ collection }: ICollectionItem) {
  const { title, total_photos, preview_photos, user } = collection;

  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <div
      className="relative mb-8 flex aspect-[4/3] w-full flex-col bg-transparent"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="min-h-48 flex flex-1 flex-row overflow-hidden rounded-xl hover:opacity-75">
        <div className="relative h-full w-2/3 bg-zinc-500">
          {preview_photos && preview_photos[0] && (
            <Image
              alt={preview_photos[0].id}
              src={preview_photos[0].urls.regular}
              fill={true}
              quality={100}
              className="object-cover object-center"
              sizes="640px"
            />
          )}
        </div>
        <div className="flex flex-1 flex-col">
          <div className="relative h-1/2 w-full border-l-2 border-b-2 border-l-white border-b-white bg-green-500">
            {preview_photos && preview_photos[1] && (
              <Image
                alt={preview_photos[1].id}
                src={preview_photos[1].urls.small}
                fill={true}
                quality={100}
                className="object-cover object-center"
                sizes="640px"
              />
            )}
          </div>
          <div className="relative h-1/2 w-full border-l-2 border-l-white bg-orange-500">
            {preview_photos && preview_photos[2] && (
              <Image
                alt={preview_photos[2].id}
                src={preview_photos[2].urls.regular}
                fill={true}
                quality={100}
                className="object-cover object-center"
                sizes="640px"
              />
            )}
          </div>
        </div>
      </div>
      <div className="w-full py-4">
        <div className="overflow-hidden !text-ellipsis whitespace-nowrap text-lg font-semibold text-zinc-900">
          {title}
        </div>
        <div className="flex flex-row items-center space-x-2 text-sm font-light text-zinc-500">
          <span className="whitespace-nowrap">
            {total_photos} photo{total_photos > 1 ? 's' : ''}
          </span>
          <span>·</span>
          <span className="overflow-hidden !text-ellipsis whitespace-nowrap">
            Curated by {user.first_name + ' ' + user.last_name}
          </span>
        </div>
      </div>
    </div>
  );
}
