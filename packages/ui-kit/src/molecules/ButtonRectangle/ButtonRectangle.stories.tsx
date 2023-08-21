import {ComponentMeta, Story} from '@storybook/react';

import ButtonRectangle, {ButtonRectanglePropsInterface} from './ButtonRectangle';

const IMAGE_SRC = 'https://dev.odyssey.ninja/api/v3/render/get/df32929bf3b6c3a2013a8b51040d8c61';

export default {
  title: 'Molecules/ButtonRectangle',
  component: ButtonRectangle,
  decorators: [
    (Story) => (
      <div style={{width: `230px`}}>
        <Story />
      </div>
    )
  ]
} as ComponentMeta<typeof ButtonRectangle>;

const Template: Story<ButtonRectanglePropsInterface> = (args) => {
  return (
    <ButtonRectangle
      {...args}
      title="Image upload"
      label="Restrict users to upload their own image. No AI available"
    />
  );
};

export const PrimaryImage = Template.bind({});
PrimaryImage.args = {
  imageSrc: IMAGE_SRC
};

export const PrimaryImageActive = Template.bind({});
PrimaryImageActive.args = {
  imageSrc: IMAGE_SRC,
  active: true
};

export const PrimaryIcon = Template.bind({});
PrimaryIcon.args = {
  icon: 'picture_upload'
};

export const PrimaryIconActive = Template.bind({});
PrimaryIconActive.args = {
  icon: 'picture_upload',
  active: true
};
