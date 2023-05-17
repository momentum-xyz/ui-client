import {ComponentMeta, Story} from '@storybook/react';

import AvatarUpload, {AvatarUploadPropsInterface} from './AvatarUpload';

export default {
  title: 'Organisms/AvatarUpload',
  component: AvatarUpload,
  decorators: [
    (Story) => (
      <div className="storybook-block">
        <Story />
      </div>
    )
  ]
} as ComponentMeta<typeof AvatarUpload>;

const Template: Story<AvatarUploadPropsInterface> = () => {
  let value = undefined;
  const onChange = (...events: any[]) => {
    console.log(events);
    value = events[0];
  };
  return <AvatarUpload value={value} onChange={onChange} />;
};

export const General = Template.bind({});
