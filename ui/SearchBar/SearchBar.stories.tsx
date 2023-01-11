import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import SearchBar from '.';

export default {
  title: 'SearchBar',
  component: SearchBar,
} as ComponentMeta<typeof SearchBar>;

const Template: ComponentStory<typeof SearchBar> = (args) => (
  <SearchBar {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  className: 'w-full !rounded-full bg-zinc-200',
  defaultQuery: 'hello',
  onQueryChange: (q) => {},
  onQuerySubmit: (q) => {},
  onFocus: () => {},
};
