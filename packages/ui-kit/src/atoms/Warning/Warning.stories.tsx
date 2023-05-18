import {ComponentMeta, Story} from '@storybook/react';

import Warning, {WarningPropsInterface} from './Warning';

export default {
  title: 'Atoms/Warning',
  component: Warning
} as ComponentMeta<typeof Warning>;

const Template: Story<WarningPropsInterface> = (args) => {
  return (
    <Warning
      {...args}
      message="Watch it! You did something completely wrong. You better correct yourselves now otherwise you get fired!"
    />
  );
};

export const General = Template.bind({});
General.args = {
  wide: false
};

export const Wide = Template.bind({});
Wide.args = {
  wide: true
};
