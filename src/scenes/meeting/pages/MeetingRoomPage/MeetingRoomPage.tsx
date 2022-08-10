import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Transition} from '@headlessui/react';

import {useStore} from 'shared/hooks';
import {AgoraRemoteUserInterface, StageModeUserInterface} from 'core/models';

import {
  RemoteParticipant,
  LocalParticipant,
  JoinLeaveButtons,
  MuteAllButton,
  MaxVideoStreams,
  PeopleCount
} from './components';
import * as styled from './MeetingRoomPage.styled';

const MeetingRoomPage: FC = () => {
  const {mainStore, meetingStore, collaborationStore} = useStore();
  const {meetingRoomStore} = meetingStore;
  const {space, stageModeStore} = collaborationStore;
  const {agoraStore, unityStore} = mainStore;
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
      <styled.Container>
        <styled.ListItem>
          <JoinLeaveButtons isShown={!unityStore.isPaused} />

          <styled.ListItemContent className="noScrollIndicator">
            <PeopleCount count={meetingPeopleCount} />

            <MuteAllButton
              peopleCount={meetingPeopleCount}
              isShown={!agoraStore.isStageMode && collaborationStore.isModerator}
              onMuteAll={() => meetingRoomStore.muteAllParticipants(space?.id)}
            />

            <ul>
              {(!agoraStore.isStageMode || !agoraStageModeStore.isOnStage) && <LocalParticipant />}

              <MaxVideoStreams isShown={!agoraStore.maxVideoStreamsReached} />

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
      </styled.Container>
    </Transition>
  );
};

export default observer(MeetingRoomPage);
