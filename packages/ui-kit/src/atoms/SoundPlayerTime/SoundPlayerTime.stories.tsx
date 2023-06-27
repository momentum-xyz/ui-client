import {ComponentMeta, Story} from '@storybook/react';

import SoundPlayerTime, {SoundPlayerTimePropsInterface} from './SoundPlayerTime';

export default {
  title: 'Atoms/SoundPlayerTime',
  component: SoundPlayerTime,
  decorators: [
    (Story) => (
      <div style={{width: `330px`, height: `160px`}}>
        <Story />
      </div>
    )
  ]
} as ComponentMeta<typeof SoundPlayerTime>;

const Template: Story<SoundPlayerTimePropsInterface> = (args) => {
  return <SoundPlayerTime {...args} />;
};

export const General = Template.bind({});
General.args = {
  playedSeconds: 12,
  duration: 78,
  children: <div />
};
