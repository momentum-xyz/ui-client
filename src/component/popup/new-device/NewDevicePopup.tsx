import React, {useCallback, useContext, useEffect, useState} from 'react';

import Popup, {PopupTitle} from '../../atoms/Popup';
import {
  COLLABORATION_AUDIO_DEVICE_ACTION_UPDATE,
  COLLABORATION_VIDEO_DEVICE_ACTION_UPDATE
} from '../../../context/Collaboration/CollaborationReducer';
import useCollaboration from '../../../context/Collaboration/hooks/useCollaboration';
import {AgoraContext} from '../../../context/AgoraContext';
import Select, {Option} from '../../atoms/input/Select';
import Button from '../../atoms/Button';

export interface NewDevicePopupProps {
  onClose: () => void;
  deviceKindDescription?: string;
  deviceLabel?: string;
}

const NewDevicePopup: React.FC<NewDevicePopupProps> = ({
  onClose,
  deviceKindDescription,
  deviceLabel
}) => {
  const {collaborationState, collaborationDispatch} = useCollaboration();
  const {getMicrophoneConsent, getCameraConsent} = useContext(AgoraContext);

  const [videoInputs, setVideoInputs] = useState<MediaDeviceInfo[]>([]);
  const [audioInputs, setAudioInputs] = useState<MediaDeviceInfo[]>([]);

  const getCommunicationDevices = () => {
    getMicrophoneConsent()
      .then((microphoneConsent) => {
        if (!microphoneConsent) {
          return;
        }
        navigator.mediaDevices.enumerateDevices().then((devices) => {
          setAudioInputs(devices.filter((device) => device.kind === 'audioinput'));
        });

        return getCameraConsent();
      })
      .then((cameraConsent) => {
        if (!cameraConsent) {
          return;
        }
        navigator.mediaDevices.enumerateDevices().then((devices) => {
          setVideoInputs(devices.filter((device) => device.kind === 'videoinput'));
        });
      });
  };

  useEffect(() => {
    getCommunicationDevices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateAudioDevice = useCallback(
    (e) => {
      const deviceId = e.target.value;
      console.info(`device id: ${deviceId as string}`);
      console.info(audioInputs);
      const device = audioInputs.find((device) => device.deviceId === deviceId);
      if (device) {
        collaborationDispatch({
          type: COLLABORATION_AUDIO_DEVICE_ACTION_UPDATE,
          audioDevice: device
        });
      }
    },
    [audioInputs, collaborationDispatch]
  );

  const updateVideoDevice = useCallback(
    (e) => {
      const deviceId = e.target.value;
      const device = videoInputs.find((device) => device.deviceId === deviceId);
      if (device) {
        collaborationDispatch({
          type: COLLABORATION_VIDEO_DEVICE_ACTION_UPDATE,
          videoDevice: device
        });
      }
    },
    [collaborationDispatch, videoInputs]
  );

  return (
    <Popup className="w-360px">
      <PopupTitle onClose={onClose}>New Device Detected</PopupTitle>
      <p>
        Momentum has detected a new {deviceKindDescription} device named{' '}
        <strong>{deviceLabel}</strong>. Do you want to switch to it?
      </p>
      <p className="uppercase font-bold pt-2">Audio device</p>
      <Select value={collaborationState.audioDevice?.deviceId} onChange={updateAudioDevice}>
        {audioInputs.map((input) => (
          <Option key={input.deviceId} value={input.deviceId}>
            {input.label}
          </Option>
        ))}
      </Select>
      <p className="uppercase font-bold pt-1">Video device</p>
      <Select value={collaborationState.videoDevice?.deviceId} onChange={updateVideoDevice}>
        {videoInputs.map((input) => (
          <Option key={input.deviceId} value={input.deviceId}>
            {input.label}
          </Option>
        ))}
      </Select>
      <div className="h-1" />
      <Button type="ghost" onClick={onClose}>
        Switch device
      </Button>
    </Popup>
  );
};

export default NewDevicePopup;
