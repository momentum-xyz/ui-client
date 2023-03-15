import {ComponentMeta, Story} from '@storybook/react';

import TextFrame, {TextFramePropsInterface} from './TextFrame';

const IMAGE_SRC = 'https://picsum.photos/300/200';
const TEXT_LINE = 'Lorem ipsum dolor sit amet, consectetuer adipicing elit. Aenean commodo ligula.';

export default {
  title: 'Molecules/TextFrame',
  component: TextFrame,
  decorators: [
    (Story) => (
      <div className="storybook-block">
        <Story />
      </div>
    )
  ]
} as ComponentMeta<typeof TextFrame>;

const Template: Story<TextFramePropsInterface> = (args) => {
  return <TextFrame {...args} title="Please wait" />;
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
