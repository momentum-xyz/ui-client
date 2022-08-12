import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

import {IconSvg, Text} from 'ui-kit';
import {StageModeUserInterface} from 'core/models';
import {ReactComponent as Astronaut} from 'ui-kit/assets/images/common/astronaut.svg';

import {InviteOnStageDialog} from './components';
import * as styled from './StageModeUser.styled';

export interface PropsInterface {
  user: StageModeUserInterface;
  isModerator: boolean;
  canEnterStage: boolean;
  isInviteDialogShown: boolean;
  inviteToStage: (userId: string) => Promise<boolean>;
  openInviteDialog: () => void;
  closeInviteDialog: () => void;
}

const StageModeUser: FC<PropsInterface> = ({
  user,
  isModerator,
  canEnterStage,
  isInviteDialogShown,
  inviteToStage,
  openInviteDialog,
  closeInviteDialog
}) => {
  const {t} = useTranslation();

  useEffect(() => {
    user.fetchUser();
  }, [user]);

  return (
    <>
      <styled.UserListItem data-testid="StageModeUser-test">
        <styled.Inner>
          {user.avatarSrc && <styled.Avatar src={user.avatarSrc} />}
          {!user.avatarSrc && (
            <styled.Placeholder>
              <Astronaut />
            </styled.Placeholder>
          )}

          {isModerator && (
            <styled.InviteOnStage
              {...(canEnterStage && {onClick: openInviteDialog})}
              className="invite"
            >
              {canEnterStage && <IconSvg name="add" size="medium-large" />}
              <Text
                text={canEnterStage ? t('actions.invite') : t('messages.stageFull')}
                transform="uppercase"
                size="xxs"
              />
            </styled.InviteOnStage>
          )}

          <styled.MicrophoneOff>
            <IconSvg size="small" name="microphoneOff" isWhite />
          </styled.MicrophoneOff>
        </styled.Inner>

        <styled.Username title={user.name}>
          <Text text={user.name} transform="uppercase" size="xxs" isMultiline={false} />
        </styled.Username>
      </styled.UserListItem>

      {isInviteDialogShown && (
        <InviteOnStageDialog
          user={user}
          inviteToStage={inviteToStage}
          onClose={closeInviteDialog}
        />
      )}
    </>
  );
};

export default observer(StageModeUser);
