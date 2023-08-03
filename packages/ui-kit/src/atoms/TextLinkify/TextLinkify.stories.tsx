import {Meta, Story} from '@storybook/react';

import TextLinkify, {TextLinkifyPropsInterface} from './TextLinkify';

export default {
  title: 'Atoms/TextLinkify',
  component: TextLinkify
} as Meta;

const Template: Story<TextLinkifyPropsInterface> = (args) => <TextLinkify {...args} />;

export const General = Template.bind({});
General.args = {
  text: 'Lorem ipsum dolor www.google.com sit amet,in a nunc ut ligula sodales fermentum. Donec placerat leo eu dui fermentum, et tempor nulla tincidunt.'
};
