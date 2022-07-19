import React, {useEffect, useMemo, useState} from 'react';
import {toast} from 'react-toastify';
import {t} from 'i18next';

import {ToastContent} from 'ui-kit';
import {usePosBusEvent} from 'shared/hooks';

import Page from '../../molucules/Page';
import useCollaboration from '../../../context/Collaboration/hooks/useCollaboration';
import {useAgoraStageMode} from '../../../hooks/communication/useAgoraStageMode';
import StageModeStage from '../../atoms/StageMode/StageModeStage';
import {useJoinRequest} from '../../../hooks/api/useStageModeService';
import {useStageModePopupQueueContext} from '../../../context/StageMode/StageModePopupQueueContext';
import Button from '../../atoms/Button';
import {ParticipantRole} from '../../../context/Collaboration/CollaborationTypes';
import CONFIG from '../../../config/config';

import StageModePopupQueueComponent from './StageModePopupQueueComponent';

const StageModeGuestLayout: React.FC = () => {
  const [stageStats, setStageStats] = useState<{speakers: number; audience: number}>({
    speakers: 0,
    audience: 0
  });
  const {collaborationState, currentUserId} = useCollaboration();
  // const [currentSpace, , ,] = useOnlineUserSpaceCheck(currentUserId);
  const {canEnterStage, leaveStage, isOnStage, stageModeUsers} = useAgoraStageMode();
  const joinRequest = useJoinRequest(collaborationState.collaborationSpace?.id);
  const [requestMade, setRequestMade] = useState<boolean>();
  const {addAwaitingPermissionPopup, removeAwaitingPermissionPopup} =
    useStageModePopupQueueContext();

  usePosBusEvent('stage-mode-accepted', (userId) => {
    if (userId === currentUserId) {
      removeAwaitingPermissionPopup();
      setRequestMade(false);
    }
  });

  usePosBusEvent('stage-mode-declined', (userId) => {
    if (userId === currentUserId) {
      removeAwaitingPermissionPopup();
      setRequestMade(false);
    }
  });

  const usersOnStage = () => (
    <div className="flex flex-grow z-0">
      <div className="flex-grow" />
      <StageModeStage isOnStage={isOnStage} />
      <div className="flex-grow" />
    </div>
  );

  const stageModeOffMessage = () => (
    <div className="flex flex-grow z-0">
      <div className="flex-grow" />
      <p className="text-xl uppercase text-white-50 self-center text-center font-bold">
        Stage Mode has not Been Toggled <br />
        <br />A space member must toggle this
      </p>
      <div className="flex-grow" />
    </div>
  );

  const showSuccessStageModeRequestSubmissionToast = () => {
    addAwaitingPermissionPopup();
  };

  const handleUserRequest = () => {
    if (!currentUserId) {
      return;
    }

    joinRequest(currentUserId)
      .then((response) => {
        console.info(response);
        showSuccessStageModeRequestSubmissionToast();
        setRequestMade(true);
      })
      .catch((e) => {
        console.info(e);
        toast.error(
          <ToastContent
            isDanger
            headerIconName="alert"
            title={t('titles.alert')}
            text={t('messages.joinStageRequestFailure')}
            isCloseButton
          />
        );
        setRequestMade(false);
      });
  };

  useEffect(() => {
    const audience = stageModeUsers.filter((user) => {
      return user.role === ParticipantRole.AUDIENCE_MEMBER;
    });

    const speakers = stageModeUsers.filter((user) => {
      return user.role === ParticipantRole.SPEAKER;
    });

    setStageStats({
      speakers: isOnStage ? speakers.length + 1 : speakers.length,
      audience: isOnStage ? audience.length - 1 : audience.length
    });
  }, [stageModeUsers, isOnStage]);

  const actions = useMemo(() => {
    return (
      <div className="flex items-center justify-between mx-4 gap-2 flex-grow">
        {collaborationState.stageMode && (
          <div className="flex items-center gap-1">
            <span>
              Speakers: {stageStats.speakers}/{CONFIG.video.MAX_STAGE_USERS}
            </span>
            <span>Audience: {stageStats.audience}</span>
          </div>
        )}

        {collaborationState.stageMode && !requestMade && (
          <Button
            type={isOnStage ? 'ghost-red' : 'ghost'}
            onClick={isOnStage ? leaveStage : handleUserRequest}
          >
            {isOnStage ? 'Leave Stage?' : 'Go on Stage?'}
          </Button>
        )}
        {collaborationState.stageMode && requestMade && <span>Request to go on stage pending</span>}
        {collaborationState.stageMode && !canEnterStage() && <span>Stage is full</span>}
      </div>
    );
  }, [
    collaborationState,
    canEnterStage,
    isOnStage,
    leaveStage,
    requestMade,
    stageStats,
    handleUserRequest
  ]);

  return (
    <Page
      title={collaborationState.collaborationSpace?.name || ''}
      subtitle="Stage Mode"
      collaboration
      actions={actions}
    >
      <div className="flex w-full">
        <div className="flex flex-col space-y-1">
          <StageModePopupQueueComponent />
        </div>
        {collaborationState.stageMode ? usersOnStage() : stageModeOffMessage()}
      </div>
    </Page>
  );
};

export default StageModeGuestLayout;
