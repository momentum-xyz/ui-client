import React, {FC, useEffect, useMemo, useRef} from 'react';
import {observer} from 'mobx-react-lite';
import cn from 'classnames';
import {IconSvg, Text, useCoordinates} from '@momentum/ui-kit';

import {AgoraRemoteUserInterface} from 'core/models';
import {ReactComponent as Astronaut} from 'ui-kit/assets/images/common/astronaut.svg';

import {UserMenu} from './components';
import * as styled from './MeetingUser.styled';

export interface PropsInterface {
  spaceId: string;
  user: AgoraRemoteUserInterface;
  isModerator: boolean;
  maxVideoStreams: boolean;
  onMuteUser: (spaceId: string, userId: string) => void;
  onKickUser: (spaceId: string, userId: string) => void;
  usersListUpdated: number;
}

const OFFSET_RIGHT = 182;
const OFFSET_BOTTOM = 7;

const MeetingUser: FC<PropsInterface> = (props) => {
  const {spaceId, user, isModerator, maxVideoStreams, onKickUser, onMuteUser, usersListUpdated} =
    props;

  const videoRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const {coords, isShown, updateCoords, setIsShown} = useCoordinates(
    menuRef,
    OFFSET_RIGHT,
    OFFSET_BOTTOM
  );

  useEffect(() => {
    user.fetchUser();
  }, [user]);

  useEffect(() => {
    updateCoords();
  }, [usersListUpdated]);

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
      updateCoords();
      setIsShown(true);
    }
  };

  const isTalking: boolean = useMemo(() => {
    return (user.soundLevel || 0) > 3;
  }, [user.soundLevel]);

  return (
    <styled.UserListItem data-testid="MeetingUser-test" className={cn(isTalking && 'colored')}>
      <styled.Inner ref={menuRef} onClick={handleOpenMenu} className={cn(isTalking && 'colored')}>
        <styled.Video ref={videoRef} />
        {user.cameraOff && user.avatarSrc && <styled.Avatar src={user.avatarSrc} />}
        {user.cameraOff && !user.avatarSrc && (
          <styled.Placeholder>
            <Astronaut />
          </styled.Placeholder>
        )}

        {user.isMuted && (
          <styled.MicrophoneOff>
            <IconSvg size="small" name="microphoneOff" isWhite />
          </styled.MicrophoneOff>
        )}
      </styled.Inner>

      <styled.Username title={user.name}>
        <Text text={user.name} transform="uppercase" size="xxs" isMultiline={false} />
      </styled.Username>

      {isShown && (
        <UserMenu
          user={user}
          onMuteUser={() => onMuteUser(spaceId, user.uid.toString())}
          onKickUser={() => onKickUser(spaceId, user.uid.toString())}
          onClose={() => setIsShown(false)}
          coords={coords}
        />
      )}
    </styled.UserListItem>
  );
};

export default observer(MeetingUser);
