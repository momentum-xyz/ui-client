import React, {FC, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';

import {IconSvg, Text} from 'ui-kit';
import {StageModeUserInterface} from 'core/models';
import {InviteOnStageDialog} from 'scenes/collaboration/pages/StageModePage/components';

import * as styled from './StageModeUser.styled';

export interface PropsInterface {
  user: StageModeUserInterface;
  isModerator: boolean;
  canEnterStage: boolean;
  isInviteDialogShown: boolean;
  openInviteDialog: () => void;
  closeInviteDialog: () => void;
}

const StageModeUser: FC<PropsInterface> = ({
  user,
  isModerator,
  canEnterStage,
  isInviteDialogShown,
  openInviteDialog,
  closeInviteDialog
}) => {
  const [hovered, setIsHovered] = useState(false);

  useEffect(() => {
    user.fetchUser();
  }, [user]);

  return (
    <>
      <styled.UserListItem data-testid="StageModeUser-test">
        <styled.Inner
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {user.avatarSrc && <styled.Avatar src={user.avatarSrc} />}
          {!user.avatarSrc && (
            <styled.Placeholder>
              <IconSvg size="large" name="profile" />
            </styled.Placeholder>
          )}

          {isModerator && hovered && (
            <styled.InviteOnStage {...(canEnterStage && {onClick: openInviteDialog})}>
              {canEnterStage && <IconSvg name="add" size="medium-large" />}
              <Text
                text={!canEnterStage ? 'Invite' : 'Stage full'}
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

      {isInviteDialogShown && <InviteOnStageDialog user={user} onClose={closeInviteDialog} />}
    </>
  );
};

export default observer(StageModeUser);
