type Item = {
  name: string;
  slug: 'dashboard' | 'photos' | 'collections';
  items: {
    name: string;
    slug: string;
  }[];
};

export const demos: Item[] = [
  {
    name: 'Dashbaord',
    slug: 'dashboard',
    items: [],
  },
  {
    name: 'Photos',
    slug: 'photos',
    items: [],
  },
  {
    name: 'Collections',
    slug: 'collections',
    items: [],
  },
];
