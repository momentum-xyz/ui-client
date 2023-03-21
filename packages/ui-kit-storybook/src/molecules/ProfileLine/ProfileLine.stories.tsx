import {ComponentMeta, Story} from '@storybook/react';

import ProfileLine, {ProfileLinePropsInterface} from './ProfileLine';

export default {
  title: 'Molecules/ProfileLine',
  component: ProfileLine
} as ComponentMeta<typeof ProfileLine>;

const Template: Story<ProfileLinePropsInterface> = (args) => {
  return <ProfileLine {...args} />;
};

export const General = Template.bind({});
General.args = {
  icon: 'astro',
  label: 'Joined january 2023'
};
