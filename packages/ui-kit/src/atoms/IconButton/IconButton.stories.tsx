import {Meta, Story} from '@storybook/react';

import IconButton, {IconButtonPropsInterface} from './IconButton';

export default {
  title: 'Atoms/IconButton',
  component: IconButton
} as Meta;

const Template: Story<IconButtonPropsInterface> = (args) => <IconButton {...args} />;

export const General = Template.bind({});
General.args = {
  size: 'xl',
  name: 'high-five'
};

export const IsDisabled = Template.bind({});
IsDisabled.args = {
  size: 'xl',
  name: 'high-five',
  isDisabled: true
};

export const ListOfSizes = Template.bind({});
ListOfSizes.args = {
  name: 'high-five'
};
ListOfSizes.decorators = [
  () => {
    return (
      <div className="storybook-grid">
        <IconButton {...(ListOfSizes.args as IconButtonPropsInterface)} size="xl" />
        <IconButton {...(ListOfSizes.args as IconButtonPropsInterface)} size="l" />
        <IconButton {...(ListOfSizes.args as IconButtonPropsInterface)} size="m" />
        <IconButton {...(ListOfSizes.args as IconButtonPropsInterface)} size="s" />
        <IconButton {...(ListOfSizes.args as IconButtonPropsInterface)} size="xs" />
        <IconButton {...(ListOfSizes.args as IconButtonPropsInterface)} size="xxs" />
      </div>
    );
  }
];
