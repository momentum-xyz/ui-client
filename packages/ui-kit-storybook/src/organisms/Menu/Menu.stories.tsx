import {ComponentMeta, Story} from '@storybook/react';
import {useState} from 'react';

import Menu, {MenuItemInterface, MenuPropsInterface} from './Menu';

export default {
  title: 'Organisms/Menu',
  component: Menu,
  parameters: {
    layout: 'fullscreen'
  }
} as ComponentMeta<typeof Menu>;

const IMAGE_SRC = 'https://picsum.photos/300';

const LEFT_ACTIONS: MenuItemInterface[] = [
  {
    key: 'key_1',
    iconName: 'menu_info'
  },
  {
    key: 'key_2',
    iconName: 'leave'
  },
  {
    key: 'key_3',
    imageSrc: IMAGE_SRC
  },
  {
    key: 'key_4',
    iconName: 'smiley-face'
  }
];
const CENTRAL_ACTIONS: MenuItemInterface[] = [
  {
    key: 'key_5',
    iconName: 'star_small'
  },
  {
    key: 'key_6',
    iconName: 'edit'
  }
];
const RIGHT_ACTIONS: MenuItemInterface[] = [
  {
    key: 'key_7',
    iconName: 'voice_chat'
  },
  {
    key: 'key_8',
    iconName: 'chat'
  },
  {
    key: 'key_9',
    iconName: 'search'
  },
  {
    key: 'key_10',
    iconName: 'meeting'
  },
  {
    key: 'key_11',
    iconName: 'calendar'
  },
  {
    key: 'key_12',
    iconName: 'clock'
  },
  {
    key: 'key_13',
    imageSrc: IMAGE_SRC
  }
];

const Template: Story<MenuPropsInterface> = (args) => {
  const [activeKey, setActiveKey] = useState(CENTRAL_ACTIONS[0].key);
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column-reverse',
        paddingBottom: '10px'
      }}
    >
      <Menu {...args} activeMenuItemKey={activeKey} onMenuItemSelection={setActiveKey} />
    </div>
  );
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

export const WithSubMenu = Template.bind({});
WithSubMenu.args = {
  leftActions: LEFT_ACTIONS,
  centerActions: [
    CENTRAL_ACTIONS[0],
    {
      ...CENTRAL_ACTIONS[1],
      subMenuItems: LEFT_ACTIONS.map((a) => ({...a, key: `sub_${a.key}`}))
    }
  ],
  rightActions: RIGHT_ACTIONS
};
