import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {matchPath, useLocation} from 'react-router-dom';

import {useStore} from 'shared/hooks';
import {ROUTES} from 'core/constants';

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
  onLeave: () => void;
}

const MeetingRoomPage: FC<PropsInterface> = ({onLeave}) => {
  const {mainStore, sessionStore, meetingStore, collaborationStore, widgetStore} = useStore();
  const {meetingRoomStore} = meetingStore;
  const {musicPlayerStore} = widgetStore;
  const {agoraStore} = mainStore;
  const {agoraMeetingStore, agoraStageModeStore, userDevicesStore} = agoraStore;

  const location = useLocation();

  useEffect(() => {
    if (musicPlayerStore.musicPlayer.isPlaying) {
      musicPlayerStore.togglePlayback();
    }
  }, [agoraStore.hasJoined, musicPlayerStore]);

  if (!agoraStore.hasJoined) {
    return <></>;
  }

  return (
    <styled.Container data-testid="MeetingRoomPage-test">
      <styled.Inner>
        {!matchPath(location.pathname, {path: ROUTES.collaboration.base}) && (
          <JoinLeaveButtons
            spaceId={agoraStore.spaceId || ''}
            isJoinButtonShown={!collaborationStore.space?.isTable}
            onLeave={onLeave}
          />
        )}

        <styled.Content className="noScrollIndicator">
          <PeopleCount count={agoraStore.meetingPeopleCount} />

          <ul>
            {/* MUTE ALL */}
            <MuteAllButton
              spaceId={agoraStore.spaceId || ''}
              isShown={!agoraStore.isStageMode && collaborationStore.isModerator}
              peopleCount={agoraStore.meetingPeopleCount}
              onMuteAll={meetingRoomStore.muteAllUsers}
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
              ? agoraStageModeStore.audience.map((user) => (
                  <StageModeUser
                    key={user.uid}
                    user={user}
                    isModerator={collaborationStore.isModerator}
                    isStageFull={agoraStageModeStore.isStageFull}
                    inviteToStage={agoraStageModeStore.inviteToStage}
                  />
                ))
              : agoraMeetingStore.users.map((user) => (
                  <MeetingUser
                    key={user.uid}
                    user={user}
                    spaceId={agoraStore.spaceId || ''}
                    isModerator={collaborationStore.isModerator}
                    maxVideoStreams={agoraMeetingStore.maxVideoStreamsReached}
                    onMuteUser={meetingRoomStore.muteUser}
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
