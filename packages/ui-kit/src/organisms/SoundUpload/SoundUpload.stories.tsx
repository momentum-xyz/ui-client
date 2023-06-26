import {useState} from 'react';
import {ComponentMeta, Story} from '@storybook/react';

import SoundUpload, {SoundUploadPropsInterface} from './SoundUpload';

export default {
  title: 'Organisms/SoundUpload',
  component: SoundUpload,
  decorators: [
    (Story) => (
      <div className="storybook-block">
        <Story />
      </div>
    )
  ]
} as ComponentMeta<typeof SoundUpload>;

const Template: Story<SoundUploadPropsInterface> = () => {
  const [file, setFile] = useState<File>();
  return <SoundUpload value={file} onChange={setFile} />;
};

export const General = Template.bind({});
