import React, {FC, useEffect, useMemo} from 'react';
import {Transition} from '@headlessui/react';
import {toast} from 'react-toastify';
import {useHistory} from 'react-router-dom';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';

import {ToastContent, TOAST_GROUND_OPTIONS, SvgButton, Text} from 'ui-kit';
import {useStore, usePosBusEvent} from 'shared/hooks';
import {StageModePIPWidget} from 'scenes/widgets/pages';
import {AgoraRemoteUserInterface, StageModeUserInterface} from 'core/models';

import {RemoteParticipant, LocalParticipant, JoinToSpaceBack} from './components';
import * as styled from './MeetingRoomPage.styled';

const MeetingRoomPage: FC = () => {
  const {mainStore, meetingStore, collaborationStore, sessionStore} = useStore();
  const {meetingRoomStore} = meetingStore;
  const {space, stageModeStore} = collaborationStore;
  const {agoraStore} = mainStore;
  const {userDevicesStore, agoraStageModeStore, meetingPeopleCount} = agoraStore;

  const history = useHistory();

  const stageModeAudience = useMemo(() => {
    return agoraStore.isStageMode ? agoraStageModeStore.audienceMembers : [];
  }, [agoraStageModeStore.audienceMembers, agoraStore.isStageMode]);

  useEffect(() => {
    stageModeStore.removeAllPopups();
    if (space) {
      meetingRoomStore.setKicked(false);
      meetingRoomStore.selectParticipant(undefined);
    }
  }, [stageModeStore, meetingRoomStore, space]);

  usePosBusEvent('meeting-mute', userDevicesStore.mute);

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
    if (agoraStore.maxVideoStreamsReached) {
      showMaxVideoStreamsReached();
    }
  }, [agoraStore.maxVideoStreamsReached]);

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
          {/* Leave & Return */}
          <JoinToSpaceBack />

          <styled.ListItemContent className="noScrollIndicator">
            <p className="text-center whitespace-nowrap w-[92px]">
              {t('counts.people', {count: meetingPeopleCount}).toUpperCase()}
            </p>
            {!agoraStore.isStageMode && meetingPeopleCount > 2 && collaborationStore.isModerator && (
              <styled.MuteButtonContainer>
                <styled.MuteButton>
                  <SvgButton
                    iconName="microphoneOff"
                    size="extra-large"
                    onClick={() => {
                      meetingRoomStore.muteAllParticipants(space?.id);
                    }}
                  />
                </styled.MuteButton>
                <Text text="Mute All" transform="uppercase" size="s" />
              </styled.MuteButtonContainer>
            )}
            <ul>
              {(!agoraStore.isStageMode || !agoraStageModeStore.isOnStage) && <LocalParticipant />}

              {agoraStore.maxVideoStreamsReached && (
                <li className="mb-.5 p-.5 relative rounded-full border-1 border-transparant">
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
              {(agoraStore.isStageMode ? stageModeAudience : agoraStore.remoteUsers).map(
                (participant) => (
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
                      participant={
                        !agoraStore.isStageMode
                          ? (participant as AgoraRemoteUserInterface)
                          : undefined
                      }
                      audienceParticipant={
                        agoraStore.isStageMode ? (participant as StageModeUserInterface) : undefined
                      }
                      canEnterStage={agoraStageModeStore.canEnterStage}
                      totalParticipants={agoraStore.remoteUsers.length}
                    />
                  </Transition>
                )
              )}
            </ul>
          </styled.ListItemContent>
        </styled.ListItem>
      </ul>
      {!history.location.pathname.includes('stage-mode') && <StageModePIPWidget />}
    </Transition>
  );
};

export default observer(MeetingRoomPage);
