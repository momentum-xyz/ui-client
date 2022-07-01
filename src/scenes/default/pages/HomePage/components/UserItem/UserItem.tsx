import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useHistory} from 'react-router';
import {t} from 'i18next';
import {observer} from 'mobx-react-lite';
import cn from 'classnames';

import {Button, SvgButton, Avatar} from 'ui-kit';
import {appVariables} from 'api/constants';
import {useStore, usePosBusEvent} from 'shared/hooks';
import {UserProfileModelInterface} from 'core/models';

import * as styled from './UserItem.styled';

export interface UserItemPropsInterface {
  onClick: React.MouseEventHandler<HTMLDivElement>;
  currentUserId: string;
  invite: boolean;
  user: UserProfileModelInterface;
}

const UserItem: React.FC<UserItemPropsInterface> = ({onClick, currentUserId, invite, user}) => {
  const {
    mainStore: {unityStore},
    collaborationStore: {spaceStore},
    sessionStore: {profile}
  } = useStore();
  const history = useHistory();
  const handleFlyToUser = () => {
    unityStore.teleportToUser(user.uuid, history.push as (path: string) => void);
  };

  const [inviteTimeout, setInviteTimeout] = useState<NodeJS.Timeout>();

  usePosBusEvent('stage-mode-user-joined', (userId: string) => {
    if (userId === user.uuid) {
      user.setInvited(false);
    }
  });

  useEffect(() => {
    if (user.invited) {
      if (inviteTimeout) {
        clearTimeout(inviteTimeout);
      }

      setInviteTimeout(setTimeout(() => user.setInvited(false), 30000));
    } else {
      if (inviteTimeout) {
        clearTimeout(inviteTimeout);
      }
      setInviteTimeout(undefined);
    }
  }, [user.invited]);

  const handleInvite = useCallback(() => {
    if (spaceStore.space.id) {
      user.invite(spaceStore.space.id);
    }
  }, [spaceStore.space.id]);

  const isItMe = useMemo(() => {
    return currentUserId === user.uuid;
  }, [currentUserId, user.uuid]);

  return (
    <styled.Container>
      <styled.InfoContainer onClick={onClick} className={cn(invite && 'invite')}>
        <Avatar
          avatarSrc={
            user.profile?.avatarHash &&
            `${appVariables.RENDER_SERVICE_URL}/get/${user.profile.avatarHash}`
          }
          size="small"
          status={isItMe ? profile?.status : user.status}
        />
        <styled.StyledText
          text={(isItMe ? profile?.name ?? '' : user.name).trim()}
          size="s"
          align="left"
          isMultiline={false}
        />
      </styled.InfoContainer>
      {!isItMe &&
        (invite ? (
          <styled.InviteButtonContainer>
            <Button
              label={user.invited ? t('actions.invited') : t('actions.invite')}
              onClick={user.invited ? undefined : handleInvite}
              variant={user.invited ? 'inverted' : 'primary'}
              size="small"
            />
          </styled.InviteButtonContainer>
        ) : (
          <SvgButton iconName="rocket" size="medium" onClick={handleFlyToUser} />
        ))}
    </styled.Container>
  );
};

export default observer(UserItem);
