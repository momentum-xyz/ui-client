import React, {FC, useEffect, useMemo, useRef, useState} from 'react';
import {observer} from 'mobx-react-lite';
import cn from 'classnames';

import {IconSvg, Text} from 'ui-kit';
import {AgoraRemoteUserInterface} from 'core/models';

import {UserMenu} from './components';
import * as styled from './MeetingUser.styled';

export interface PropsInterface {
  spaceId: string;
  user: AgoraRemoteUserInterface;
  isModerator: boolean;
  maxVideoStreams: boolean;
  onMuteUser: (spaceId: string, userId: string | number) => void;
  onKickUser: (spaceId: string, userId: string | number) => void;
}

const MeetingUser: FC<PropsInterface> = (props) => {
  const {spaceId, user, isModerator, maxVideoStreams, onKickUser, onMuteUser} = props;

  const [isMenuShown, setIsMenuShown] = useState<boolean>(false);
  const videoRef = useRef<HTMLDivElement>(null);

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
      setIsMenuShown(true);
    }
  };

  const isTalking: boolean = useMemo(() => {
    return (user.soundLevel || 0) > 3;
  }, [user.soundLevel]);

  return (
    <>
      <styled.UserListItem data-testid="MeetingUser-test" className={cn(isTalking && 'colored')}>
        <styled.Inner onClick={handleOpenMenu} className={cn(isTalking && 'colored')}>
          <styled.Video ref={videoRef} />
          {user.cameraOff && user.avatarSrc && <styled.Avatar src={user.avatarSrc} />}
          {user.cameraOff && !user.avatarSrc && (
            <styled.Placeholder>
              <IconSvg size="large" name="profile" />
            </styled.Placeholder>
          )}
        </styled.Inner>

        {user.isMuted && (
          <styled.MicrophoneOff>
            <IconSvg size="small" name="microphoneOff" isWhite />
          </styled.MicrophoneOff>
        )}

        <styled.Username>
          <Text text={user.name} transform="uppercase" size="xxs" isMultiline={false} />
        </styled.Username>
      </styled.UserListItem>

      {isMenuShown && (
        <UserMenu
          user={user}
          onMuteUser={() => onMuteUser(spaceId, user.uid)}
          onKickUser={() => onKickUser(spaceId, user.uid)}
          onClose={() => setIsMenuShown(false)}
        />
      )}
    </>
  );
};

export default observer(MeetingUser);
