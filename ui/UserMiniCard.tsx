import Image from 'next/image';
import * as Unsplash from '@/types/unsplash';

interface IUserMiniCard {
  data?: Unsplash.User.Basic;
  className?: string;
}

export default function UserMiniCard({ data, className }: IUserMiniCard) {
  if (!data) return <div>Unknown</div>;

  const {
    first_name,
    last_name,
    username,
    profile_image,
    bio,
    location,
    twitter_username,
    accepted_tos,
  } = data;

  return (
    <div className={`flex flex-row items-center space-x-2 p-2 ${className}`}>
      <div className="relative h-8 w-8 overflow-hidden rounded-full border border-zinc-300">
        <Image
          alt={username}
          src={profile_image.large}
          fill={true}
          quality={100}
          className="object-contain"
          sizes="128px"
        />
      </div>
      <div className="text-zinc-50">
        <div className="text-sm font-semibold drop-shadow-sm">
          {first_name + ' ' + last_name}
        </div>
        <div className="flex flex-row items-center space-x-2">
          <div className="text-[0.7rem] font-normal drop-shadow-sm">
            @{username}
          </div>
          {accepted_tos && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6"
            >
              <path
                fillRule="evenodd"
                d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
