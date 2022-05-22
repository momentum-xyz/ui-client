import {Transition} from '@headlessui/react';
import React, {useEffect, useMemo, useState} from 'react';
import {toast} from 'react-toastify';
import {useHistory} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

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

  const {t} = useTranslation();

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
    } else if (!shouldActivateStageMode && collaborationState.stageMode) {
      collaborationDispatch({
        type: COLLABORATION_STAGE_MODE_ACTION_UPDATE,
        stageMode: false
      });
    }
  });

  useWebsocketEvent('stage-mode-mute', () => {
    toast.info(
      <ToastContent
        headerIconName="alert"
        title={t('titles.alert')}
        text={t('messages.stageModeMuted')}
        isCloseButton
      />,
      TOAST_GROUND_OPTIONS
    );
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
    const isLimitReached = remoteParticipants.length > CONFIG.video.PARTICIPANTS_VIDEO_LIMIT - 1;

    if (isLimitReached && !maxVideoStreamsShown) {
      setMaxVideoStreamsShown(true);
      showMaxVideoStreamsReached();
    } else if (maxVideoStreamsShown && !isLimitReached) {
      setMaxVideoStreamsShown(false);
    }
  }, [maxVideoStreamsShown, remoteParticipants.length]);

  const noVideo = remoteParticipants.length > CONFIG.video.PARTICIPANTS_VIDEO_LIMIT - 1;

  const stageModeAudience = stageModeUsers.filter((user) => {
    return user.role === ParticipantRole.AUDIENCE_MEMBER && user.uid !== currentUserId;
  });

  const numberOfPeople = useMemo(() => {
    return collaborationState.stageMode
      ? stageModeAudience.length + Number(!isOnStage)
      : remoteParticipants.length + 1;
  }, [
    collaborationState.stageMode,
    isOnStage,
    remoteParticipants.length,
    stageModeAudience.length
  ]);

  return (
    <Transition
      show={collaborationState.enabled || collaborationState.stageMode}
      unmount={false}
      className="z-main-u ml-auto mr-1 "
      enter="transform transition-transform ease-out duration-300"
      enterFrom="translate-x-5 "
      enterTo="translate-x-0 "
      leave="transform transition-transform ease-in duration-300"
      leaveFrom="translate-x-0 "
      leaveTo="translate-x-5 "
    >
      <ul className="h-full" style={{paddingBottom: '100px'}}>
        <Transition
          show={!unityStore.isPaused}
          unmount={false}
          enter="transition-all transform ease-out duration-300"
          enterFrom="-translate-y-8 h-0 mt-0"
          enterTo="translate-y-0 h-8 mt-1"
          leave="transition-all transform ease-in duration-300"
          leaveFrom="translate-y-0 h-8 mt-1"
          leaveTo="-translate-y-8 h-0 mt-0"
          className="mb-1 overflow-hidden pr-.1"
          as="li"
        >
          <div
            className="relative rounded-full h-8 w-8  m-auto bg-red-sunset-10 border cursor-pointer text-white-100 flex border-red-sunset-70 justify-center items-center backdrop-filter backdrop-blur"
            onClick={() => {
              leaveCollaborationSpaceCall(false).then();
              if (collaborationState.stageMode) {
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

        <li className="overflow-y-scroll h-full pr-.1">
          <p className="text-center whitespace-nowrap">
            {t('counts.people', {count: numberOfPeople}).toUpperCase()}
          </p>
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
                enterFrom="translate-x-8"
                enterTo="translate-x-0 "
                leave="transition-all transform  ease-in duration-300"
                leaveFrom="translate-x-0 "
                leaveTo="translate-x-8"
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
