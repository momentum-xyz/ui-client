import {ComponentMeta, Story} from '@storybook/react';

import {UserStatusEnum} from '../../enums';

import Avatar, {AvatarPropsInterface} from './Avatar';

export default {
  title: 'Molecules/Avatar',
  component: Avatar
} as ComponentMeta<typeof Avatar>;

const Template: Story<AvatarPropsInterface> = (args) => <Avatar {...args} />;

export const General = Template.bind({});
General.args = {
  size: 'large',
  avatarSrc: 'https://picsum.photos/300'
};

export const IsOnline = Template.bind({});
IsOnline.args = {
  size: 'large',
  avatarSrc: 'https://picsum.photos/300',
  showBorder: true,
  showHover: true,
  status: UserStatusEnum.ONLINE
};

export const DoNotDisturb = Template.bind({});
DoNotDisturb.args = {
  size: 'large',
  avatarSrc: 'https://picsum.photos/300',
  showBorder: true,
  showHover: true,
  status: UserStatusEnum.DO_NOT_DISTURB
};

export const HasBorder = Template.bind({});
HasBorder.args = {
  size: 'large',
  avatarSrc: 'https://picsum.photos/300',
  showBorder: true
};

export const HasHover = Template.bind({});
HasHover.args = {
  size: 'large',
  avatarSrc: 'https://picsum.photos/300',
  showBorder: true,
  showHover: true
};

export const IsEmptyOrError = Template.bind({});
IsEmptyOrError.args = {
  size: 'large'
};

export const ListOfSizes = Template.bind({});
ListOfSizes.args = {
  avatarSrc: 'https://picsum.photos/300'
};
ListOfSizes.decorators = [
  () => {
    return (
      <div className="storybook-grid">
        <Avatar {...(ListOfSizes.args as AvatarPropsInterface)} size="extra-large" />
        <Avatar {...(ListOfSizes.args as AvatarPropsInterface)} size="large" />
        <Avatar {...(ListOfSizes.args as AvatarPropsInterface)} size="normal" />
        <Avatar {...(ListOfSizes.args as AvatarPropsInterface)} size="medium" />
        <Avatar {...(ListOfSizes.args as AvatarPropsInterface)} size="small" />
        <Avatar {...(ListOfSizes.args as AvatarPropsInterface)} size="extra-small" />
      </div>
    );
  }
];
