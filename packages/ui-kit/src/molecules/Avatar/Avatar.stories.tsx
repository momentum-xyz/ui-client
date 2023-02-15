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
      {Object.values(args)
        .filter((i) => !!i)
        .map((arg, index) => (
          <Avatar key={index} {...arg} />
        ))}
    </GridViewer>
  );
};

export const General = TemplateOne.bind({});
General.args = {
  size: 'large',
  avatarSrc: 'https://picsum.photos/300',
  showBorder: true,
  showHover: true,
  status: UserStatusEnum.ONLINE
};

export const ListOfSizes = TemplateList.bind({});
ListOfSizes.args = [
  {
    size: 'extra-large',
    avatarSrc: 'https://picsum.photos/300'
  },
  {
    size: 'large',
    avatarSrc: 'https://picsum.photos/300'
  },
  {
    size: 'normal',
    avatarSrc: 'https://picsum.photos/300'
  },
  {
    size: 'medium',
    avatarSrc: 'https://picsum.photos/300'
  },
  {
    size: 'small',
    avatarSrc: 'https://picsum.photos/300'
  },
  {
    size: 'extra-small',
    avatarSrc: 'https://picsum.photos/300'
  }
];

export const ListOfStates = TemplateList.bind({});
ListOfStates.args = [
  {
    size: 'large',
    avatarSrc: 'https://picsum.photos/300',
    showBorder: true
  },
  {
    size: 'large',
    avatarSrc: 'https://picsum.photos/300',
    showBorder: true,
    showHover: true
  },
  {
    size: 'large',
    avatarSrc: 'https://picsum.photos/300'
  },
  {
    size: 'large'
  }
];

export const ListOfStatuses = TemplateList.bind({});
ListOfStatuses.args = [
  {
    size: 'large',
    avatarSrc: 'https://picsum.photos/300',
    status: UserStatusEnum.ONLINE,
    showBorder: true
  },
  {
    size: 'large',
    avatarSrc: 'https://picsum.photos/300',
    status: UserStatusEnum.DO_NOT_DISTURB,
    showBorder: true
  },
  {
    size: 'large',
    avatarSrc: 'https://picsum.photos/300',
    showBorder: true
  }
];
