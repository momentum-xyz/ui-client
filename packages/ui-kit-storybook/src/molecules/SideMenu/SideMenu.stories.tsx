import {ComponentMeta, Story} from '@storybook/react';
import {useState} from 'react';

import SideMenu, {SideMenuPropsInterface} from './SideMenu';

export default {
  title: 'Molecules/SideMenu',
  component: SideMenu
} as ComponentMeta<typeof SideMenu>;

const Template: Story<SideMenuPropsInterface> = (args) => {
  const [activeIdx, setActiveIdx] = useState(0);
  return <SideMenu {...args} activeIdx={activeIdx} onMenuItemSelection={setActiveIdx} />;
};

export const General = Template.bind({});
General.args = {
  sideMenuItems: [
    {
      iconName: 'clock',
      label: 'Newsfeed',
      pinNumber: 3
    },
    {
      iconName: 'call_connect',
      label: 'Call'
    },
    {
      iconName: 'search',
      label: 'Search'
    }
  ]
};

export const LeftOrientation = Template.bind({});
LeftOrientation.args = {
  orientation: 'left',
  sideMenuItems: [
    {
      iconName: 'clock',
      label: 'Newsfeed',
      pinNumber: 3
    },
    {
      iconName: 'call_connect',
      label: 'Call'
    },
    {
      iconName: 'search',
      label: 'Search'
    }
  ]
};
