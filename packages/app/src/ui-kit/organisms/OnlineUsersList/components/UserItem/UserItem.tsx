import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import cn from 'classnames';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';
import {Button, SvgButton, Avatar} from '@momentum-xyz/ui-kit';

import {TOAST_GROUND_OPTIONS, ToastContent} from 'ui-kit';
import {usePosBusEvent} from 'shared/hooks';
import {UserProfileModelInterface} from 'core/models';

import * as styled from './UserItem.styled';

export interface UserItemPropsInterface {
  onClick: React.MouseEventHandler<HTMLDivElement>;
  invite: boolean;
  user: UserProfileModelInterface;
  teleportToUser?: (userId: string) => void;
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

  const handleFlyToUser = () => {
    teleportToUser?.(user.uuid);
  };

  const inviteTimeoutRef = useRef<NodeJS.Timeout>();
  const [invited, setInvited] = useState(false);

  usePosBusEvent('stage-mode-user-joined', (userId: string) => {
    console.info('[POSBUS EVENT] stage-mode-user-joined', userId);
    if (userId === user.uuid) {
      user.setInvited(false);
    }
  });

  useEffect(() => {
    return () => {
      if (inviteTimeoutRef.current) {
        clearTimeout(inviteTimeoutRef.current);
      }
    };
  }, [inviteTimeoutRef]);

  const handleInvite = useCallback(async () => {
    const success = await user.invite(spaceId);
    if (success) {
      setInvited(true);
      inviteTimeoutRef.current = setTimeout(() => {
        setInvited(false);
        inviteTimeoutRef.current = undefined;
      }, 30000);

      toast.info(
        <ToastContent
          headerIconName="alert"
          title={t('titles.alert')}
          text={t('messages.inviteSuccess', {
            user: user.name
          })}
          showCloseButton
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
          showCloseButton
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
          size="small"
          avatarSrc={user.avatarSrc}
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
