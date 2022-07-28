import {Transition} from '@headlessui/react';
import React, {useEffect, useMemo, useState} from 'react';
import {toast} from 'react-toastify';
import {generatePath, useHistory} from 'react-router-dom';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';

import {
  ToastContent,
  TOAST_GROUND_OPTIONS,
  SvgButton,
  Text,
  TOAST_NOT_AUTO_CLOSE_OPTIONS,
  TOAST_BASE_OPTIONS
} from 'ui-kit';
import {useStore, usePosBusEvent} from 'shared/hooks';
import CONFIG from 'config/config';
import {ParticipantRole} from 'core/enums';
import StageModePIP from 'component/atoms/StageMode/StageModePIP';
import {ROUTES, TELEPORT_DELAY_MS} from 'core/constants';
import {useStageModePopupQueueContext} from 'context/StageMode/StageModePopupQueueContext';
import {useGetSpace} from 'hooks/api/useSpaceService';

import {RemoteParticipant, LocalParticipant} from './components';
import * as styled from './CommunicationLayer.styled';

// TODO: Refactor this component to new structure
const CommunicationLayer = () => {
  const history = useHistory();
  const [maxVideoStreamsShown, setMaxVideoStreamsShown] = useState<boolean>(false);
  const {
    mainStore,
    communicationStore: {communicationLayerStore},
    collaborationStore,
    sessionStore
  } = useStore();
  const {space} = collaborationStore;
  const {unityStore, agoraStore} = mainStore;
  const {userDevicesStore} = agoraStore;
  const {clearPopups} = useStageModePopupQueueContext();

  const stageModeAudience = useMemo(() => {
    return agoraStore.isStageMode
      ? agoraStore.stageModeUsers.filter((user) => {
          return user.role === ParticipantRole.AUDIENCE_MEMBER && user.uid !== sessionStore.userId;
        })
      : [];
  }, [agoraStore.stageModeUsers, sessionStore.userId, agoraStore.isStageMode]);

  const numberOfPeople = useMemo(() => {
    return agoraStore.isStageMode
      ? stageModeAudience.length + Number(!agoraStore.isOnStage)
      : agoraStore.remoteUsers.length + 1;
  }, [
    agoraStore.isOnStage,
    agoraStore.isStageMode,
    agoraStore.remoteUsers.length,
    stageModeAudience.length
  ]);

  useEffect(() => {
    clearPopups();
    if (space) {
      communicationLayerStore.setKicked(false);
      communicationLayerStore.selectParticipant(undefined);
    }
  }, [clearPopups, communicationLayerStore, space]);

  usePosBusEvent('meeting-mute', userDevicesStore.mute);

  usePosBusEvent('notify-gathering-start', (message) => {
    const handleJoinSpace = () => {
      const {spaceId} = message;
      if (spaceId) {
        unityStore.teleportToSpace(spaceId);
        setTimeout(() => {
          history.push(generatePath(ROUTES.collaboration.dashboard, {spaceId}));
        }, TELEPORT_DELAY_MS);
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

  usePosBusEvent('meeting-mute-all', (moderatorId) => {
    if (sessionStore.userId !== moderatorId) {
      userDevicesStore.mute();
    }
  });

  usePosBusEvent('stage-mode-mute', () => {
    userDevicesStore.mute();

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

  usePosBusEvent('space-invite', (spaceId, invitorId, invitorName, uiTypeId) => {
    const handleJoinSpace = () => {
      unityStore.teleportToSpace(spaceId);

      // TODO: Refactoring
      collaborationStore
        .joinMeetingSpace(spaceId, uiTypeId === '285ba49f-fee3-40d2-ab55-256b5804c20c')
        .then(() => {
          if (uiTypeId !== '285ba49f-fee3-40d2-ab55-256b5804c20c') {
            history.push({pathname: ROUTES.collaboration.base, state: {spaceId}});
          } else {
            history.push({pathname: ROUTES.collaboration.table, state: {spaceId}});
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
    const isLimitReached =
      agoraStore.remoteUsers.length > CONFIG.video.PARTICIPANTS_VIDEO_LIMIT - 1;

    if (isLimitReached) {
      setMaxVideoStreamsShown((maxVideoStreamsShown) => {
        showMaxVideoStreamsReached();

        return !maxVideoStreamsShown ? true : maxVideoStreamsShown;
      });
    } else {
      setMaxVideoStreamsShown((maxVideoStreamsShown) => {
        return maxVideoStreamsShown ? false : maxVideoStreamsShown;
      });
    }
  }, [agoraStore.remoteUsers.length]);

  const handleLeave = () => {
    history.push(ROUTES.base);
  };

  return (
    <Transition
      show={agoraStore.hasJoined}
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
        <styled.ListItem>
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
            as="div"
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
              onClick={handleLeave}
            />
          </Transition>
          <styled.ListItemContent className="noScrollIndicator">
            <p className="text-center whitespace-nowrap">
              {t('counts.people', {count: numberOfPeople}).toUpperCase()}
            </p>
            {!agoraStore.isStageMode && numberOfPeople > 2 && collaborationStore.isModerator && (
              <styled.MuteButtonContainer>
                <styled.MuteButton>
                  <SvgButton
                    iconName="microphoneOff"
                    size="extra-large"
                    onClick={() => {
                      communicationLayerStore.muteAllParticipants(space?.id);
                    }}
                  />
                </styled.MuteButton>
                <Text text="Mute All" transform="uppercase" size="s" />
              </styled.MuteButtonContainer>
            )}
            <ul>
              {(!agoraStore.isStageMode || !agoraStore.isOnStage) && <LocalParticipant />}
              {maxVideoStreamsShown && (
                <li
                  className="mb-.5 p-.5
relative
        rounded-full
        border-1 border-transparant"
                >
                  <div
                    className="h-8 w-8 flex items-center rounded-full bg-dark-blue-100 cursor-pointer"
                    onClick={showMaxVideoStreamsReached}
                  >
                    <span className="p-.5 text-xs text-prime-blue-100 text-center flex-grow-0">
                      Video limit reached
                    </span>
                  </div>
                </li>
              )}
              {(agoraStore.isStageMode
                ? stageModeAudience.map((user) => {
                    return {
                      ...user,
                      soundLevel: 0,
                      hasVideo: false,
                      hasAudio: false,
                      isMuted: true,
                      cameraOff: true,
                      videoTrack: undefined,
                      audioTrack: undefined
                    };
                  })
                : agoraStore.remoteUsers
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
                    participant={participant}
                    canEnterStage={agoraStore.canEnterStage}
                    totalParticipants={agoraStore.remoteUsers.length}
                  />
                </Transition>
              ))}
            </ul>
          </styled.ListItemContent>
        </styled.ListItem>
      </ul>
      {!window.location.href.includes('stage-mode') && <StageModePIP />}
    </Transition>
  );
};

export default observer(CommunicationLayer);
