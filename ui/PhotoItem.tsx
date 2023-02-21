import React, {
  ButtonHTMLAttributes,
  HTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useDebouncedCallback } from 'use-debounce';
import clsx from 'clsx';
import { Tooltip } from 'react-tooltip';
import * as Unsplash from '@/types/unsplash';
import download from '@/lib/download';
import SvgButton from '@/ui/SvgButton';

interface IPhoto {
  photo: Unsplash.Photo.Basic;
  favorite?: boolean;
  isProtected?: boolean;
  onFavoriteChange: (isFavorite: boolean) => void;
}

interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

function IconButton({ children, className, ...otherProps }: IconButtonProps) {
  return (
    <button
      className={clsx(
        'flex h-8 w-10 items-center justify-center rounded bg-white',
        className,
      )}
      {...otherProps}
    >
      {children}
    </button>
  );
}

export default function Photo({
  photo,
  favorite,
  isProtected,
  onFavoriteChange,
}: IPhoto) {
  console.log(photo.urls.thumb);

  const imgRef = useRef<HTMLDivElement>(null);

  const [imgSize, setImgSize] = useState({
    width: photo.width,
    height: photo.height,
  });
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(favorite || false);

  const debounced = useDebouncedCallback(onFavoriteChange, 1000);

  const handleDownloadClick = useCallback(() => {
    download(photo.urls.raw, 'image.jpg');
  }, [photo.urls.raw]);

  useEffect(() => {
    if (favorite !== isFavorite) debounced(isFavorite);
  }, [favorite, isFavorite, debounced]);

  useEffect(() => {
    const handleWindowResize = () => {
      if (imgRef.current) {
        // console.log(imgRef.current?.offsetWidth);
        setImgSize({
          width: imgRef.current?.offsetWidth,
          height: Math.floor(
            (photo.height * imgRef.current.offsetWidth) / photo.width,
          ),
        });
        // setWidth(imgRef.current.offsetWidth);
      }
    };

    window.addEventListener('resize', handleWindowResize);

    handleWindowResize();

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [imgRef]);

  // console.log(photo.id, photo.height, photo.width);
  // console.log(
  //   photo.id,
  //   imgRef.current?.offsetHeight,
  //   imgRef.current?.offsetWidth,
  // );
  // console.log(photo.id, photo.blur_hash);

  return (
    <div>
      {/* TABLET OR DESKTOP */}
      <div
        className="relative hidden w-full bg-zinc-100 sm:block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div ref={imgRef} className={`h-auto w-auto overflow-hidden shadow`}>
          {/* <div
            className={`relative h-[${imgSize.height}px] w-[${imgSize.width}px]`}
            // className={`relative h-[245px] w-full`}
          > */}
          <Image
            alt={photo.id}
            src={photo.urls.small}
            height={imgSize.height}
            width={imgSize.width}
            // fill={true}
            quality={80}
            // placeholder={blurDataUrl ? 'blur' : 'empty'}
            // blurDataURL={blurDataUrl}
            className="object-contain"
            style={{
              width: 'auto',
              height: 'auto',
            }}
            sizes="640px"
          />
          {/* </div> */}
        </div>
        {/* <img alt={photo.id} src={photo.urls.regular} /> */}
        {!isProtected && isHovered && (
          <>
            <div
              className="absolute left-0 top-0 z-10 h-full w-full bg-zinc-700 opacity-80 hover:cursor-zoom-in"
              id={`overlay-${photo.id}`}
              data-tooltip-content={photo.description || photo.alt_description!}
            >
              <div className="absolute top-0 left-0 right-0 flex w-full flex-row items-center justify-end p-4">
                {/* LIKE/UNLIKE */}
                <IconButton onClick={() => setIsFavorite((prev) => !prev)}>
                  <SvgButton
                    kind={isFavorite ? 'SolidHeart' : 'OutlineHeart'}
                    className="h-5 w-5 text-zinc-600 hover:text-zinc-800"
                  />
                </IconButton>
              </div>
              <div className="absolute bottom-0 left-0 right-0 flex w-full flex-row items-center justify-between p-4">
                {/* PHOTO OWNER */}
                <div className="flex flex-1 cursor-default flex-row items-center space-x-2">
                  {/* PROFILE PHOTO */}
                  <div className="relative h-10 w-10 overflow-hidden rounded-full shadow">
                    <Image
                      alt={photo.user.username}
                      src={photo.user.profile_image.small}
                      fill={true}
                      quality={100}
                      className="object-contain"
                      sizes="32px"
                    />
                  </div>
                  {/* PERSONAL INFO */}
                  <div className="flex flex-col">
                    {/* USERNAME */}
                    <div className="flex-nowrap overflow-hidden text-ellipsis text-[15px] font-normal leading-5 text-white">
                      {photo.user.name}
                    </div>
                    {/* TWITTER NAME & TOS ACCEPTED */}
                    {photo.user.twitter_username && (
                      <div className="flex flex-row flex-nowrap items-center space-x-1 overflow-hidden text-ellipsis text-xs font-normal leading-5 text-white">
                        <Link
                          href={`https://twitter.com/${photo.user.twitter_username}`}
                        >
                          @{photo.user.twitter_username}
                        </Link>
                        {photo.user.accepted_tos ? (
                          <SvgButton
                            kind="SolidVerified"
                            className="h-[14px] w-[14px] text-white"
                          />
                        ) : (
                          ''
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {/* DOWNLOAD */}
                <IconButton onClick={handleDownloadClick}>
                  <SvgButton
                    kind="OutlineDownload"
                    className="h-5 w-5 text-zinc-600"
                  />
                </IconButton>
              </div>
            </div>

            <Tooltip
              anchorId={`overlay-${photo.id}`}
              place="bottom"
              className="z-50"
            />
          </>
        )}
      </div>
    </div>
  );
}
