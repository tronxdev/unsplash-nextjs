import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Popover } from 'react-tiny-popover';
import { useCollection } from './CollectionContext';
import { useUser } from './UserContext';
import UserCard from '@/ui/UserCard';

export default function Header() {
  const { collection } = useCollection();
  const { user, loading, setUsername } = useUser();

  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

  if (!collection) return <div>Unknown</div>;

  const { id, title, description, total_photos } = collection;
  const cover_photo = collection.cover_photo?.urls.full;
  const alt = collection.cover_photo?.alt_description;

  return (
    <div className="relative h-64 w-full bg-zinc-900">
      <Image
        alt={alt || ''}
        src={cover_photo || ''}
        fill={true}
        quality={100}
        className="object-cover object-center"
        sizes="1024px"
      />
      <div className="absolute right-32 left-10 top-8 bottom-8 space-y-4">
        <div className="text-3xl font-bold text-white drop-shadow-sm">
          {title}
        </div>
        <div className="text-sm font-light text-white drop-shadow-sm">
          {description}
        </div>
      </div>
      <div
        className={`absolute right-3 bottom-3 flex flex-row items-center space-x-2 p-4`}
      >
        <div className="cursor-default text-xs text-zinc-300 drop-shadow-sm">
          Collection by{' '}
          <Popover
            isOpen={isPopoverOpen}
            positions={['top', 'bottom', 'left', 'right']} // preferred positions by priority
            content={
              <UserCard
                initialData={collection.user}
                data={user}
                loading={loading}
                className="rounded border border-zinc-50 bg-white"
              />
            }
            onClickOutside={() => setIsPopoverOpen(false)}
          >
            <b
              className="underline hover:text-white"
              onMouseOver={() => {
                setIsPopoverOpen(true);
                setUsername(collection.user.username);
              }}
            >
              {collection.user.first_name + ' ' + collection.user.last_name}
            </b>
          </Popover>
        </div>
      </div>
    </div>
  );
}
