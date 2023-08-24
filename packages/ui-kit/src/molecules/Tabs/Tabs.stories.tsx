import {useState} from 'react';
import {ComponentMeta, Story} from '@storybook/react';

import Tabs, {TabsPropsInterface} from './Tabs';

export default {
  title: 'Molecules/Tabs',
  component: Tabs,
  decorators: [
    (Story) => (
      <div
        className="storybook-block"
        style={{width: 400, padding: 10, position: 'relative', border: 'solid 1px blue'}}
      >
        <Story />
        <div style={{height: '500px', overflow: 'auto'}}>
          {new Array(100).fill('').map((_, idx) => (
            <span key={idx}>
              Some really long text
              <br />
            </span>
          ))}
        </div>
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

export const StickToTopRight = Template.bind({});
StickToTopRight.args = {
  tabList: [
    {id: '1', label: 'Latest', icon: 'planet'},
    {id: '2', label: 'Connections', icon: 'planet'}
  ],
  stickToTopRight: true
};
