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
  return <FrameTabs {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {
  stepList: [
    {label: '1', variant: 'prev'},
    {label: '2', variant: 'active'}
  ]
};
