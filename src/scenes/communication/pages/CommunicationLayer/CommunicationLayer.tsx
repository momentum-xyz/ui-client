import {Transition} from '@headlessui/react';
import React, {useEffect, useMemo, useState} from 'react';
import {toast} from 'react-toastify';
import {useHistory, useLocation} from 'react-router-dom';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';
import cn from 'classnames';

import {
  ToastContent,
  TOAST_BASE_OPTIONS,
  TOAST_GROUND_OPTIONS,
  SvgButton,
  Text,
  TOAST_NOT_AUTO_CLOSE_OPTIONS
} from 'ui-kit';
import {useStore} from 'shared/hooks';
import CONFIG from 'config/config';
import useCollaboration, {
  useJoinCollaborationSpaceByAssign,
  useLeaveCollaborationSpace
} from 'context/Collaboration/hooks/useCollaboration';
import useAgoraVideo from 'hooks/communication/useAgoraVideo';
import {ParticipantRole} from 'context/Collaboration/CollaborationTypes';
import {useAgoraStageMode} from 'hooks/communication/useAgoraStageMode';
import {
  COLLABORATION_MUTED_ACTION_UPDATE,
  COLLABORATION_STAGE_MODE_ACTION_UPDATE
} from 'context/Collaboration/CollaborationReducer';
import StageModePIP from 'component/atoms/StageMode/StageModePIP';
import useWebsocketEvent from 'context/Websocket/hooks/useWebsocketEvent';
import {StageModeStatus} from 'context/type/StageMode';
import {ROUTES} from 'core/constants';
import {useStageModePopupQueueContext} from 'context/StageMode/StageModePopupQueueContext';
import {useStageModeLeave, useStageModeRequestAcceptOrDecline} from 'hooks/api/useStageModeService';
import {useModerator} from 'context/Integration/hooks/useIntegration';
import {useGetSpace} from 'hooks/api/useSpaceService';
import UnityService from 'context/Unity/UnityService';

import {RemoteParticipant, LocalParticipant} from './components';
import * as styled from './CommunicationLayer.styled';

export interface CommunicationLayerProps {}

// TODO: Refactor this component to new structure
const CommunicationLayer: React.FC<CommunicationLayerProps> = () => {
  const history = useHistory();
  const location = useLocation();
  const {collaborationState, collaborationDispatch, currentUserId} = useCollaboration();
  const agoraStageMode = useAgoraStageMode();
  const {localUser, remoteParticipants} = useAgoraVideo();
  const {stageModeUsers, isOnStage, canEnterStage} = useAgoraStageMode();
  const leaveCollaborationSpaceCall = useLeaveCollaborationSpace();
  const joinMeetingSpace = useJoinCollaborationSpaceByAssign();
  const [maxVideoStreamsShown, setMaxVideoStreamsShown] = useState<boolean>(false);
  const {
    mainStore,
    communicationStore: {communicationLayerStore},
    collaborationStore: {spaceStore}
  } = useStore();
  const {unityStore} = mainStore;
  const {addRequestPopup, clearPopups} = useStageModePopupQueueContext();
  const stageModeLeave = useStageModeLeave(collaborationState.collaborationSpace?.id);
  const [acceptRequest, declineRequest] = useStageModeRequestAcceptOrDecline(
    collaborationState.collaborationSpace?.id
  );
  const [isModerator, , ,] = useModerator(
    // @ts-ignore
    collaborationState.collaborationSpace?.id
  );

  const stageModeAudience = useMemo(() => {
    return stageModeUsers.filter((user) => {
      return user.role === ParticipantRole.AUDIENCE_MEMBER && user.uid !== currentUserId;
    });
  }, [currentUserId, stageModeUsers]);

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

  useEffect(() => {
    clearPopups();
    if (collaborationState.collaborationSpace?.id) {
      communicationLayerStore.setKicked(false);
      communicationLayerStore.selectParticipant(undefined);
    }
  }, [collaborationState.collaborationSpace]);

  useEffect(() => {
    if (collaborationState.collaborationSpace) {
      if (collaborationState.stageMode) {
        agoraStageMode.join(collaborationState.collaborationSpace.id).then();
      } else {
        agoraStageMode.leave().then();
      }
    }
  }, [collaborationState.stageMode]);

  useWebsocketEvent('stage-mode-request', (userId) => {
    if (isModerator) {
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
    }
  });

  useWebsocketEvent('stage-mode-toggled', (stageModeStatus) => {
    //if (collaborationState.collaborationSpace?.id !== spaceId) return;

    const shouldActivateStageMode = stageModeStatus === StageModeStatus.INITIATED;

    if (shouldActivateStageMode && !collaborationState.stageMode) {
      collaborationDispatch({
        type: COLLABORATION_STAGE_MODE_ACTION_UPDATE,
        stageMode: true
      });

      if (!location.pathname.includes(ROUTES.stageMode)) {
        history.push(ROUTES.stageMode);
      }
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

      toast.info(
        <ToastContent
          headerIconName="alert"
          title={t('titles.stage')}
          text={t('messages.stageModeDeActivated')}
          isCloseButton
        />,
        TOAST_GROUND_OPTIONS
      );
    }
  });

  useWebsocketEvent('meeting-mute', () => {
    collaborationDispatch({
      type: COLLABORATION_MUTED_ACTION_UPDATE,
      muted: true
    });
  });

  useWebsocketEvent('notify-gathering-start', (message) => {
    const handleJoinSpace = () => {
      if (message.spaceId) {
        UnityService.teleportToSpace(message.spaceId);

        joinMeetingSpace(message.spaceId).then(() => {
          unityStore.pause();
          history.push({pathname: ROUTES.collaboration});
        });
      }
    };
    toast.info(
      <ToastContent
        headerIconName="calendar"
        title={t('titles.joinGathering')}
        text={t('messages.joinGathering', {title: message.name})}
        approveInfo={{title: 'Join', onClick: handleJoinSpace}}
      />,
      TOAST_NOT_AUTO_CLOSE_OPTIONS
    );
  });

  useWebsocketEvent('meeting-mute-all', (moderatorId) => {
    if (currentUserId !== moderatorId) {
      collaborationDispatch({
        type: COLLABORATION_MUTED_ACTION_UPDATE,
        muted: true
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

  useWebsocketEvent('space-invite', (spaceId, invitorId, invitorName, uiTypeId) => {
    const handleJoinSpace = () => {
      unityStore.teleportToSpace(spaceId);

      joinMeetingSpace(spaceId, uiTypeId === '285ba49f-fee3-40d2-ab55-256b5804c20c').then(() => {
        if (uiTypeId !== '285ba49f-fee3-40d2-ab55-256b5804c20c') {
          unityStore.pause();
          history.push({pathname: ROUTES.collaboration});
        }
      });
    };

    const Content: React.FC = () => {
      const [spaceInfo, , ,] = useGetSpace(spaceId);

      return (
        <ToastContent
          headerIconName="alert"
          text={t('messages.joinSpaceWelcome')}
          title={t('messages.spaceInvitationNote', {
            invitor: invitorName,
            spaceName: spaceInfo?.space.name
          })}
          approveInfo={{title: t('titles.joinSpace'), onClick: handleJoinSpace}}
        />
      );
    };

    toast.info(<Content />, TOAST_BASE_OPTIONS);
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
      <ul className="h-full mt-1">
        <styled.List>
          <Transition
            show={!unityStore.isPaused}
            unmount={false}
            enter="transition-all transform ease-out duration-300"
            enterFrom="-translate-y-8 pt-0"
            enterTo="translate-y-0 pt-[30px] pb-1"
            leave="transition-all transform ease-in duration-300"
            leaveFrom="translate-y-0 pt-[30px] pb-1"
            leaveTo="-translate-y-8 pt-0 hidden"
            className="pr-.1 space-y-1 pointer-all"
            as="li"
          >
            <styled.ActionButton
              variant="primary-background"
              label={t('actions.return')}
              icon="collaboration"
              onClick={() => {
                history.push(ROUTES.collaboration);
              }}
            />
            <styled.ActionButton
              variant="danger-background"
              label={t('actions.leave')}
              icon="leave"
              onClick={() => {
                leaveCollaborationSpaceCall(false).then(stageModeLeave);
                if (collaborationState.stageMode) {
                  collaborationDispatch({
                    type: COLLABORATION_STAGE_MODE_ACTION_UPDATE,
                    stageMode: false
                  });
                }
              }}
            />
          </Transition>
          <styled.ListContent
            className={cn(
              communicationLayerStore.selectedParticipant && 'showMenu',
              'noScrollIndicator'
            )}
          >
            <p className="text-center whitespace-nowrap">
              {t('counts.people', {count: numberOfPeople}).toUpperCase()}
            </p>
            {!collaborationState.stageMode && numberOfPeople > 2 && isModerator && (
              <styled.MuteButtonContainer>
                <styled.MuteButton>
                  <SvgButton
                    iconName="microphoneOff"
                    size="extra-large"
                    onClick={() => {
                      communicationLayerStore.muteAllParticipants(spaceStore.space.id);
                    }}
                  />
                </styled.MuteButton>
                <Text text="Mute All" transform="uppercase" size="s" />
              </styled.MuteButtonContainer>
            )}
            <ul>
              {collaborationState.stageMode
                ? !isOnStage && <LocalParticipant stageLocalUserId={currentUserId} />
                : localUser.uid && <LocalParticipant localUser={localUser} />}
              {noVideo && (
                <li
                  className="mb-.5 p-.5
        relative
        rounded-full
        border-1 border-transparant"
                >
                  <div
                    className="h-8 w-8 flex items-center rounded-full bg-dark-blue-100 cursor-pointer"
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
                  <RemoteParticipant
                    key={`participant-${participant.uid as string}`}
                    // @ts-ignore
                    participant={participant}
                    participantModel={communicationLayerStore.participants.find(
                      (p) => p.uid === participant.uid
                    )}
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
          </styled.ListContent>
        </styled.List>
      </ul>
      {!window.location.href.includes('stage-mode') && <StageModePIP />}
    </Transition>
  );
};

export default observer(CommunicationLayer);
