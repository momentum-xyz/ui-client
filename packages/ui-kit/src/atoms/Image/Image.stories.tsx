import {ComponentMeta, Story} from '@storybook/react';

import Image, {ImagePropsInterface} from './Image';

export default {
  title: 'Atoms/Image',
  component: Image,
  decorators: [
    (Story) => (
      <div className="storybook-block">
        <Story />
      </div>
    )
  ]
} as ComponentMeta<typeof Image>;

const Template: Story<ImagePropsInterface> = (args) => {
  return <Image {...args} />;
};

export const General = Template.bind({});
General.args = {
  src: 'https://picsum.photos/300'
};

export const IsEmpty = Template.bind({});
IsEmpty.args = {
  src: null
};

export const IsError = Template.bind({});
IsError.args = {
  src: 'google.com'
};

export const IsDisabled = Template.bind({});
IsDisabled.args = {
  src: 'https://picsum.photos/300',
  isDisabled: true
};

export const IsDisabledWithError = Template.bind({});
IsDisabledWithError.args = {
  isDisabled: true
};
