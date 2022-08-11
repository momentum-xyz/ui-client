import React, {FC, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';

import {IconSvg, Text} from 'ui-kit';
import {StageModeUserInterface} from 'core/models';
import {ReactComponent as AddIcon} from 'images/icons/add.svg';
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
            <div
              className="flex flex-col bg-dark-blue-50 rounded-full absolute h-full w-full items-center justify-center space-y-.5"
              onClick={
                canEnterStage
                  ? () => {
                      if (isModerator) {
                        console.log('I am a moderator');
                        openInviteDialog();
                      }
                    }
                  : undefined
              }
            >
              {canEnterStage && <AddIcon title="" className="h-2 w-2" />}
              <p
                className={`w-min text-center capitalize ${!canEnterStage ? 'text-white-100' : ''}`}
              >
                {canEnterStage ? 'Invite' : 'Stage full'}
              </p>
            </div>
          )}
        </styled.Inner>

        <styled.MicrophoneOff>
          <IconSvg size="small" name="microphoneOff" isWhite />
        </styled.MicrophoneOff>

        <styled.Username title={user.name}>
          <Text text={user.name} transform="uppercase" size="xxs" isMultiline={false} />
        </styled.Username>
      </styled.UserListItem>

      {isInviteDialogShown && <InviteOnStageDialog user={user} onClose={closeInviteDialog} />}
    </>
  );
};

export default observer(StageModeUser);
