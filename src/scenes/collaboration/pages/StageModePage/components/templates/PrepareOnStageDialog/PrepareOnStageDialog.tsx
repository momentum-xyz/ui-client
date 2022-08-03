import React, {useEffect, useRef, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import cn from 'classnames';

import {useStore} from 'shared/hooks';
import {Avatar, Dialog, IconSvg, Text} from 'ui-kit';
import {appVariables} from 'api/constants';

import * as styled from './PrepareOnStageDialog.styled';

interface PropsInterface {
  onClose?: () => void;
  onReady?: () => void;
}

const DIALOG_WIDTH = '360px';

const PrepareOnStageDialog: React.FC<PropsInterface> = ({onClose, onReady}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const {sessionStore, mainStore} = useStore();
  const {agoraStore} = mainStore;
  const {userDevicesStore} = agoraStore;

  const {t} = useTranslation();

  const [muted, setMuted] = useState(userDevicesStore.muted);
  const [webcamEnabled, setWebcamEnabled] = useState(!userDevicesStore.cameraOff);

  const cleanupVideo = () => {
    const video = videoRef.current;

    if (video && video.srcObject && 'getTracks' in video.srcObject) {
      video.pause();
      video.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  useEffect(() => {
    return cleanupVideo;
  }, []);

  useEffect(() => {
    const video = videoRef.current;

    if (video) {
      if (webcamEnabled) {
        video.play();
      } else {
        video.pause();
      }
    }
  }, [webcamEnabled]);

  useEffect(() => {
    const videoDeviceId = userDevicesStore.currentVideoInput?.deviceId;

    navigator.mediaDevices.getUserMedia({video: {deviceId: videoDeviceId}}).then((mediaStream) => {
      const video = videoRef.current;
      if (video) {
        video.srcObject = mediaStream;
      }
    });
  }, [videoRef, userDevicesStore.currentVideoInput?.deviceId]);

  return (
    <Dialog
      title={t('titles.prepareToGoOnStage')}
      layoutSize={{width: DIALOG_WIDTH}}
      approveInfo={{
        title: t('actions.ready'),
        onClick: () => {
          if (onReady) {
            userDevicesStore.toggleCamera(!webcamEnabled);
            userDevicesStore.toggleMicrophone(muted);
            onReady();
            onClose?.();
          }
        }
      }}
      declineInfo={{
        title: t('actions.cancel'),
        onClick: () => {
          onClose?.();
        }
      }}
    >
      <styled.Body>
        <Text text={`${t('labels.webcamPreview')}:`} size="s" transform="uppercase" />
        <styled.VideoContainer>
          <styled.Video ref={videoRef} className={cn(videoRef.current?.paused && 'paused')} />
          {!webcamEnabled && (
            <Avatar
              avatarSrc={`${appVariables.RENDER_SERVICE_URL}/get/${sessionStore.profile?.profile?.avatarHash}`}
              size="extra-large"
            />
          )}
        </styled.VideoContainer>
        <styled.AudioVideoSettingsContainer>
          <Text text={t('labels.audioVideoSettings')} size="s" transform="uppercase" />
          <styled.AudioVideoSettings>
            <styled.AudioVideoButton onClick={() => setWebcamEnabled(!webcamEnabled)}>
              <IconSvg name={webcamEnabled ? 'cameraOn' : 'cameraOff'} size="medium-large" />
              <Text text={webcamEnabled ? t('labels.cameraOn') : t('labels.cameraOff')} size="m" />
            </styled.AudioVideoButton>
            <styled.AudioVideoButton onClick={() => setMuted(!muted)}>
              <IconSvg name={muted ? 'microphoneOff' : 'microphoneOn'} size="medium-large" />
              <Text text={muted ? t('labels.microphoneOff') : t('labels.microphoneOn')} size="m" />
            </styled.AudioVideoButton>
          </styled.AudioVideoSettings>
        </styled.AudioVideoSettingsContainer>
      </styled.Body>
    </Dialog>
  );
};

export default observer(PrepareOnStageDialog);
