import React, {FC} from 'react';
import {Text} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';

import {UserModelInterface} from 'core/models';
import {useStore} from 'shared/hooks';

import * as styled from './OnlineUsersWidget.styled';
import {OnlineUsersAvatars} from './components';

interface PropsInterface {
  currentUser: UserModelInterface | null;
}

const OnlineUsersWidget: FC<PropsInterface> = ({currentUser}) => {
  const {widgetsStore} = useStore();
  const {onlineUsersStore} = widgetsStore;

  return (
    <styled.Container data-testid="OnlineUsersWidget-test">
      <styled.AvatarsWrapper>
        <OnlineUsersAvatars onlineUsers={onlineUsersStore.onlineUsers} />
        <styled.MyProfileAvatar size="normal" avatarSrc={currentUser?.avatarSrc} />
      </styled.AvatarsWrapper>
      <Text size="m" text="Online" transform="uppercase" weight="bold" />
    </styled.Container>
  );
};

export default observer(OnlineUsersWidget);
