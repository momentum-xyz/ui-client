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
  const {agoraStore_OLD} = mainStore;
  const {agoraMeetingStore, agoraStageModeStore, userDevicesStore} = agoraStore_OLD;

  const location = useLocation();

  useEffect(() => {
    const wasPlayingBeforeJoining: boolean = musicPlayerStore.musicPlayer.isPlaying;
    if (wasPlayingBeforeJoining && agoraStore_OLD.hasJoined) {
      musicPlayerStore.pause();
    }

    return () => {
      if (
        !musicPlayerStore.musicPlayer.isPlaying &&
        wasPlayingBeforeJoining &&
        !agoraStore_OLD.hasJoined
      ) {
        musicPlayerStore.play();
      }
    };
  }, [agoraStore_OLD.hasJoined, musicPlayerStore]);

  const isButtonsAvailable = useMemo(() => {
    return (
      !matchPath(location.pathname, {path: ROUTES.collaboration.base}) &&
      !matchPath(location.pathname, {path: ROUTES.flyWithMe.passenger}) &&
      !matchPath(location.pathname, {path: ROUTES.flyWithMe.pilot})
    );
  }, [location.pathname]);

  if (!agoraStore_OLD.hasJoined) {
    return <></>;
  }

  return (
    <styled.Container data-testid="MeetingRoomPage-test">
      <styled.Inner>
        {isButtonsAvailable && (
          <JoinLeaveButtons
            spaceId={agoraStore_OLD.spaceId || ''}
            isJoinButtonShown={!collaborationStore.spaceStore?.isTable}
            onLeave={onLeave}
          />
        )}

        <styled.Content className="noScrollIndicator">
          <PeopleCount count={agoraStore_OLD.meetingPeopleCount} />

          <ul>
            {/* MUTE ALL */}
            <MuteAllButton
              spaceId={agoraStore_OLD.spaceId || ''}
              isShown={!agoraStore_OLD.isStageMode && collaborationStore.spaceStore?.isAdmin}
              peopleCount={agoraStore_OLD.meetingPeopleCount}
              onMuteAll={meetingRoomStore.muteAllUsers}
            />

            {/* CURRENT USER */}
            <LocalUser
              isShown={!agoraStore_OLD.isStageMode || !agoraStageModeStore.isOnStage}
              isStageMode={agoraStore_OLD.isStageMode}
              avatarSrc={sessionStore.user?.avatarSrc}
              videoTrack={userDevicesStore.localVideoTrack}
              microphoneOff={agoraStore_OLD.isStageMode || userDevicesStore.muted}
              cameraOff={agoraStore_OLD.isStageMode || userDevicesStore.cameraOff}
              soundLevel={agoraStore_OLD.localSoundLevel}
            />

            <MaxVideoStreams isShown={agoraMeetingStore.maxVideoStreamsReached} />

            {/* STAGE MODE USERS OR MEETING USERS */}
            {agoraStore_OLD.isStageMode
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
                    spaceId={agoraStore_OLD.spaceId || ''}
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
