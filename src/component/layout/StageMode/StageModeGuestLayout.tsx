import React, {useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import {t} from 'i18next';

import {ToastContent} from 'ui-kit';

import Page from '../../molucules/Page';
import useCollaboration from '../../../context/Collaboration/hooks/useCollaboration';
import StageModeButton from '../../atoms/StageMode/StageModeButton';
import {useAgoraStageMode} from '../../../hooks/communication/useAgoraStageMode';
import StageModeStage from '../../atoms/StageMode/StageModeStage';
import {useJoinRequest} from '../../../hooks/api/useStageModeService';
import useWebsocketEvent from '../../../context/Websocket/hooks/useWebsocketEvent';
import StageModeLabel from '../../atoms/StageMode/StageModeLabel';
import {useStageModePopupQueueContext} from '../../../context/StageMode/StageModePopupQueueContext';

import StageModePopupQueueComponent from './StageModePopupQueueComponent';

const StageModeGuestLayout: React.FC = () => {
  const {collaborationState, currentUserId} = useCollaboration();
  // const [currentSpace, , ,] = useOnlineUserSpaceCheck(currentUserId);
  const {canEnterStage, joinedStage, leaveStage, isOnStage} = useAgoraStageMode();
  const joinRequest = useJoinRequest(collaborationState.collaborationSpace?.id);
  const [requestMade, setRequestMade] = useState<boolean>();
  const {addAwaitingPermissionPopup, removeAwaitingPermissionPopup} =
    useStageModePopupQueueContext();

  useEffect(() => {
    console.info('[STAGEMODE] HAS JOINED STATE CHANGED');
  }, [joinedStage]);

  // useEffect(() => {
  //   createLocalTracks().then();
  //
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isOnStage]);

  useWebsocketEvent('stage-mode-accepted', () => {
    //if (userId !== currentUserId) return;

    removeAwaitingPermissionPopup();
    setRequestMade(false);
  });

  useWebsocketEvent('stage-mode-declined', () => {
    //if (userId !== currentUserId) return;

    removeAwaitingPermissionPopup();
    setRequestMade(false);
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
    if (!currentUserId) {return;}

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

  return (
    <Page
      title={collaborationState.collaborationSpace?.name || ''}
      subtitle="Stage Mode"
      collaboration
    >
      <div className="flex w-full">
        <div className="flex flex-col space-y-1">
          {collaborationState.stageMode && !requestMade && (
            <StageModeButton
              type={isOnStage ? 'ghost-red' : 'ghost-green'}
              text={isOnStage ? 'Leave Stage?' : 'Go on Stage?'}
              onClick={isOnStage ? leaveStage : handleUserRequest}
            />
          )}
          {collaborationState.stageMode && requestMade && (
            <StageModeButton type="ghost-white" text="Pending request" />
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

export default StageModeGuestLayout;
