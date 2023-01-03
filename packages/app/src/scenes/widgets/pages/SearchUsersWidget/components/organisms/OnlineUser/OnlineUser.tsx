import React, {FC} from 'react';
import cn from 'classnames';
import {Avatar, SvgButton, Text} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';

import {UserModelInterface} from 'core/models';

import * as styled from './OnlineUser.styled';

interface PropsInterface {
  user: UserModelInterface;
  onUserClick: (id: string) => void;
  onTeleportUser: (id: string) => void;
  onHighFiveUser: (id: string) => void;
  isCurrentUser: boolean;
  isOwner: boolean;
}

const OnlineUser: FC<PropsInterface> = ({
  user,
  onUserClick,
  onTeleportUser,
  onHighFiveUser,
  isCurrentUser,
  isOwner
}) => {
  return (
    <styled.Container data-testid="OnlineUser-test">
      <styled.Info
        className={cn(isCurrentUser && 'noPointer')}
        onClick={() => onUserClick(user.id)}
      >
        <Avatar avatarSrc={user.avatarSrc} size="small" />
        <Text size="s" text={user.name} />
      </styled.Info>

      <styled.Toolbar>
        {isOwner && <styled.AdminText size="s" text={t('titles.owner')} />}
        <SvgButton
          iconName="high-five"
          size="normal"
          disabled={isCurrentUser}
          onClick={() => {
            onHighFiveUser(user.id);
          }}
        />
        <SvgButton
          iconName="fly-to"
          size="normal"
          disabled={isCurrentUser}
          onClick={() => onTeleportUser(user.id)}
        />
      </styled.Toolbar>
    </styled.Container>
  );
};

export default observer(OnlineUser);
