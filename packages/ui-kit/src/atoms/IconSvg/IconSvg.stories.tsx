import {Meta, Story} from '@storybook/react';

import IconSvg, {IconSvgPropsInterface} from './IconSvg';

export default {
  title: 'Atoms/IconSvg',
  component: IconSvg
} as Meta;

const Template: Story<IconSvgPropsInterface> = (args) => <IconSvg {...args} />;

export const General = Template.bind({});
General.args = {
  size: 'large',
  name: 'fly-portal'
};

export const IsWhite = Template.bind({});
IsWhite.args = {
  size: 'large',
  name: 'fly-portal',
  isWhite: true
};

export const IsDanger = Template.bind({});
IsDanger.args = {
  size: 'large',
  name: 'fly-portal',
  isDanger: true
};

export const IsDisabled = Template.bind({});
IsDisabled.args = {
  size: 'large',
  name: 'fly-portal',
  isDisabled: true
};

export const ListOfSizes = Template.bind({});
ListOfSizes.args = {
  name: 'fly-portal'
};
ListOfSizes.decorators = [
  () => {
    return (
      <div className="storybook-grid">
        <IconSvg {...(ListOfSizes.args as IconSvgPropsInterface)} size="large" />
        <IconSvg {...(ListOfSizes.args as IconSvgPropsInterface)} size="normal" />
        <IconSvg {...(ListOfSizes.args as IconSvgPropsInterface)} size="small" />
      </div>
    );
  }
];
