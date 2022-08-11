import React, {FC, useEffect, useMemo, useRef} from 'react';
import {observer} from 'mobx-react-lite';
import cn from 'classnames';

import {IconSvg, Text} from 'ui-kit';
import {useStore} from 'shared/hooks';
import {AgoraRemoteUserInterface} from 'core/models';

import {ParticipantMenu} from './components';
import * as styled from './MeetingUser.styled';

export interface PropsInterface {
  spaceId: string;
  user: AgoraRemoteUserInterface;
  isModerator: boolean;
  maxVideoStreams: boolean;
}

const MeetingUser: FC<PropsInterface> = (props) => {
  const {spaceId, user, isModerator, maxVideoStreams} = props;

  const videoRef = useRef<HTMLDivElement>(null);

  const {meetingStore} = useStore();
  const {meetingRoomStore} = meetingStore;

  useEffect(() => {
    user.fetchUser();
  }, [user]);

  useEffect(() => {
    if (!user.cameraOff && !maxVideoStreams && videoRef.current) {
      user.videoTrack?.play(videoRef.current);
    }

    if (maxVideoStreams && user.videoTrack?.isPlaying) {
      user.videoTrack?.stop();
    }

    return () => {
      user.videoTrack?.stop();
    };
  }, [maxVideoStreams, user, user.cameraOff]);

  const handleOpenMenu = () => {
    if (isModerator) {
      if (meetingStore.selectedParticipant === user.uid) {
        meetingStore.selectParticipant(undefined);
      } else {
        meetingStore.selectParticipant(user.uid);
      }
    }
  };

  const handleRemoveParticipant = () => {
    meetingRoomStore.removeParticipant(spaceId, meetingStore.selectedParticipant);
    meetingStore.selectParticipant(undefined);
  };

  const handleMuteParticipant = () => {
    meetingRoomStore.muteParticipant(spaceId, meetingStore.selectedParticipant);
    meetingStore.selectParticipant(undefined);
  };

  const isTalking: boolean = useMemo(() => {
    return (user.soundLevel || 0) > 3;
  }, [user.soundLevel]);

  return (
    <>
      <styled.UserListItem data-testid="LocalUser-test" className={cn(isTalking && 'colored')}>
        <styled.Inner onClick={handleOpenMenu} className={cn(isTalking && 'colored')}>
          <styled.Video ref={videoRef} />
          {user.cameraOff && user.avatarSrc && <styled.Avatar src={user.avatarSrc} />}
          {user.cameraOff && !user.avatarSrc && (
            <styled.Placeholder>
              <IconSvg size="large" name="profile" />
            </styled.Placeholder>
          )}
        </styled.Inner>

        {user?.isMuted && (
          <styled.MicrophoneOff>
            <IconSvg size="small" name="microphoneOff" isWhite />
          </styled.MicrophoneOff>
        )}

        <styled.Username>
          <Text text={user.name} transform="uppercase" size="xxs" isMultiline={false} />
        </styled.Username>
      </styled.UserListItem>

      {meetingStore.selectedParticipant === user.uid && (
        <ParticipantMenu
          muteParticipant={handleMuteParticipant}
          removeParticipant={handleRemoveParticipant}
          participant={user}
          onClose={() => meetingStore.selectParticipant(undefined)}
        />
      )}
    </>
  );
};

export default observer(MeetingUser);
