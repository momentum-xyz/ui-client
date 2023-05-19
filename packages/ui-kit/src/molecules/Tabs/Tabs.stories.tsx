import {useState} from 'react';
import {ComponentMeta, Story} from '@storybook/react';

import Tabs, {TabsPropsInterface} from './Tabs';

export default {
  title: 'Molecules/Tabs',
  component: Tabs,
  decorators: [
    (Story) => (
      <div className="storybook-block">
        <Story />
      </div>
    )
  ]
} as ComponentMeta<typeof Tabs>;

const Template: Story<TabsPropsInterface<string>> = (args) => {
  const [selectedId, setSelectedId] = useState<string>();
  return <Tabs {...args} activeId={selectedId} onSelect={setSelectedId} />;
};

export const General = Template.bind({});
General.args = {
  tabList: [
    {id: '1', label: 'Latest', icon: 'planet'},
    {id: '2', label: 'Connections', icon: 'planet'}
  ]
};
