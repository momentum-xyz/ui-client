import {Meta, Story} from '@storybook/react';

import Round, {RoundPropsInterface} from './Round';

export default {
  title: 'Atoms/Round',
  component: Round
} as Meta;

const Template: Story<RoundPropsInterface> = (args) => <Round {...args} />;

export const General = Template.bind({});
General.args = {
  label: '1'
};
