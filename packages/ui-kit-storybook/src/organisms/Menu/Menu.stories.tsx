import {ComponentMeta, Story} from '@storybook/react';
import {useState} from 'react';

import {PositionEnum} from '../../enums';

import Menu, {MenuItemInterface, MenuPropsInterface} from './Menu';

export default {
  title: 'Organisms/Menu',
  component: Menu,
  parameters: {
    layout: 'fullscreen'
  },
  decorators: [
    (Story) => (
      <div className="storybook-bottom">
        <Story />
      </div>
    )
  ]
} as ComponentMeta<typeof Menu>;

const IMAGE_SRC = 'https://picsum.photos/300';

const LEFT_ITEMS: MenuItemInterface<string>[] = [
  {
    key: 'key_1',
    iconName: 'menu_info',
    position: PositionEnum.LEFT
  },
  {
    key: 'key_2',
    iconName: 'leave',
    position: PositionEnum.LEFT
  },
  {
    key: 'key_3',
    imageSrc: IMAGE_SRC,
    position: PositionEnum.LEFT
  },
  {
    key: 'key_4',
    iconName: 'smiley-face',
    position: PositionEnum.LEFT
  }
];

const CENTER_ITEMS: MenuItemInterface<string>[] = [
  {
    key: 'key_5',
    iconName: 'star_small',
    position: PositionEnum.CENTER
  },
  {
    key: 'key_6',
    iconName: 'edit',
    position: PositionEnum.CENTER
  }
];

const RIGHT_ITEMS: MenuItemInterface<string>[] = [
  {
    key: 'key_7',
    iconName: 'voice_chat',
    position: PositionEnum.RIGHT
  },
  {
    key: 'key_8',
    iconName: 'chat',
    position: PositionEnum.RIGHT
  },
  {
    key: 'key_9',
    iconName: 'search',
    position: PositionEnum.RIGHT
  },
  {
    key: 'key_10',
    iconName: 'meeting',
    position: PositionEnum.RIGHT
  },
  {
    key: 'key_11',
    iconName: 'calendar',
    position: PositionEnum.RIGHT
  },
  {
    key: 'key_12',
    iconName: 'clock',
    position: PositionEnum.RIGHT
  },
  {
    key: 'key_13',
    imageSrc: IMAGE_SRC,
    position: PositionEnum.RIGHT
  }
];

const SUB_MENU_ITEMS = LEFT_ITEMS.map((a) => ({...a, key: `sub_${a.key}`}));

const Template: Story<MenuPropsInterface<string>> = (args) => {
  const [activeKeys /*, setActiveKeys*/] = useState<string[]>(
    args.activeKeys || [CENTER_ITEMS[0].key]
  );

  /*const onChangeActiveKey = (key?: string) => {
    if (key && key.startsWith('sub_')) {
      return;
    }
    setActiveKey(key);
  };*/

  return <Menu {...args} activeKeys={activeKeys} />;
};

export const General = Template.bind({});
General.args = {
  items: [...LEFT_ITEMS, ...CENTER_ITEMS, ...RIGHT_ITEMS]
};

export const SingleCentralAction = Template.bind({});
SingleCentralAction.args = {
  items: [...LEFT_ITEMS, CENTER_ITEMS[0], ...RIGHT_ITEMS]
};

export const WithCentralSubMenu = Template.bind({});
WithCentralSubMenu.args = {
  items: [...LEFT_ITEMS, ...CENTER_ITEMS, ...RIGHT_ITEMS],
  subMenuItems: SUB_MENU_ITEMS,
  subMenuSource: CENTER_ITEMS[0].key,
  activeKeys: [CENTER_ITEMS[0].key]
};
export const WithCentralSubMenu2 = Template.bind({});
WithCentralSubMenu2.args = {
  items: [...LEFT_ITEMS, ...CENTER_ITEMS, ...RIGHT_ITEMS],
  subMenuItems: SUB_MENU_ITEMS,
  subMenuSource: CENTER_ITEMS[CENTER_ITEMS.length - 1].key,
  activeKeys: [CENTER_ITEMS[CENTER_ITEMS.length - 1].key]
};

export const WithLeftSubMenu = Template.bind({});
WithLeftSubMenu.args = {
  items: [...LEFT_ITEMS, ...CENTER_ITEMS, ...RIGHT_ITEMS],
  subMenuItems: SUB_MENU_ITEMS,
  subMenuSource: LEFT_ITEMS[LEFT_ITEMS.length - 1].key,
  activeKeys: [LEFT_ITEMS[LEFT_ITEMS.length - 1].key]
};
export const WithLeftSubMenu2 = Template.bind({});
WithLeftSubMenu2.args = {
  items: [...LEFT_ITEMS, ...CENTER_ITEMS, ...RIGHT_ITEMS],
  subMenuItems: SUB_MENU_ITEMS,
  subMenuSource: LEFT_ITEMS[0].key,
  activeKeys: [LEFT_ITEMS[0].key]
};

export const WithRightSubMenu1 = Template.bind({});
WithRightSubMenu1.args = {
  items: [...LEFT_ITEMS, ...CENTER_ITEMS, ...RIGHT_ITEMS],
  subMenuItems: SUB_MENU_ITEMS,
  subMenuSource: RIGHT_ITEMS[RIGHT_ITEMS.length - 1].key,
  activeKeys: [RIGHT_ITEMS[RIGHT_ITEMS.length - 1].key]
};

export const WithRightSubMenu2 = Template.bind({});
WithRightSubMenu2.args = {
  items: [...LEFT_ITEMS, ...CENTER_ITEMS, ...RIGHT_ITEMS],
  subMenuItems: SUB_MENU_ITEMS,
  subMenuSource: RIGHT_ITEMS[0].key,
  activeKeys: [RIGHT_ITEMS[0].key]
};

export const WithActiveSubMenuItem = Template.bind({});
WithActiveSubMenuItem.args = {
  items: [...LEFT_ITEMS, ...CENTER_ITEMS, ...RIGHT_ITEMS],
  subMenuItems: SUB_MENU_ITEMS,
  subMenuSource: CENTER_ITEMS[0].key,
  activeKeys: [CENTER_ITEMS[0].key, SUB_MENU_ITEMS[0].key]
};
