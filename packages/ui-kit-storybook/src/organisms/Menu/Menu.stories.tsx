import {ComponentMeta, Story} from '@storybook/react';
import {useState} from 'react';

import Menu, {MenuItemInterface, MenuItemPositionEnum, MenuPropsInterface} from './Menu';

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
    position: MenuItemPositionEnum.LEFT
  },
  {
    key: 'key_2',
    iconName: 'leave',
    position: MenuItemPositionEnum.LEFT
  },
  {
    key: 'key_3',
    imageSrc: IMAGE_SRC,
    position: MenuItemPositionEnum.LEFT
  },
  {
    key: 'key_4',
    iconName: 'smiley-face',
    position: MenuItemPositionEnum.LEFT
  }
];

const CENTER_ITEMS: MenuItemInterface<string>[] = [
  {
    key: 'key_5',
    iconName: 'star_small',
    position: MenuItemPositionEnum.CENTER
  },
  {
    key: 'key_6',
    iconName: 'edit',
    position: MenuItemPositionEnum.CENTER
  }
];

const RIGHT_ITEMS: MenuItemInterface<string>[] = [
  {
    key: 'key_7',
    iconName: 'voice_chat',
    position: MenuItemPositionEnum.RIGHT
  },
  {
    key: 'key_8',
    iconName: 'chat',
    position: MenuItemPositionEnum.RIGHT
  },
  {
    key: 'key_9',
    iconName: 'search',
    position: MenuItemPositionEnum.RIGHT
  },
  {
    key: 'key_10',
    iconName: 'meeting',
    position: MenuItemPositionEnum.RIGHT
  },
  {
    key: 'key_11',
    iconName: 'calendar',
    position: MenuItemPositionEnum.RIGHT
  },
  {
    key: 'key_12',
    iconName: 'clock',
    position: MenuItemPositionEnum.RIGHT
  },
  {
    key: 'key_13',
    imageSrc: IMAGE_SRC,
    position: MenuItemPositionEnum.RIGHT
  }
];

const Template: Story<MenuPropsInterface<string>> = (args) => {
  const [activeKey /*, setActiveKey*/] = useState<string>(CENTER_ITEMS[0].key);

  /*const onChangeActiveKey = (key?: string) => {
    if (key && key.startsWith('sub_')) {
      return;
    }
    setActiveKey(key);
  };*/

  return <Menu {...args} activeKey={activeKey} />;
};

export const General = Template.bind({});
General.args = {
  items: [...LEFT_ITEMS, ...CENTER_ITEMS, ...RIGHT_ITEMS]
};

export const SingleCentralAction = Template.bind({});
SingleCentralAction.args = {
  items: [...LEFT_ITEMS, CENTER_ITEMS[0], ...RIGHT_ITEMS]
};

export const WithSubMenu = Template.bind({});
WithSubMenu.args = {
  items: [
    ...LEFT_ITEMS,
    ...[
      CENTER_ITEMS[0],
      {
        ...CENTER_ITEMS[1],
        subMenuItems: LEFT_ITEMS.map((a) => ({...a, key: `sub_${a.key}`}))
      }
    ],
    ...RIGHT_ITEMS
  ]
};
