import {ComponentMeta, Story} from '@storybook/react';

import FrameText, {FrameTextPropsInterface} from './FrameText';

const IMAGE_SRC = 'https://picsum.photos/300/200';
const TEXT_LINE = 'Lorem ipsum dolor sit amet, consectetuer adipicing elit. Aenean commodo ligula.';

export default {
  title: 'Molecules/FrameText',
  component: FrameText,
  decorators: [
    (Story) => (
      <div className="storybook-block">
        <Story />
      </div>
    )
  ]
} as ComponentMeta<typeof FrameText>;

const Template: Story<FrameTextPropsInterface> = (args) => {
  return <FrameText {...args} title="Title" />;
};

export const General = Template.bind({});
General.args = {
  line1: TEXT_LINE,
  line2: TEXT_LINE,
  imageSrc: IMAGE_SRC
};

export const OneLine = Template.bind({});
OneLine.args = {
  line1: TEXT_LINE,
  imageSrc: IMAGE_SRC
};

export const NoImage = Template.bind({});
NoImage.args = {
  line1: TEXT_LINE,
  line2: TEXT_LINE
};
