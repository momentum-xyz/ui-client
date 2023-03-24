import {ComponentMeta, Story} from '@storybook/react';
import {useState} from 'react';

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

const CENTER_ITEMS: MenuItemInterface<string>[] = [
  {
    key: 'key_5',
    iconName: 'star_small'
  },
  {
    key: 'key_6',
    iconName: 'edit'
  }
];

const RIGHT_ITEMS: MenuItemInterface<string>[] = [
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

const Template: Story<MenuPropsInterface<string>> = (args) => {
  const [activeKey, setActiveKey] = useState<string>();

  const onChangeActiveKey = (key?: string) => {
    if (key && key.startsWith('sub_')) {
      return;
    }
    setActiveKey(key);
  };

  return <Menu {...args} activeKey={activeKey} onChangeActiveKey={onChangeActiveKey} />;
};

export const General = Template.bind({});
General.args = {
  leftItems: LEFT_ITEMS,
  centerItems: CENTER_ITEMS,
  rightItems: RIGHT_ITEMS
};

export const SingleCentralAction = Template.bind({});
SingleCentralAction.args = {
  leftItems: LEFT_ITEMS,
  centerItems: [CENTER_ITEMS[0]],
  rightItems: RIGHT_ITEMS
};

export const WithSubMenu = Template.bind({});
WithSubMenu.args = {
  leftItems: LEFT_ITEMS,
  rightItems: RIGHT_ITEMS,
  centerItems: [
    CENTER_ITEMS[0],
    {
      ...CENTER_ITEMS[1],
      subMenuItems: LEFT_ITEMS.map((a) => ({...a, key: `sub_${a.key}`}))
    }
  ]
};
