import {ComponentMeta, Story} from '@storybook/react';

import * as TabsStories from '../Tabs/Tabs.stories';
import * as FrameTextStories from '../FrameText/FrameText.stories';
import * as FrameStepsStories from '../FrameSteps/FrameSteps.stories';

import Panel, {PanelPropsInterface} from './Panel';

const IMAGE_SRC = 'https://picsum.photos/300';

export default {
  title: 'Molecules/Panel',
  component: Panel,
  argTypes: {
    hexagon: {
      table: {
        disable: true
      }
    }
  },
  decorators: [
    (Story) => (
      <div className="storybook-block">
        <Story />
      </div>
    )
  ]
} as ComponentMeta<typeof Panel>;

const Template: Story<PanelPropsInterface> = (args) => {
  return <Panel {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {
  title: 'Long title of sidebar',
  variant: 'primary',
  icon: 'planet'
};

export const PrimaryTextFrame = Template.bind({});
PrimaryTextFrame.args = {
  ...Primary.args,
  children: <FrameTextStories.General {...FrameTextStories.General.args} />
};

export const PrimaryTabsFrame = Template.bind({});
PrimaryTabsFrame.args = {
  ...Primary.args,
  children: <TabsStories.General tabList={[]} {...TabsStories.General.args} />
};

export const PrimaryStepsFrame = Template.bind({});
PrimaryStepsFrame.args = {
  ...Primary.args,
  children: <FrameStepsStories.General stepList={[]} {...FrameStepsStories.General.args} />
};

export const Secondary = Template.bind({});
Secondary.args = {
  title: 'Long odyssey name',
  label: 'Connected',
  variant: 'secondary',
  image: IMAGE_SRC
};
