import {ComponentMeta, Story} from '@storybook/react';

import ItemCard, {ItemCardPropsInterface} from './ItemCard';

export default {
  title: 'Molecules/ItemCard',
  component: ItemCard,
  decorators: [
    (Story) => (
      <div className="storybook-block-2">
        <Story />
      </div>
    )
  ]
} as ComponentMeta<typeof ItemCard>;

const Template: Story<ItemCardPropsInterface> = (args) => {
  return <ItemCard {...args} />;
};

export const Normal = Template.bind({});
Normal.args = {
  variant: 'normal',
  name: 'A NAME of ODYSSEY',
  imageHeight: 124,
  description: 'Lorem ipsum dolor sit amet, consectetuer. Lorem ipsum dolor sit amet, consctetuer.',
  imageErrorIcon: 'rabbit_fill',
  imageUrl: 'https://picsum.photos/500',
  onVisitClick: () => {},
  onInfoClick: () => {}
};

export const Small = Template.bind({});
Small.args = {
  variant: 'small',
  name: 'A NAME of ODYSSEY',
  imageHeight: 124,
  description: 'Lorem ipsum dolor sit amet, consectetuer. Lorem ipsum dolor sit amet, consecetuer.',
  imageErrorIcon: 'rabbit_fill',
  imageUrl: 'https://picsum.photos/500',
  onVisitClick: () => {},
  onInfoClick: () => {}
};

export const NormalWithBy = Template.bind({});
NormalWithBy.args = {
  variant: 'normal',
  name: 'A NAME of ODYSSEY',
  byName: 'Username',
  imageHeight: 124,
  description: 'Lorem ipsum dolor sit amet, consectetuer. Lorem ipsum dolor sit amet, consctetuer.',
  imageErrorIcon: 'rabbit_fill',
  imageUrl: 'https://picsum.photos/500',
  onVisitClick: () => {},
  onInfoClick: () => {}
};

export const SmallWithBy = Template.bind({});
SmallWithBy.args = {
  variant: 'small',
  name: 'A NAME of ODYSSEY',
  byName: 'Username',
  imageHeight: 124,
  description: 'Lorem ipsum dolor sit amet, consectetuer. Lorem ipsum dolor sit amet, consecetuer.',
  imageErrorIcon: 'rabbit_fill',
  imageUrl: 'https://picsum.photos/500',
  onVisitClick: () => {},
  onInfoClick: () => {}
};
