import {ILocalVideoTrack, IRemoteVideoTrack} from 'agora-rtc-sdk-ng';
import React, {useEffect, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import cn from 'classnames';
import {observer} from 'mobx-react-lite';

import {IconSvg, Text} from 'ui-kit';
import {UserProfileModelInterface, AgoraRemoteUserInterface} from 'core/models';

import * as styled from './RemoteOrLocalUser.styled';

interface PropsInterface {
  remoteUser?: AgoraRemoteUserInterface;
  videoTrack: ILocalVideoTrack | IRemoteVideoTrack | undefined;
  isCameraOff?: boolean;
  isMuted?: boolean;
  soundLevel?: number;
  currentUser?: UserProfileModelInterface;
  loadCurrentUserProfile: () => void;
}

const RemoteOrLocalUser: React.FC<PropsInterface> = ({
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

    if (isCameraOff) {
      videoTrack?.stop();
    } else {
      videoTrack?.play(stagevideocontainer.current);
    }

    return () => {
      videoTrack?.stop();
    };
  }, [isCameraOff, stagevideocontainer, videoTrack]);

  return (
    <styled.Container
      data-testid="MediaPlayer-test"
      className={cn(soundLevel && soundLevel > 5 && 'showRing')}
    >
      <styled.VideoContainer ref={stagevideocontainer} />
      {isCameraOff && (
        <styled.AvatarContainer>
          {remoteUser?.avatarSrc && (
            <styled.Avatar src={remoteUser.avatarSrc} alt={remoteUser?.name} />
          )}
          {!remoteUser && currentUser?.avatarSrc && (
            <styled.Avatar src={currentUser.avatarSrc} alt={currentUser?.name} />
          )}
          {((remoteUser && !remoteUser?.avatarSrc) || (!remoteUser && !currentUser?.avatarSrc)) && (
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

export default observer(RemoteOrLocalUser);
