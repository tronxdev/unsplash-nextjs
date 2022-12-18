import React from 'react';
import Link from 'next/link';
import { Popover } from 'react-tiny-popover';

interface IItem {
  id: string;
  title: string;
  href: string;
}

interface ISection {
  id: string;
  title: string;
  items: IItem[];
}

interface ISearchPopover {
  children: React.ReactElement;
  isOpen: boolean;
  positions: ('top' | 'bottom' | 'left' | 'right')[];
  data: ISection[];
  className?: string;
  onClickOutside: () => void;
}

function Content({ data }: { data: ISection[] }) {
  return (
    <div className="w-full space-y-8 rounded border border-zinc-200 bg-zinc-50 p-4 shadow-lg">
      {data.map((d) => (
        <div key={d.id} className="space-y-2">
          <div className="text-base font-medium text-zinc-900">{d.title}</div>
          <div className="flex flex-row items-center space-x-2">
            {d.items.map((dd) => (
              <Link
                key={dd.id}
                href={dd.href}
                className="rounded-sm border border-zinc-500 px-3 py-1 hover:bg-zinc-200"
              >
                {dd.title}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SearchPopover({
  children,
  isOpen,
  positions,
  data,
  className,
  onClickOutside,
}: ISearchPopover) {
  return (
    <Popover
      isOpen={isOpen}
      positions={positions}
      onClickOutside={onClickOutside}
      containerClassName={`!z-50 ${className}`}
      content={<Content data={data} />}
    >
      <div>{children}</div>
    </Popover>
  );
}
