import {ComponentMeta, Story} from '@storybook/react';

import {UserStatusEnum} from '../../enums';
import {GridViewer} from '../../atoms';

import Avatar, {AvatarPropsInterface} from './Avatar';

export default {
  title: 'Molecules/Avatar',
  component: Avatar
} as ComponentMeta<typeof Avatar>;

const TemplateOne: Story<AvatarPropsInterface> = (args) => <Avatar {...args} />;

const TemplateList: Story<AvatarPropsInterface[]> = (args) => {
  return (
    <GridViewer>
      {Object.values(args).map((arg, index) => (
        <Avatar key={index} {...arg} />
      ))}
    </GridViewer>
  );
};

export const Primary = TemplateOne.bind({});
Primary.args = {
  size: 'large',
  avatarSrc: 'https://picsum.photos/100',
  showBorder: true,
  status: UserStatusEnum.ONLINE
};

export const Sizes = TemplateList.bind({});
Sizes.args = [
  {
    size: 'large',
    avatarSrc: 'https://picsum.photos/100'
  },
  {
    size: 'normal',
    avatarSrc: 'https://picsum.photos/100'
  },
  {
    size: 'medium',
    avatarSrc: 'https://picsum.photos/100'
  },
  {
    size: 'small',
    avatarSrc: 'https://picsum.photos/100'
  },
  {
    size: 'extra-small',
    avatarSrc: 'https://picsum.photos/100'
  }
];
