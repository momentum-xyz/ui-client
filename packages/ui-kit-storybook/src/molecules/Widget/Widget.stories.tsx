import {ComponentMeta, Story} from '@storybook/react';

import {Hexagon} from '../../atoms';
import * as FrameTextStories from '../FrameText/FrameText.stories';
import * as FrameTabsStories from '../FrameTabs/FrameTabs.stories';
import * as FrameStepsStories from '../FrameSteps/FrameSteps.stories';

import Widget, {WidgetPropsInterface} from './Widget';

const IMAGE_SRC = 'https://picsum.photos/300';

export default {
  title: 'Molecules/Widget',
  component: Widget,
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
} as ComponentMeta<typeof Widget>;

const Template: Story<WidgetPropsInterface> = (args) => {
  return <Widget {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {
  title: 'Long title of sidebar',
  variant: 'primary',
  hexagon: <Hexagon type="secondary-borderless" iconName="planet" />
};

export const PrimaryTextFrame = Template.bind({});
PrimaryTextFrame.args = {
  ...Primary.args,
  children: <FrameTextStories.General {...FrameTextStories.General.args} />
};

export const PrimaryTabsFrame = Template.bind({});
PrimaryTabsFrame.args = {
  ...Primary.args,
  children: <FrameTabsStories.General tabList={[]} {...FrameTabsStories.General.args} />
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
  hexagon: <Hexagon type="fourth-borderless" imageSrc={IMAGE_SRC} />
};
