import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { useDebouncedCallback } from 'use-debounce';
import * as Unsplash from '@/types/unsplash';
import download from '@/lib/download';
import SvgButton from '@/ui/SvgButton';

interface IPhoto {
  photo: Unsplash.Photo.Basic;
  favorite?: boolean;
  isProtected?: boolean;
  onFavoriteChange: (isFavorite: boolean) => void;
}

export default function Photo({
  photo,
  favorite,
  isProtected,
  onFavoriteChange,
}: IPhoto) {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(favorite || false);

  const debounced = useDebouncedCallback(onFavoriteChange, 1000);

  const handleDownloadClick = useCallback(() => {
    download(photo.urls.raw, 'image.jpg');
  }, [photo.urls.raw]);

  useEffect(() => {
    if (favorite !== isFavorite) debounced(isFavorite);
  }, [favorite, isFavorite, debounced]);

  return (
    <div
      className="relative block w-full bg-zinc-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img alt={photo.id} src={photo.urls.regular} />
      {!isProtected && isHovered && (
        <div className="absolute left-0 top-0 z-10 h-full w-full bg-zinc-700 opacity-80">
          <div className="absolute top-0 left-0 right-0 flex w-full flex-row items-center justify-end p-4">
            <SvgButton
              kind={isFavorite ? 'SolidStar' : 'OutlineStar'}
              className="h-8 w-8 text-zinc-100"
              onClick={() => setIsFavorite((prev) => !prev)}
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 flex w-full flex-row items-center justify-between p-4">
            <div className="relative h-14 w-14 overflow-hidden rounded-full border border-zinc-300">
              <Image
                alt={photo.user.username}
                src={photo.user.profile_image.medium}
                fill={true}
                quality={100}
                className="object-contain"
                sizes="640px"
              />
            </div>
            <SvgButton
              kind="OutlineDownload"
              className="h-8 w-8 text-zinc-100"
              onClick={handleDownloadClick}
            />
          </div>
        </div>
      )}
    </div>
  );
}
