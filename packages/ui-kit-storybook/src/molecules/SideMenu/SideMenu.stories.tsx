import {ComponentMeta, Story} from '@storybook/react';

import SideMenu, {SideMenuPropsInterface} from './SideMenu';

export default {
  title: 'Molecules/SideMenu',
  component: SideMenu
} as ComponentMeta<typeof SideMenu>;

const Template: Story<SideMenuPropsInterface> = (args) => <SideMenu {...args} />;

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
