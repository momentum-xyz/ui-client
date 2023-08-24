import {Meta, Story} from '@storybook/react';

import {CollapsibleSection, CollapsibleSectionPropsInterface} from './CollapsibleSection';

export default {
  title: 'Molecules/CollapsibleSection',
  component: CollapsibleSection
} as Meta;

const Template: Story<CollapsibleSectionPropsInterface> = (args) => (
  <div style={{width: 300}}>
    <CollapsibleSection {...args}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl eget
    </CollapsibleSection>
  </div>
);

export const General = Template.bind({});
General.args = {
  title: 'Wrap image around object'
};

export const Expanded = Template.bind({});
Expanded.args = {
  title: 'Wrap image around object',
  initialCollapsed: false
};

export const Disabled = Template.bind({});
Disabled.args = {
  title: 'Wrap image around object',
  disabled: true
};
