import {ILocalVideoTrack, IRemoteVideoTrack} from 'agora-rtc-sdk-ng';
import React, {useEffect, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import cn from 'classnames';
import {observer} from 'mobx-react-lite';

import {IconSvg, Text} from 'ui-kit';
import {UserProfileModelInterface, AgoraRemoteUserInterface} from 'core/models';

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
          {remoteUser?.avatarSrc || currentUser?.avatarSrc ? (
            <styled.Avatar
              src={remoteUser ? remoteUser?.avatarSrc : currentUser?.avatarSrc}
              alt={remoteUser ? remoteUser?.name : currentUser?.name}
            />
          ) : (
            <IconSvg name="astro" size="huge" />
          )}
        </styled.AvatarContainer>
      )}
      <styled.InfoContainer>
        <styled.Info>
          {remoteUser ? (
            <Text text={remoteUser?.name} size="xs" />
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

export default observer(MediaPlayer);
