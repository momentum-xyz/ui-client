import React, {FC, useEffect, useMemo, useRef, useState} from 'react';
import {observer} from 'mobx-react-lite';
import cn from 'classnames';

import {IconSvg, Text, useResize, useScroll} from 'ui-kit';
import {AgoraRemoteUserInterface} from 'core/models';
import {ReactComponent as Astronaut} from 'ui-kit/assets/images/common/astronaut.svg';

import {UserMenu} from './components';
import * as styled from './MeetingUser.styled';

export interface PropsInterface {
  spaceId: string;
  user: AgoraRemoteUserInterface;
  isModerator: boolean;
  maxVideoStreams: boolean;
  onMuteUser: (spaceId: string, userId: string | number) => void;
  onKickUser: (spaceId: string, userId: string | number) => void;
  usersListUpdated: number;
}

const MeetingUser: FC<PropsInterface> = (props) => {
  const {spaceId, user, isModerator, maxVideoStreams, onKickUser, onMuteUser, usersListUpdated} =
    props;

  const [isMenuShown, setIsMenuShown] = useState<boolean>(false);
  const [coords, setCoords] = useState({left: 0, top: 0, width: 0});

  const videoRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    user.fetchUser();
  }, [user]);

  useEffect(() => {
    updateTooltipCoords();
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
      updateTooltipCoords();
      setIsMenuShown(true);
    }
  };

  const isTalking: boolean = useMemo(() => {
    return (user.soundLevel || 0) > 3;
  }, [user.soundLevel]);

  const updateTooltipCoordsOnScroll = () => {
    setIsMenuShown(false);
  };

  const updateTooltipCoords = () => {
    const rect = menuRef?.current?.getBoundingClientRect();
    if (rect) {
      setCoords({left: rect.x - 182, top: rect.y - 7, width: rect.width});
    }
  };

  useScroll(menuRef, updateTooltipCoordsOnScroll);
  useResize(menuRef, updateTooltipCoords);

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

      {isMenuShown && (
        <UserMenu
          user={user}
          onMuteUser={() => onMuteUser(spaceId, user.uid)}
          onKickUser={() => onKickUser(spaceId, user.uid)}
          onClose={() => setIsMenuShown(false)}
          coords={coords}
        />
      )}
    </styled.UserListItem>
  );
};

export default observer(MeetingUser);
