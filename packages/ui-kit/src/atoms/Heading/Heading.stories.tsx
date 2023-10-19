import {Meta, Story} from '@storybook/react';

import {Heading} from './Heading';

export default {
  title: 'Atoms/Heading',
  component: Heading
} as Meta;

const Template: Story = (args) => (
  <Heading variant="h1" {...args}>
    This is a heading
  </Heading>
);

const TemplateSizes: Story = (args) => (
  <div style={{display: 'flex', flexDirection: 'column', gap: '1em'}}>
    <Heading variant="h1">Heading h1 - font-size 18px</Heading>

    <Heading variant="h2">Heading h2 - font-size 16px</Heading>

    <Heading variant="h3">Heading h3 - font-size 15px</Heading>

    <Heading variant="h4">Heading h4 - font-size 13px</Heading>
  </div>
);

export const General = Template.bind({});
General.args = {};

export const DifferentSizes = TemplateSizes.bind({});
DifferentSizes.args = {};
