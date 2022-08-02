import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useHistory} from 'react-router';
import cn from 'classnames';
import {useTranslation} from 'react-i18next';

import {Button, SvgButton, Avatar} from 'ui-kit/index';
import {appVariables} from 'api/constants';
import {usePosBusEvent} from 'shared/hooks';
import {UserProfileModelInterface} from 'core/models';

import * as styled from './UserItem.styled';

export interface UserItemPropsInterface {
  onClick: React.MouseEventHandler<HTMLDivElement>;
  invite: boolean;
  user: UserProfileModelInterface;
  teleportToUser: (userId: string, push: (path: string) => void) => void;
  spaceId: string;
  profile: UserProfileModelInterface;
}

const UserItem: React.FC<UserItemPropsInterface> = ({
  onClick,
  invite,
  user,
  teleportToUser,
  spaceId,
  profile
}) => {
  const {t} = useTranslation();

  const history = useHistory();
  const handleFlyToUser = () => {
    teleportToUser(user.uuid, history.push as (path: string) => void);
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
    user.invite(spaceId);
  }, [spaceId]);

  const isItMe = useMemo(() => {
    return profile.uuid === user.uuid;
  }, [profile.uuid, user.uuid]);

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

export default UserItem;
