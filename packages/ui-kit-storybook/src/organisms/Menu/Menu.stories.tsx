import {ComponentMeta, Story} from '@storybook/react';
import {useState} from 'react';

import Menu, {MenuItemInterface, MenuPropsInterface} from './Menu';

export default {
  title: 'Organisms/Menu',
  component: Menu
} as ComponentMeta<typeof Menu>;

const IMAGE_SRC = 'https://picsum.photos/300';

const LEFT_ACTIONS: MenuItemInterface[] = [
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
];
const CENTRAL_ACTIONS: MenuItemInterface[] = [
  {
    id: 5,
    iconName: 'star_small'
  },
  {
    id: 6,
    iconName: 'edit'
  }
];
const RIGHT_ACTIONS: MenuItemInterface[] = [
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
];

const Template: Story<MenuPropsInterface> = (args) => {
  const [activeId, setActiveId] = useState(1);
  return <Menu {...args} activeMenuItemId={activeId} onMenuItemSelection={setActiveId} />;
};

export const General = Template.bind({});
General.args = {
  leftActions: LEFT_ACTIONS,
  centerActions: CENTRAL_ACTIONS,
  rightActions: RIGHT_ACTIONS
};

export const SingleCentralAction = Template.bind({});
SingleCentralAction.args = {
  leftActions: LEFT_ACTIONS,
  centerActions: [CENTRAL_ACTIONS[0]],
  rightActions: RIGHT_ACTIONS
};
