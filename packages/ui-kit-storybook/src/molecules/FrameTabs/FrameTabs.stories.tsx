import {useState} from 'react';
import {ComponentMeta, Story} from '@storybook/react';

import FrameTabs, {FrameTabsPropsInterface} from './FrameTabs';

export default {
  title: 'Molecules/FrameTabs',
  component: FrameTabs,
  decorators: [
    (Story) => (
      <div className="storybook-block">
        <Story />
      </div>
    )
  ]
} as ComponentMeta<typeof FrameTabs>;

const Template: Story<FrameTabsPropsInterface> = (args) => {
  const [selectedId, setSelectedId] = useState<string>();

  return (
    <FrameTabs {...args} selectedId={selectedId} onSelect={setSelectedId}>
      {selectedId && <>Tab id is {selectedId}</>}
    </FrameTabs>
  );
};

export const General = Template.bind({});
General.args = {
  tabList: [
    {id: '1', label: 'Latest', icon: 'planet'},
    {id: '2', label: 'Connections', icon: 'planet'}
  ]
};
