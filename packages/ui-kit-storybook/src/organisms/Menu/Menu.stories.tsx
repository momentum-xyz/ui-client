import {ComponentMeta, Story} from '@storybook/react';
import {useState} from 'react';

import Menu, {MenuPropsInterface} from './Menu';

export default {
  title: 'Organisms/Menu',
  component: Menu
} as ComponentMeta<typeof Menu>;

const IMAGE_SRC = 'https://picsum.photos/300';

const Template: Story<MenuPropsInterface> = (args) => {
  const [activeId, setActiveId] = useState(1);
  return <Menu {...args} activeMenuItemId={activeId} onMenuItemSelection={setActiveId} />;
};

export const General = Template.bind({});
General.args = {
  leftActions: [
    {
      id: 1,
      iconName: 'menu_info'
    },
    {
      id: 2,
      iconName: 'leave'
    },
    {
      id: 3,
      imageSrc: IMAGE_SRC
    },
    {
      id: 4,
      iconName: 'smiley-face'
    }
  ],
  centerActions: [
    {
      id: 5,
      iconName: 'star_small'
    },
    {
      id: 6,
      iconName: 'edit'
    }
  ],
  rightActions: [
    {
      id: 7,
      iconName: 'voice_chat'
    },
    {
      id: 8,
      iconName: 'chat'
    },
    {
      id: 9,
      iconName: 'search'
    },
    {
      id: 10,
      iconName: 'meeting'
    },
    {
      id: 11,
      iconName: 'calendar'
    },
    {
      id: 12,
      iconName: 'clock'
    },
    {
      id: 13,
      imageSrc: IMAGE_SRC
    }
  ]
};
