import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';
import {Loader} from 'ui-kit';

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

interface PropsInterface {
  isTable: boolean;
  isFlight: boolean;
}

const MeetingRoomPage: FC<PropsInterface> = ({isTable, isFlight}) => {
  const {mainStore, sessionStore, meetingStore, collaborationStore} = useStore();
  const {meetingRoomStore} = meetingStore;
  const {space, stageModeStore} = collaborationStore;
  const {agoraStore} = mainStore;
  const {agoraMeetingStore, agoraStageModeStore, userDevicesStore} = agoraStore;

  useEffect(() => {
    stageModeStore.removeAllPopups();
    meetingStore.setKicked(false);
  }, [stageModeStore, meetingStore]);

  if (!agoraStore.hasJoined) {
    return (
      <styled.Loader>
        <Loader />
      </styled.Loader>
    );
  }

  return (
    <styled.Container data-testid="MeetingRoomPage-test">
      <styled.Inner>
        {!!space?.id && (
          <JoinLeaveButtons
            spaceId={space.id}
            isJoinButtonShown={isFlight}
            isLeaveButtonShown={isTable || isFlight}
          />
        )}

        <styled.Content className="noScrollIndicator">
          <PeopleCount count={agoraStore.meetingPeopleCount} />

          <ul>
            {/* MUTE ALL */}
            <MuteAllButton
              isShown={!agoraStore.isStageMode && collaborationStore.isModerator}
              peopleCount={agoraStore.meetingPeopleCount}
              onMuteAll={agoraMeetingStore.muteAllRemoteUsers}
            />

            {/* CURRENT USER */}
            <LocalUser
              isShown={!agoraStore.isStageMode || !agoraStageModeStore.isOnStage}
              isStageMode={agoraStore.isStageMode}
              avatarSrc={sessionStore.profile?.avatarSrc}
              videoTrack={userDevicesStore.localVideoTrack}
              microphoneOff={agoraStore.isStageMode || userDevicesStore.muted}
              cameraOff={agoraStore.isStageMode || userDevicesStore.cameraOff}
              soundLevel={agoraStore.localSoundLevel}
            />

            <MaxVideoStreams isShown={agoraMeetingStore.maxVideoStreamsReached} />

            {/* STAGE MODE USERS OR MEETING USERS */}
            {agoraStore.isStageMode
              ? agoraStageModeStore.audienceMembers.map((user) => (
                  <StageModeUser
                    key={user.uid}
                    user={user}
                    isModerator={collaborationStore.isModerator}
                    canEnterStage={agoraStageModeStore.canEnterStage}
                    inviteToStage={agoraStageModeStore.inviteToStage}
                    isInviteDialogShown={collaborationStore.inviteOnStageDialog.isOpen}
                    openInviteDialog={collaborationStore.inviteOnStageDialog.open}
                    closeInviteDialog={collaborationStore.inviteOnStageDialog.close}
                  />
                ))
              : agoraMeetingStore.users.map((user) => (
                  <MeetingUser
                    key={user.uid}
                    spaceId={space?.id || ''}
                    user={user}
                    isModerator={collaborationStore.isModerator}
                    maxVideoStreams={agoraMeetingStore.maxVideoStreamsReached}
                    onMuteUser={agoraMeetingStore.muteRemoteUser}
                    onKickUser={meetingRoomStore.kickUser}
                    usersListUpdated={agoraMeetingStore.users.length}
                  />
                ))}
          </ul>
        </styled.Content>
      </styled.Inner>
    </styled.Container>
  );
};

export default observer(MeetingRoomPage);
