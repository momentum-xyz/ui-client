import React, {FC, useEffect, useMemo} from 'react';
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
  const {mainStore, sessionStore, meetingStore, collaborationStore, widgetStore_OLD} = useStore();
  const {meetingRoomStore} = meetingStore;
  const {musicPlayerStore} = widgetStore_OLD;
  const {agoraStore} = mainStore;
  const {agoraMeetingStore, agoraStageModeStore, userDevicesStore} = agoraStore;

  const location = useLocation();

  useEffect(() => {
    const wasPlayingBeforeJoining: boolean = musicPlayerStore.musicPlayer.isPlaying;
    if (wasPlayingBeforeJoining && agoraStore.hasJoined) {
      musicPlayerStore.pause();
    }

    return () => {
      if (
        !musicPlayerStore.musicPlayer.isPlaying &&
        wasPlayingBeforeJoining &&
        !agoraStore.hasJoined
      ) {
        musicPlayerStore.play();
      }
    };
  }, [agoraStore.hasJoined, musicPlayerStore]);

  const isButtonsAvailable = useMemo(() => {
    return (
      !matchPath(location.pathname, {path: ROUTES.collaboration.base}) &&
      !matchPath(location.pathname, {path: ROUTES.flyWithMe.passenger}) &&
      !matchPath(location.pathname, {path: ROUTES.flyWithMe.pilot})
    );
  }, [location.pathname]);

  if (!agoraStore.hasJoined) {
    return <></>;
  }

  return (
    <styled.Container data-testid="MeetingRoomPage-test">
      <styled.Inner>
        {isButtonsAvailable && (
          <JoinLeaveButtons
            spaceId={agoraStore.spaceId || ''}
            isJoinButtonShown={!collaborationStore.spaceStore?.isTable}
            onLeave={onLeave}
          />
        )}

        <styled.Content className="noScrollIndicator">
          <PeopleCount count={agoraStore.meetingPeopleCount} />

          <ul>
            {/* MUTE ALL */}
            <MuteAllButton
              spaceId={agoraStore.spaceId || ''}
              isShown={!agoraStore.isStageMode && collaborationStore.spaceStore?.isAdmin}
              peopleCount={agoraStore.meetingPeopleCount}
              onMuteAll={meetingRoomStore.muteAllUsers}
            />

            {/* CURRENT USER */}
            <LocalUser
              isShown={!agoraStore.isStageMode || !agoraStageModeStore.isOnStage}
              isStageMode={agoraStore.isStageMode}
              avatarSrc={sessionStore.user?.avatarSrc}
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
                    isAdmin={collaborationStore.spaceStore?.isAdmin}
                  />
                ))}
          </ul>
        </styled.Content>
      </styled.Inner>
    </styled.Container>
  );
};

export default observer(MeetingRoomPage);
