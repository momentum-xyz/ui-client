import {ComponentMeta, Story} from '@storybook/react';
import {useState} from 'react';

import SideMenu, {SideMenuPropsInterface} from './SideMenu';

export default {
  title: 'Organisms/SideMenu',
  component: SideMenu
} as ComponentMeta<typeof SideMenu>;

const Template: Story<SideMenuPropsInterface<string>> = (args) => {
  const [activeIdx, setActiveIdx] = useState('0');
  return <SideMenu {...args} activeId={activeIdx} onSelect={setActiveIdx} />;
};

export const General = Template.bind({});
General.args = {
  sideMenuItems: [
    {
      id: '0',
      iconName: 'clock',
      label: 'Newsfeed',
      pinNumber: 3
    },
    {
      id: '1',
      iconName: 'call_connect',
      label: 'Call'
    },
    {
      id: '2',
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
      id: '0',
      iconName: 'clock',
      label: 'Newsfeed',
      pinNumber: 3
    },
    {
      id: '1',
      iconName: 'call_connect',
      label: 'Call'
    },
    {
      id: '2',
      iconName: 'search',
      label: 'Search'
    }
  ]
};
