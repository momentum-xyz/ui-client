import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {toast} from 'react-toastify';
import {t} from 'i18next';
import {observer} from 'mobx-react-lite';

import {ToastContent} from 'ui-kit';
import {usePosBusEvent, useStore} from 'shared/hooks';
import {ParticipantRole} from 'core/enums';

import Page from '../../molucules/Page';
import StageModeStage from '../../atoms/StageMode/StageModeStage';
import {useStageModePopupQueueContext} from '../../../context/StageMode/StageModePopupQueueContext';
import Button from '../../atoms/Button';
import CONFIG from '../../../config/config';

import StageModePopupQueueComponent from './StageModePopupQueueComponent';

const StageModeGuestLayout: React.FC = () => {
  const [stageStats, setStageStats] = useState<{speakers: number; audience: number}>({
    speakers: 0,
    audience: 0
  });
  const {mainStore, collaborationStore, sessionStore} = useStore();
  const {agoraStore} = mainStore;
  // const [currentSpace, , ,] = useOnlineUserSpaceCheck(currentUserId);
  const [requestMade, setRequestMade] = useState<boolean>();
  const {addAwaitingPermissionPopup, removeAwaitingPermissionPopup} =
    useStageModePopupQueueContext();

  usePosBusEvent('stage-mode-accepted', (userId) => {
    if (userId === sessionStore.userId) {
      removeAwaitingPermissionPopup();
      setRequestMade(false);
    }
  });

  usePosBusEvent('stage-mode-declined', (userId) => {
    if (userId === sessionStore.userId) {
      removeAwaitingPermissionPopup();
      setRequestMade(false);
    }
  });

  const usersOnStage = () => (
    <div className="flex flex-grow z-0">
      <div className="flex-grow" />
      <StageModeStage />
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

  const showSuccessStageModeRequestSubmissionToast = useCallback(() => {
    addAwaitingPermissionPopup();
  }, [addAwaitingPermissionPopup]);

  const handleUserRequest = useCallback(async () => {
    try {
      await agoraStore.joinStageModeRequest();
      showSuccessStageModeRequestSubmissionToast();
      setRequestMade(true);
    } catch (e) {
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
    }
  }, [agoraStore, showSuccessStageModeRequestSubmissionToast]);

  useEffect(() => {
    const audience = agoraStore.stageModeUsers.filter((user) => {
      return user.role === ParticipantRole.AUDIENCE_MEMBER;
    });

    const speakers = agoraStore.stageModeUsers.filter((user) => {
      return user.role === ParticipantRole.SPEAKER;
    });

    setStageStats({
      speakers: agoraStore.isOnStage ? speakers.length + 1 : speakers.length,
      audience: agoraStore.isOnStage ? audience.length - 1 : audience.length
    });
  }, [agoraStore.stageModeUsers, agoraStore.isOnStage]);

  const actions = useMemo(() => {
    return (
      <div className="flex items-center justify-between mx-4 gap-2 flex-grow">
        {agoraStore.isStageMode && (
          <div className="flex items-center gap-1">
            <span>
              Speakers: {stageStats.speakers}/{CONFIG.video.MAX_STAGE_USERS}
            </span>
            <span>Audience: {stageStats.audience}</span>
          </div>
        )}

        {agoraStore.isStageMode && !requestMade && (
          <Button
            type={agoraStore.isStageMode ? 'ghost-red' : 'ghost'}
            onClick={agoraStore.isStageMode ? agoraStore.leaveStage : handleUserRequest}
          >
            {agoraStore.isOnStage ? 'Leave Stage?' : 'Go on Stage?'}
          </Button>
        )}
        {agoraStore.isStageMode && requestMade && <span>Request to go on stage pending</span>}
        {agoraStore.isStageMode && !agoraStore.canEnterStage && <span>Stage is full</span>}
      </div>
    );
  }, [
    agoraStore.isStageMode,
    agoraStore.leaveStage,
    agoraStore.isOnStage,
    agoraStore.canEnterStage,
    stageStats.speakers,
    stageStats.audience,
    requestMade,
    handleUserRequest
  ]);

  return (
    <Page
      title={collaborationStore.space.name || ''}
      subtitle="Stage Mode"
      collaboration
      actions={actions}
    >
      <div className="flex w-full">
        <div className="flex flex-col space-y-1">
          <StageModePopupQueueComponent />
        </div>
        {agoraStore.isStageMode ? usersOnStage() : stageModeOffMessage()}
      </div>
    </Page>
  );
};

export default observer(StageModeGuestLayout);
