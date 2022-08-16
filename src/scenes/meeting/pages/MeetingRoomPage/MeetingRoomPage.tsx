import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';
import {useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router';

import {useStore} from 'shared/hooks';
import {ToastContent} from 'ui-kit';
import {ROUTES} from 'core/constants';
import {PrivateSpaceError} from 'core/errors';

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
  const rootStore = useStore();
  const {mainStore, sessionStore, meetingStore, collaborationStore} = rootStore;
  const {meetingRoomStore} = meetingStore;
  const {space, stageModeStore} = collaborationStore;
  const {agoraStore} = mainStore;
  const {agoraMeetingStore, agoraStageModeStore, userDevicesStore} = agoraStore;

  const {spaceId} = useParams<{spaceId: string}>();
  const history = useHistory();
  const {t} = useTranslation();

  useEffect(() => {
    stageModeStore.removeAllPopups();
    meetingStore.setKicked(false);
  }, [stageModeStore, meetingStore]);

  useEffect(() => {
    rootStore.joinMeetingSpace(spaceId).catch((e) => {
      if (e instanceof PrivateSpaceError) {
        history.push(ROUTES.base);
        toast.error(
          <ToastContent
            isDanger
            isCloseButton
            headerIconName="alert"
            title={t('titles.alert')}
            text={t('collaboration.spaceIsPrivate')}
          />
        );
      }
    });

    return () => {
      rootStore.leaveMeetingSpace();
    };
  }, [history, rootStore, sessionStore.userId, spaceId, t]);

  if (!agoraStore.hasJoined) {
    return <></>;
  }

  return (
    <styled.Container data-testid="MeetingRoomPage-test">
      <styled.Inner>
        <JoinLeaveButtons isShown={false} />

        <styled.Content className="noScrollIndicator">
          <PeopleCount count={agoraStore.meetingPeopleCount} />

          <ul>
            {/* MUTE ALL */}
            <MuteAllButton
              isShown={!agoraStore.isStageMode && collaborationStore.isModerator}
              peopleCount={agoraStore.meetingPeopleCount}
              onMuteAll={() => meetingRoomStore.muteAllUsers(space?.id)}
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
