import {Meta, Story} from '@storybook/react';

import FileUploader, {FileUploaderPropsInterface} from './FileUploader';

export default {
  title: 'Molecules/FileUploader',
  component: FileUploader,
  decorators: [
    (Story) => (
      <div style={{width: `200px`, height: `200px`}}>
        <Story />
      </div>
    )
  ]
} as Meta;

const Template: Story<FileUploaderPropsInterface> = (args) => <FileUploader {...args} />;

export const General = Template.bind({});
General.args = {
  fileType: 'image',
  label: 'Choose image',
  dragActiveLabel: 'Some content should be there.',
  enableDragAndDrop: true,
  maxSize: 50_100_000,
  onFilesUpload: (file) => {
    console.log(file);
  }
};

export const WithFrame = Template.bind({});
WithFrame.args = {
  fileType: 'image',
  label: 'Choose image',
  dragActiveLabel: 'Some content should be there.',
  withFrame: true,
  enableDragAndDrop: true,
  maxSize: 50_100_000,
  onFilesUpload: (file) => {
    console.log(file);
  }
};
