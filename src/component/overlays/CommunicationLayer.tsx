import {Transition} from '@headlessui/react';
import React, {useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import {t} from 'i18next';
import {useHistory} from 'react-router-dom';

import {ToastContent, TOAST_GROUND_OPTIONS} from 'ui-kit';
import {useStore} from 'shared/hooks';

import CONFIG from '../../config/config';
import useCollaboration, {
  useLeaveCollaborationSpace
} from '../../context/Collaboration/hooks/useCollaboration';
// import useWebsocketEvent from '../../context/Websocket/hooks/useWebsocketEvent';
import useAgoraVideo from '../../hooks/communication/useAgoraVideo';
import {ReactComponent as CloseIcon} from '../../images/icons/close.svg';
import LocalParticipantView from '../molucules/collaboration/LocalParticipantView';
import RemoteParticipantView from '../molucules/collaboration/RemoteParticipantView';
import {ParticipantRole} from '../../context/Collaboration/CollaborationTypes';
import {useAgoraStageMode} from '../../hooks/communication/useAgoraStageMode';
import {COLLABORATION_STAGE_MODE_ACTION_UPDATE} from '../../context/Collaboration/CollaborationReducer';
import StageModePIP from '../atoms/StageMode/StageModePIP';
import useWebsocketEvent from '../../context/Websocket/hooks/useWebsocketEvent';
import {StageModeStatus} from '../../context/type/StageMode';
import {ROUTES} from '../../core/constants';

export interface CommunicationLayerProps {}

const CommunicationLayer: React.FC<CommunicationLayerProps> = () => {
  const history = useHistory();
  const {collaborationState, collaborationDispatch, currentUserId} = useCollaboration();
  const agoraStageMode = useAgoraStageMode();
  const {localUser, remoteParticipants} = useAgoraVideo();
  const {stageModeUsers, isOnStage, canEnterStage} = useAgoraStageMode();
  const leaveCollaborationSpaceCall = useLeaveCollaborationSpace();
  const [maxVideoStreamsShown, setMaxVideoStreamsShown] = useState<boolean>(false);
  const {unityStore} = useStore().mainStore;

  useEffect(() => {
    if (collaborationState.collaborationSpace) {
      if (collaborationState.stageMode) {
        agoraStageMode.join(collaborationState.collaborationSpace.id).then();
      } else {
        agoraStageMode.leave().then();
      }
    }
  }, [collaborationState.stageMode]);

  useWebsocketEvent('stage-mode-toggled', (stageModeStatus) => {
    //if (collaborationState.collaborationSpace?.id !== spaceId) return;

    const shouldActivateStageMode = stageModeStatus === StageModeStatus.INITIATED;

    if (shouldActivateStageMode && !collaborationState.stageMode) {
      collaborationDispatch({
        type: COLLABORATION_STAGE_MODE_ACTION_UPDATE,
        stageMode: true
      });
      history.push(ROUTES.stageMode);

      toast.info(
        <ToastContent
          headerIconName="alert"
          title={t('titles.stage')}
          text={t('messages.stageModeActivated')}
          isCloseButton
        />,
        TOAST_GROUND_OPTIONS
      );
    }

    if (!shouldActivateStageMode && collaborationState.stageMode) {
      collaborationDispatch({
        type: COLLABORATION_STAGE_MODE_ACTION_UPDATE,
        stageMode: false
      });
    }
  });

  const showMaxVideoStreamsReached = () => {
    toast.info(
      <ToastContent
        headerIconName="alert"
        title={t('titles.alert')}
        text={t('messages.maximumParticipants')}
        isCloseButton
      />,
      TOAST_GROUND_OPTIONS
    );
  };

  useEffect(() => {
    if (
      remoteParticipants.length > CONFIG.video.PARTICIPANTS_VIDEO_LIMIT - 1 &&
      !maxVideoStreamsShown
    ) {
      setMaxVideoStreamsShown(true);
      showMaxVideoStreamsReached();
    } else if (maxVideoStreamsShown) {
      setMaxVideoStreamsShown(false);
    }
  }, [remoteParticipants.length]);

  // useEffect(() => {
  //   if (collaborationState.collaborationSpace) {
  //     if (collaborationState.stageMode) {
  //       join(collaborationState.collaborationSpace.id).then();
  //     } else {
  //       leave().then();
  //     }
  //   }
  // }, [collaborationState.stageMode]);

  const noVideo = remoteParticipants.length > CONFIG.video.PARTICIPANTS_VIDEO_LIMIT - 1;

  const stageModeAudience = stageModeUsers.filter((user) => {
    return user.role === ParticipantRole.AUDIENCE_MEMBER;
  });

  return (
    <Transition
      show={collaborationState.enabled || collaborationState.stageMode}
      unmount={false}
      className="z-main-u ml-auto pt-1 mr-1"
      enter="transition-width ease-out duration-300"
      enterFrom="w-0 "
      enterTo="w-8 "
      leave="transition-all ease-in duration-300"
      leaveFrom="w-8 "
      leaveTo="w-0 "
    >
      <ul className="h-full" style={{paddingBottom: '100px'}}>
        <Transition
          show={!unityStore.isPaused}
          unmount={false}
          enter="transition-all transform ease-out duration-300"
          enterFrom="-translate-y-6 h-0"
          enterTo="translate-y-0 h-8"
          leave="transition-all transform  ease-in duration-300"
          leaveFrom="translate-y-0 h-8"
          leaveTo="-translate-y-6 h-0"
          className="pb-.5"
          as="li"
        >
          <div
            className="relative rounded-full h-8 w-8 m-auto bg-red-sunset-10 border cursor-pointer text-white-100 flex border-red-sunset-70 justify-center items-center backdrop-filter backdrop-blur"
            onClick={() => {
              if (collaborationState.collaborationSpace || collaborationState.collaborationTable) {
                leaveCollaborationSpaceCall(false);
              } else if (collaborationState.stageMode) {
                collaborationDispatch({
                  type: COLLABORATION_STAGE_MODE_ACTION_UPDATE,
                  stageMode: false
                });
              }
            }}
          >
            <CloseIcon className="w-1/4" />
          </div>
        </Transition>
        {/*{localUser.uid && cameraConsent && <LocalParticipantView localUser={localUser} />}*/}

        <li className="overflow-y-scroll h-full">
          <ul>
            {collaborationState.stageMode
              ? !isOnStage && <LocalParticipantView stageLocalUserId={currentUserId} />
              : localUser.uid && <LocalParticipantView localUser={localUser} />}
            {noVideo && (
              <li
                className="mb-.5 p-.5
        relative
        rounded-full
        border-1 border-transparant"
              >
                <div
                  className="h-8 w-8 flex items-center rounded-full bg-dark-blue-100 overflow-hidden relative cursor-pointer"
                  onClick={() => showMaxVideoStreamsReached()}
                >
                  <span className="p-.5 text-xs text-prime-blue-100 text-center flex-grow-0">
                    Video limit reached
                  </span>
                </div>
              </li>
            )}
            {(collaborationState.stageMode
              ? stageModeAudience.map((user) => {
                  return {
                    ...user,
                    soundLevel: 0
                  };
                })
              : remoteParticipants
            ).map((participant) => (
              <Transition
                key={`participant-${participant.uid as string}`}
                appear={true}
                enter="transition-all transform ease-out duration-300"
                enterFrom="translate-x-6 w-0"
                enterTo="translate-x-0 w-6"
                leave="transition-all transform  ease-in duration-300"
                leaveFrom="translate-x-0 w-6"
                leaveTo="translate-x-6 w-0"
              >
                <RemoteParticipantView
                  key={`participant-${participant.uid as string}`}
                  // @ts-ignore
                  participant={participant}
                  canEnterStage={canEnterStage()}
                  totalParticipants={
                    collaborationState.stageMode
                      ? stageModeAudience.length
                      : remoteParticipants.length
                  }
                />
              </Transition>
            ))}
          </ul>
        </li>
      </ul>
      {!window.location.href.includes('stage-mode') && <StageModePIP />}
    </Transition>
  );
};

export default CommunicationLayer;
