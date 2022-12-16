import React, { useContext } from 'react';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import ChevronSvg from './ChevronSvg';

function LeftArrow() {
  const { isFirstItemVisible, scrollPrev } = useContext(VisibilityContext);

  return (
    <button
      disabled={isFirstItemVisible}
      onClick={() => scrollPrev()}
      className="h-12 px-1"
    >
      <ChevronSvg kind="left" />
    </button>
  );
}

function RightArrow() {
  const { isLastItemVisible, scrollNext } = useContext(VisibilityContext);

  return (
    <button
      disabled={isLastItemVisible}
      onClick={() => scrollNext()}
      className="h-12 px-1"
    >
      <ChevronSvg kind="right" />
    </button>
  );
}

interface IHorizonalScroller {
  children:
    | React.ReactElement<{ itemId: string }>
    | React.ReactElement<{ itemId: string }>[];
  wrapperClassName?: string;
}

export default function HorizonalScroller({
  children,
  wrapperClassName,
}: IHorizonalScroller) {
  return (
    <ScrollMenu
      LeftArrow={LeftArrow}
      RightArrow={RightArrow}
      wrapperClassName={wrapperClassName}
      scrollContainerClassName="overflow-x-hidden !h-full"
      itemClassName="whitespace-nowrap h-full flex items-center justify-center"
    >
      {children}
    </ScrollMenu>
  );
}
