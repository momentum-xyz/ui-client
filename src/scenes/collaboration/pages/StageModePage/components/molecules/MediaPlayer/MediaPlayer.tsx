import {ILocalVideoTrack, IRemoteVideoTrack} from 'agora-rtc-sdk-ng';
import React, {useEffect, useMemo, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import cn from 'classnames';

import {AgoraRemoteUserInterface} from 'stores/MainStore/models/AgoraStore/models';
import {useStore} from 'shared/hooks';
import {IconSvg, Text} from 'ui-kit';

import * as styled from './MediaPlayer.styled';

export interface VideoPlayerPropsInterface {
  remoteUser?: AgoraRemoteUserInterface;
  videoTrack: ILocalVideoTrack | IRemoteVideoTrack | undefined;
  isCameraOff?: boolean;
  isMuted?: boolean;
  soundLevel?: number;
}

const MediaPlayer: React.FC<VideoPlayerPropsInterface> = ({
  remoteUser,
  videoTrack,
  isCameraOff,
  isMuted,
  soundLevel
}) => {
  const {sessionStore} = useStore();
  const stagevideocontainer = useRef<HTMLDivElement>(null);
  const {t} = useTranslation();

  useEffect(() => {
    if (remoteUser) {
      remoteUser.fetchUser();
    } else {
      sessionStore.loadUserProfile();
    }
  }, [remoteUser, sessionStore]);

  const name = useMemo(() => {
    return remoteUser?.name ?? sessionStore.profile?.name;
  }, [remoteUser, sessionStore.profile?.name]);

  const avatarSrc = useMemo(() => {
    return remoteUser?.avatarSrc ?? sessionStore.profile?.avatarSrc;
  }, [remoteUser, sessionStore.profile]);

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
        {remoteUser && name ? (
          <Text text={name} size="xs" />
        ) : (
          <Text text={t('labels.you')} size="xs" />
        )}
        {isCameraOff && <IconSvg name="cameraOff" size="medium" />}
        {isMuted && <IconSvg name="microphoneOff" size="medium" />}
      </styled.InfoContainer>
    </styled.Container>
  );
};

export default MediaPlayer;
