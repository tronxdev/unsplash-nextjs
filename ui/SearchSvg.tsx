interface ISearchSvg {
  className?: string;
  strokeWidth?: number;
}

export default function SearchSvg({ className, strokeWidth }: ISearchSvg) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth || 1.5}
      className={`${className} h-5 w-5 stroke-zinc-500`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
      />
    </svg>
  );
}
