import {Meta, Story} from '@storybook/react';

import TextCut, {TextCutPropsInterface} from './TextCut';

export default {
  title: 'Atoms/TextCut',
  component: TextCut
} as Meta;

const Template: Story<TextCutPropsInterface> = (args) => <TextCut {...args} />;

const DUMMY_LONG_TEXT =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque commodo leo finibus purus porttitor, et semper turpis finibus. Maecenas pretium risus tortor, sed elementum quam iaculis vitae. Mauris rhoncus pretium mi, ut ultricies massa tincidunt in. Etiam porta justo ac risus convallis, ut pharetra lacus cursus. Proin a nunc ut ligula sodales fermentum. Donec placerat leo eu dui fermentum, et tempor nulla tincidunt. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Etiam sagittis cursus dolor vulputate suscipit. Praesent tempus ipsum et sem scelerisque ultrices. Cras a velit a dolor aliquet hendrerit. Nam lobortis nisi eget sapien ultricies euismod. In et eros at orci sodales gravida. Donec enim urna, suscipit eget facilisis quis, euismod ac metus.';

export const General = Template.bind({});
General.args = {
  text: DUMMY_LONG_TEXT
};
