import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useHistory} from 'react-router';
import cn from 'classnames';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';

import {Button, SvgButton, Avatar, TOAST_GROUND_OPTIONS, ToastContent} from 'ui-kit';
import {appVariables} from 'api/constants';
import {usePosBusEvent} from 'shared/hooks';
import {UserProfileModelInterface} from 'core/models';

import * as styled from './UserItem.styled';

export interface UserItemPropsInterface {
  onClick: React.MouseEventHandler<HTMLDivElement>;
  invite: boolean;
  user: UserProfileModelInterface;
  teleportToUser?: (userId: string, push: (path: string) => void) => void;
  spaceId: string;
  profile?: UserProfileModelInterface;
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
    teleportToUser?.(user.uuid, history.push as (path: string) => void);
  };

  const [inviteTimeout, setInviteTimeout] = useState<NodeJS.Timeout>();
  const [invited, setInvited] = useState(false);

  usePosBusEvent('stage-mode-user-joined', (userId: string) => {
    if (userId === user.uuid) {
      user.setInvited(false);
    }
  });

  useEffect(() => {
    if (invited) {
      if (inviteTimeout) {
        clearTimeout(inviteTimeout);
      }

      setInviteTimeout(
        setTimeout(() => {
          setInvited(false);
        }, 30000)
      );
    } else {
      if (inviteTimeout) {
        clearTimeout(inviteTimeout);
      }
      setInviteTimeout(undefined);
    }
  }, [invited]);

  const handleInvite = useCallback(async () => {
    const success = await user.invite(spaceId);
    if (success) {
      setInvited(true);
      toast.info(
        <ToastContent
          headerIconName="alert"
          title={t('titles.alert')}
          text={t('messages.inviteSuccess', {
            user: user.name
          })}
          isCloseButton
        />,
        TOAST_GROUND_OPTIONS
      );
    } else {
      toast.error(
        <ToastContent
          headerIconName="alert"
          title={t('titles.alert')}
          text={t('messages.inviteError', {
            user: user.name
          })}
          isDanger
          isCloseButton
        />,
        TOAST_GROUND_OPTIONS
      );
    }
  }, [spaceId, t, user]);

  const isItMe = useMemo(() => {
    return profile?.uuid === user.uuid;
  }, [profile?.uuid, user.uuid]);

  return (
    <styled.Container data-testid="UserItem-test">
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
              label={invited ? t('actions.invited') : t('actions.invite')}
              onClick={handleInvite}
              variant="primary"
              size="small"
              disabled={invited}
            />
          </styled.InviteButtonContainer>
        ) : (
          <SvgButton iconName="rocket" size="medium" onClick={handleFlyToUser} />
        ))}
    </styled.Container>
  );
};

export default observer(UserItem);
