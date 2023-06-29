import {Meta, Story} from '@storybook/react';

import IconSvg, {IconSvgPropsInterface} from './IconSvg';

export default {
  title: 'Atoms/IconSvg',
  component: IconSvg
} as Meta;

const Template: Story<IconSvgPropsInterface> = (args) => <IconSvg {...args} />;

export const General = Template.bind({});
General.args = {
  size: 'xl',
  name: 'fly-portal'
};

export const IsWhite = Template.bind({});
IsWhite.args = {
  size: 'xl',
  name: 'fly-portal',
  isWhite: true
};

export const IsDanger = Template.bind({});
IsDanger.args = {
  size: 'xl',
  name: 'fly-portal',
  isDanger: true
};

export const IsDisabled = Template.bind({});
IsDisabled.args = {
  size: 'xl',
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
        <IconSvg {...(ListOfSizes.args as IconSvgPropsInterface)} size="xxl" />
        <IconSvg {...(ListOfSizes.args as IconSvgPropsInterface)} size="xll" />
        <IconSvg {...(ListOfSizes.args as IconSvgPropsInterface)} size="xl2" />
        <IconSvg {...(ListOfSizes.args as IconSvgPropsInterface)} size="xl" />
        <IconSvg {...(ListOfSizes.args as IconSvgPropsInterface)} size="l" />
        <IconSvg {...(ListOfSizes.args as IconSvgPropsInterface)} size="m" />
        <IconSvg {...(ListOfSizes.args as IconSvgPropsInterface)} size="s" />
        <IconSvg {...(ListOfSizes.args as IconSvgPropsInterface)} size="xs" />
        <IconSvg {...(ListOfSizes.args as IconSvgPropsInterface)} size="xxs" />
      </div>
    );
  }
];
