import React, {FC, useEffect} from 'react';
import {Transition} from '@headlessui/react';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';

import {useStore} from 'shared/hooks';
import {SvgButton, Text} from 'ui-kit';
import {AgoraRemoteUserInterface, StageModeUserInterface} from 'core/models';

import {RemoteParticipant, LocalParticipant, JoinToSpaceBack} from './components';
import * as styled from './MeetingRoomPage.styled';

const MeetingRoomPage: FC = () => {
  const {mainStore, meetingStore, collaborationStore} = useStore();
  const {meetingRoomStore} = meetingStore;
  const {space, stageModeStore} = collaborationStore;
  const {agoraStore} = mainStore;
  const {agoraStageModeStore, meetingPeopleCount} = agoraStore;

  useEffect(() => {
    stageModeStore.removeAllPopups();
    if (space) {
      meetingStore.setKicked(false);
      meetingStore.selectParticipant(undefined);
    }
  }, [stageModeStore, meetingRoomStore, space, meetingStore]);

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
                  <div className="h-8 w-8 flex items-center rounded-full bg-dark-blue-100 cursor-pointer">
                    <span className="p-.5 text-xs text-prime-blue-100 text-center flex-grow-0">
                      Video limit reached
                    </span>
                  </div>
                </li>
              )}
              {(agoraStore.isStageMode
                ? agoraStageModeStore.audienceMembers
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
              ))}
            </ul>
          </styled.ListItemContent>
        </styled.ListItem>
      </ul>
    </Transition>
  );
};

export default observer(MeetingRoomPage);
