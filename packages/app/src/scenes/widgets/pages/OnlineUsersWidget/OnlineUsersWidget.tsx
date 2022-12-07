import React, {FC, useEffect} from 'react';
import {Text} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';

import {UserModelInterface} from 'core/models';
import {useStore} from 'shared/hooks';

import * as styled from './OnlineUsersWidget.styled';
import {OnlineUsersAvatars} from './components';

interface PropsInterface {
  currentUser: UserModelInterface | null;
  worldId: string;
  onClick: () => void;
}

const OnlineUsersWidget: FC<PropsInterface> = ({currentUser, worldId, onClick}) => {
  const {widgetsStore} = useStore();
  const {onlineUsersStore} = widgetsStore;

  useEffect(() => {
    if (!currentUser) {
      return;
    }
    const timeInterval = setInterval(() => {
      onlineUsersStore.fetchOdysseyUsers(worldId, currentUser?.id);
    }, 30000);

    return () => clearInterval(timeInterval);
  }, [onlineUsersStore, worldId]);

  return (
    <styled.Container data-testid="OnlineUsersWidget-test" onClick={onClick}>
      <styled.AvatarsWrapper>
        <OnlineUsersAvatars onlineUsers={onlineUsersStore.odysseyUsers} />
        <styled.MyProfileAvatar size="normal" avatarSrc={currentUser?.avatarSrc} />
      </styled.AvatarsWrapper>
      <Text size="m" text="Online" transform="uppercase" weight="bold" />
    </styled.Container>
  );
};

export default observer(OnlineUsersWidget);
