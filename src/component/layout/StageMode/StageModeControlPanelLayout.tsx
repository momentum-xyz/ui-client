import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {IAgoraRTCRemoteUser} from 'agora-rtc-sdk-ng';
import {toast} from 'react-toastify';
import {t} from 'i18next';

import {ToastContent} from 'ui-kit';

import StageModeToggle from '../../atoms/StageMode/StageModeToggle';
import Page from '../../molucules/Page';
import useCollaboration from '../../../context/Collaboration/hooks/useCollaboration';
import {useStageModePopupQueueContext} from '../../../context/StageMode/StageModePopupQueueContext';
import {
  useStageModeMute,
  useStageModeRequestAcceptOrDecline,
  useStageModeSendOffstage
} from '../../../hooks/api/useStageModeService';
import useWebsocketEvent from '../../../context/Websocket/hooks/useWebsocketEvent';
import {useAgoraStageMode} from '../../../hooks/communication/useAgoraStageMode';
import StageModeStage from '../../atoms/StageMode/StageModeStage';
import {useConfirmationDialog} from '../../../hooks/useConformationDialog';
import {bytesToUuid} from '../../../core/utils/uuid.utils';
import {useUser} from '../../../hooks/api/useUser';
import StageModeButton from '../../atoms/StageMode/StageModeButton';
import StageModeLabel from '../../atoms/StageMode/StageModeLabel';
import {
  useIntegrationDisable,
  useIntegrationEnable
} from '../../../context/Integration/hooks/useIntegration';
import {IntegrationTypes} from '../../../context/Integration/IntegrationTypes';
import {StageModeStatus} from '../../../context/type/StageMode';
import useContextAuth from '../../../context/Auth/hooks/useContextAuth';
import Button from '../../atoms/Button';

import StageModePopupQueueComponent from './StageModePopupQueueComponent';

const StageModeControlPanelLayout: React.FC = () => {
  const {collaborationState} = useCollaboration();
  const {authState} = useContextAuth();
  const {isOnStage, enterStage, leaveStage, canEnterStage} = useAgoraStageMode();
  const {addRequestPopup} = useStageModePopupQueueContext();
  const [enableStageMode] = useIntegrationEnable();
  const [disableStageMode] = useIntegrationDisable();
  const [sendOffstage, ,] = useStageModeSendOffstage(collaborationState.collaborationSpace?.id);
  const muteUserRequest = useStageModeMute(collaborationState.collaborationSpace?.id);
  const [acceptRequest, declineRequest] = useStageModeRequestAcceptOrDecline(
    collaborationState.collaborationSpace?.id
  );
  const [selectedRemoteUserIdForRemove, setSelectedRemoteUserIdForRemove] = useState<string | null>(
    null
  );

  const [user] = useUser(selectedRemoteUserIdForRemove as string);

  const {getConfirmation} = useConfirmationDialog();

  useWebsocketEvent('stage-mode-request', (userId) => {
    addRequestPopup(userId, {
      user: userId,
      onAccept: () => {
        return acceptRequest(userId)
          .then(() => true)
          .catch(() => {
            toast.error(
              <ToastContent
                isDanger
                headerIconName="alert"
                title={t('titles.alert')}
                text={t('messages.userRequestDeny')}
                isCloseButton
              />
            );
            return false;
          });
      },
      onDecline: () => {
        return declineRequest(userId).then(() => true);
      }
    });
  });

  const confirmRemoveUserFromStage = useCallback(() => {
    getConfirmation({
      blockInterface: true,
      title: 'Remove participant from stage',
      message: `Are you sure you want remove this ${user?.name as string} from stage`,
      confirmButton: 'Yes, remove from stage',
      cancelButton: 'No, cancel'
    }).then((result) => {
      if (result) {
        if (user?.id.data) {
          sendOffstage(bytesToUuid(user.id.data))
            .then(() => {
              setSelectedRemoteUserIdForRemove(null);
            })
            .catch(() => {
              setSelectedRemoteUserIdForRemove(null);
              toast.error(
                <ToastContent
                  isDanger
                  headerIconName="alert"
                  title={t('titles.alert')}
                  text={t('messages.offStageFailure', {
                    user: user.name
                  })}
                  isCloseButton
                />
              );
            });
        }
      } else {
        setSelectedRemoteUserIdForRemove(null);
      }
    });
  }, [getConfirmation, user]);

  const remoteUserClicked = (remoteUser: IAgoraRTCRemoteUser, event = 'remove') => {
    if (event === 'remove') {
      setSelectedRemoteUserIdForRemove(remoteUser.uid as string);
    } else if (event === 'mute') {
      muteUserRequest(remoteUser.uid as string).then();
    }
  };

  useEffect(() => {
    if (selectedRemoteUserIdForRemove && user) {
      //display remove from stage confirmation when use data is collected
      confirmRemoveUserFromStage();
    }
  }, [user, selectedRemoteUserIdForRemove]);

  // @ts-ignore
  const onStageModeToggle = (shouldActivate) => {
    console.info('spaceId: ' + collaborationState.collaborationSpace?.id);
    if (collaborationState.collaborationSpace) {
      if (shouldActivate && authState.user) {
        enableStageMode({
          spaceId: collaborationState.collaborationSpace.id,
          integrationType: IntegrationTypes.STAGE_MODE,
          data: {
            userId: bytesToUuid(authState.user.id.data),
            stageModeStatus: StageModeStatus.INITIATED
          }
        }).then();
      } else {
        disableStageMode({
          spaceId: collaborationState.collaborationSpace.id,
          integrationType: IntegrationTypes.STAGE_MODE,
          data: {
            stageModeStatus: StageModeStatus.STOPPED
          }
        }).then();
      }
    }
  };

  const handleEnterStage = () => {
    if (!canEnterStage()) {
      toast.error(`The stage is full`);
      return;
    }
    enterStage().then();
  };

  const handleLeaveStage = () => {
    console.info('[stagemode] LEAVE STAGE');
    leaveStage().then();
  };

  const stageModeOffMessage = () => (
    <div className="flex flex-grow z-0">
      <div className="flex-grow" />
      <p className="text-xl uppercase text-white-50 self-center text-center font-bold">
        Stage Mode has not Been Toggled <br />
        <br />
        You can toggle stage-mode, since you are a member of this space
      </p>
      <div className="flex-grow" />
    </div>
  );

  const usersOnStage = () => (
    <div className="flex flex-grow z-0">
      <div className="flex-grow" />
      <StageModeStage isOnStage={isOnStage} onRemoteUserClick={remoteUserClicked} />
      <div className="flex-grow" />
    </div>
  );

  const actions = useMemo(() => {
    return (
      <>
        {collaborationState.stageMode && (canEnterStage() || isOnStage) && (
          <Button
            type={isOnStage ? 'ghost-red' : 'ghost'}
            onClick={isOnStage ? handleLeaveStage : handleEnterStage}
          >
            {isOnStage ? 'Leave Stage?' : 'Go on Stage?'}
          </Button>
        )}
        {collaborationState.stageMode && !canEnterStage() && <span>Stage is full</span>}
      </>
    );
  }, [collaborationState, canEnterStage, isOnStage, handleLeaveStage, handleEnterStage]);

  return (
    <Page
      title={collaborationState.collaborationSpace?.name || ''}
      subtitle="Stage Mode&nbsp;&nbsp;/&nbsp;&nbsp;Control panel"
      collaboration
      actions={actions}
    >
      <div className="flex w-full">
        <div className="flex flex-col space-y-1">
          <StageModeToggle
            isActivated={collaborationState.stageMode}
            onToggle={onStageModeToggle}
          />
          {collaborationState.stageMode && (canEnterStage() || isOnStage) && (
            <StageModeButton
              type={isOnStage ? 'ghost-red' : 'ghost-green'}
              text={isOnStage ? 'Leave Stage?' : 'Go on Stage?'}
              onClick={isOnStage ? handleLeaveStage : handleEnterStage}
            />
          )}
          {collaborationState.stageMode && !canEnterStage() && (
            <StageModeLabel type="ghost-red" text="Stage is full" />
          )}
          <StageModePopupQueueComponent />
        </div>
        {collaborationState.stageMode ? usersOnStage() : stageModeOffMessage()}
      </div>
    </Page>
  );
};

export default StageModeControlPanelLayout;
