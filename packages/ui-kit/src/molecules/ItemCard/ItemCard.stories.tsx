import {ComponentMeta, Story} from '@storybook/react';

import ItemCard, {ItemCardPropsInterface} from './ItemCard';

const NAME = 'A NAME of ODYSSEY A NAME of ODYSSEY';
const DESC =
  "Since then, Nintendo has produced some of the most successful consoles in the video game industry, such as the Game Boy, the Super Nintendo Entertainment System, the Nintendo DS, the Wii, and the Switch. It has created numerous major franchises, including Mario, Donkey Kong, The Legend of Zelda, Pokémon, Kirby, Metroid, Fire Emblem, Animal Crossing, Splatoon, Star Fox, Xenoblade Chronicles, and Super Smash Bros. Nintendo's mascot, Mario, is internationally recognized. The company has sold more than 5.592 billion video games[7] and over 882.6 million hardware units globally, including Color TV-Game and Game & Watch sales, as of March 2023.";

export default {
  title: 'Molecules/ItemCard',
  component: ItemCard,
  decorators: [
    (Story) => (
      <div className="storybook-block">
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
  name: NAME,
  imageHeight: 124,
  description: DESC,
  imageErrorIcon: 'rabbit_fill',
  imageUrl: 'https://picsum.photos/500',
  onVisitClick: () => {},
  onInfoClick: () => {}
};

export const Small = Template.bind({});
Small.args = {
  variant: 'small',
  name: NAME,
  imageHeight: 124,
  description: DESC,
  imageErrorIcon: 'rabbit_fill',
  imageUrl: 'https://picsum.photos/500',
  onVisitClick: undefined,
  onInfoClick: () => {}
};

export const NormalWithBy = Template.bind({});
NormalWithBy.args = {
  variant: 'normal',
  name: NAME,
  byName: 'Username',
  imageHeight: 124,
  description: DESC,
  imageErrorIcon: 'rabbit_fill',
  imageUrl: 'https://picsum.photos/500',
  onVisitClick: () => {},
  onInfoClick: () => {}
};

export const SmallWithBy = Template.bind({});
SmallWithBy.args = {
  variant: 'small',
  name: NAME,
  byName: 'Username',
  imageHeight: 124,
  description: DESC,
  imageErrorIcon: 'rabbit_fill',
  imageUrl: 'https://picsum.photos/500',
  onVisitClick: () => {},
  onInfoClick: () => {}
};
