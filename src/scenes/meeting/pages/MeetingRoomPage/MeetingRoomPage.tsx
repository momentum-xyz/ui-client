import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Transition} from '@headlessui/react';

import {useStore} from 'shared/hooks';

import {
  PeopleCount,
  MuteAllButton,
  MaxVideoStreams,
  LocalUser,
  MeetingUser,
  StageModeUser,
  JoinLeaveButtons
} from './components';
import * as styled from './MeetingRoomPage.styled';

const MeetingRoomPage: FC = () => {
  const {mainStore, sessionStore, meetingStore, collaborationStore} = useStore();
  const {meetingRoomStore} = meetingStore;
  const {space, stageModeStore} = collaborationStore;
  const {agoraStore, unityStore} = mainStore;
  const {agoraStageModeStore, userDevicesStore, meetingPeopleCount} = agoraStore;

  useEffect(() => {
    stageModeStore.removeAllPopups();
    meetingStore.setKicked(false);
  }, [stageModeStore, meetingStore]);

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
      <styled.Container data-testid="MeetingRoomPage-test">
        <styled.ListItem>
          <JoinLeaveButtons isShown={!unityStore.isPaused} />

          <styled.ListItemContent className="noScrollIndicator">
            <PeopleCount count={meetingPeopleCount} />

            <ul>
              {/* MUTE ALL */}
              <MuteAllButton
                isShown={!agoraStore.isStageMode && collaborationStore.isModerator}
                peopleCount={meetingPeopleCount}
                onMuteAll={() => meetingRoomStore.muteAllParticipants(space?.id)}
              />

              {/* CURRENT USER */}
              <LocalUser
                isShown={!agoraStore.isStageMode || !agoraStageModeStore.isOnStage}
                isStageMode={agoraStore.isStageMode}
                avatarSrc={sessionStore.profile?.avatarSrc}
                videoTrack={userDevicesStore.localVideoTrack}
                microphoneOff={userDevicesStore.muted}
                cameraOff={userDevicesStore.cameraOff}
                soundLevel={agoraStore.localSoundLevel}
              />

              <MaxVideoStreams isShown={agoraStore.maxVideoStreamsReached} />

              {/* STAGE MODE USERS OR MEETING USERS */}
              {agoraStore.isStageMode
                ? agoraStageModeStore.audienceMembers.map((user) => (
                    <StageModeUser
                      key={user.uid}
                      user={user}
                      isModerator={collaborationStore.isModerator}
                      canEnterStage={agoraStageModeStore.canEnterStage}
                      isInviteDialogShown={collaborationStore.inviteOnStageDialog.isOpen}
                      openInviteDialog={collaborationStore.inviteOnStageDialog.open}
                      closeInviteDialog={collaborationStore.inviteOnStageDialog.close}
                    />
                  ))
                : agoraStore.remoteUsers.map((user) => (
                    <MeetingUser
                      key={user.uid}
                      spaceId={space?.id || ''}
                      user={user}
                      isModerator={collaborationStore.isModerator}
                      maxVideoStreams={agoraStore.maxVideoStreamsReached}
                      onMuteUser={meetingRoomStore.muteParticipant}
                      onKickUser={meetingRoomStore.removeParticipant}
                    />
                  ))}
            </ul>
          </styled.ListItemContent>
        </styled.ListItem>
      </styled.Container>
    </Transition>
  );
};

export default observer(MeetingRoomPage);
