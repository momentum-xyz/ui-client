import {ILocalVideoTrack, IRemoteVideoTrack} from 'agora-rtc-sdk-ng';
import React, {useEffect, useMemo, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import cn from 'classnames';

import {AgoraRemoteUserInterface} from 'stores/MainStore/models/AgoraStore/models';
import {IconSvg, Text} from 'ui-kit';
import {UserProfileModelInterface} from 'core/models';

import * as styled from './MediaPlayer.styled';

export interface VideoPlayerPropsInterface {
  remoteUser?: AgoraRemoteUserInterface;
  videoTrack: ILocalVideoTrack | IRemoteVideoTrack | undefined;
  isCameraOff?: boolean;
  isMuted?: boolean;
  soundLevel?: number;
  currentUser?: UserProfileModelInterface;
  loadCurrentUserProfile: () => void;
}

const MediaPlayer: React.FC<VideoPlayerPropsInterface> = ({
  remoteUser,
  videoTrack,
  isCameraOff,
  isMuted,
  soundLevel,
  currentUser,
  loadCurrentUserProfile
}) => {
  const stagevideocontainer = useRef<HTMLDivElement>(null);
  const {t} = useTranslation();

  useEffect(() => {
    if (remoteUser) {
      remoteUser.fetchUser();
    } else {
      loadCurrentUserProfile();
    }
  }, [remoteUser, loadCurrentUserProfile]);

  const name = useMemo(() => {
    return remoteUser?.name ?? currentUser?.name;
  }, [remoteUser, currentUser]);

  const avatarSrc = useMemo(() => {
    return remoteUser?.avatarSrc ?? currentUser?.avatarSrc;
  }, [remoteUser, currentUser]);

  useEffect(() => {
    if (!stagevideocontainer.current) {
      return;
    }

    videoTrack?.play(stagevideocontainer.current);

    return () => {
      videoTrack?.stop();
    };
  }, [stagevideocontainer, videoTrack]);

  return (
    <styled.Container className={cn(soundLevel && soundLevel > 5 && 'showRing')}>
      <styled.VideoContainer ref={stagevideocontainer} />
      {isCameraOff && (
        <styled.AvatarContainer>
          {avatarSrc ? (
            <styled.Avatar src={avatarSrc} alt={name} />
          ) : (
            <IconSvg name="astro" size="huge" />
          )}
        </styled.AvatarContainer>
      )}
      <styled.InfoContainer>
        <styled.Info>
          {remoteUser && name ? (
            <Text text={name} size="xs" />
          ) : (
            <Text text={t('labels.you')} size="xs" />
          )}
          {isCameraOff && <IconSvg name="cameraOff" size="medium" />}
          {isMuted && <IconSvg name="microphoneOff" size="medium" />}
        </styled.Info>
      </styled.InfoContainer>
    </styled.Container>
  );
};

export default MediaPlayer;
