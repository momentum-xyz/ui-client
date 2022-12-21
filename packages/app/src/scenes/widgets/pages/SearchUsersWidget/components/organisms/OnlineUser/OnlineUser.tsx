import React, {FC} from 'react';
import cn from 'classnames';
import {Avatar, SvgButton, Text} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';

import {UserModelInterface} from 'core/models';

import * as styled from './OnlineUser.styled';

interface PropsInterface {
  user: UserModelInterface;
  worldId: string;
  currentUser: string;
  onUserClick: (id: string) => void;
  onTeleportUser: (id: string) => void;
  onHighFiveUser: (id: string) => void;
}

const OnlineUser: FC<PropsInterface> = ({
  user,
  worldId,
  currentUser,
  onUserClick,
  onTeleportUser,
  onHighFiveUser
}) => {
  return (
    <styled.Container data-testid="OnlineUser-test">
      <styled.Info
        className={cn(user.id === currentUser && 'noPointer')}
        onClick={() => onUserClick(user.id)}
      >
        <Avatar avatarSrc={user.avatarSrc} size="small" />
        <Text size="s" text={user.name} transform="capitalized" />
      </styled.Info>
      {!user.isGuest && (
        <styled.Toolbar>
          {user.id === worldId && <styled.AdminText size="s" text={t('titles.admin')} />}
          <SvgButton
            iconName="fly-to"
            size="normal"
            disabled={user?.id === worldId}
            onClick={() => onTeleportUser(user.id)}
          />
          <SvgButton
            iconName="high-five"
            size="normal"
            disabled={user?.id === currentUser}
            onClick={() => {
              onHighFiveUser(user.id);
            }}
          />
        </styled.Toolbar>
      )}
    </styled.Container>
  );
};

export default observer(OnlineUser);
