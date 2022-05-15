import React, {useCallback, useContext, useEffect, useState} from 'react';

import {AgoraContext} from '../../context/AgoraContext';
import {
  COLLABORATION_AUDIO_DEVICE_ACTION_UPDATE,
  COLLABORATION_VIDEO_DEVICE_ACTION_UPDATE
} from '../../context/Collaboration/CollaborationReducer';
import useCollaboration from '../../context/Collaboration/hooks/useCollaboration';
import Button from '../atoms/Button';
import Select, {Option} from '../atoms/input/Select';
import {PanelTitle} from '../atoms/Panel';
import Popup from '../atoms/Popup';

export interface CommunicationSettingsPopupProps {
  onClose?: () => void;
}

const CommunicationSettingsPopup: React.FC<CommunicationSettingsPopupProps> = ({onClose}) => {
  const {collaborationState, collaborationDispatch} = useCollaboration();
  const {getMicrophoneConsent} = useContext(AgoraContext);

  const [videoInputs, setVideoInputs] = useState<MediaDeviceInfo[]>([]);
  const [audioInputs, setAudioInputs] = useState<MediaDeviceInfo[]>([]);

  const getCommunicationDevices = () => {
    getMicrophoneConsent().then((consent) => {
      if (!consent) {return;}
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        setVideoInputs(devices.filter((device) => device.kind === 'videoinput'));
        setAudioInputs(devices.filter((device) => device.kind === 'audioinput'));
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
      const device = audioInputs.find((device) => device.deviceId === deviceId);
      if (device)
        {collaborationDispatch({
          type: COLLABORATION_AUDIO_DEVICE_ACTION_UPDATE,
          audioDevice: device
        });}
    },
    [audioInputs, collaborationDispatch]
  );

  const updateVideoDevice = useCallback(
    (e) => {
      const deviceId = e.target.value;
      const device = videoInputs.find((device) => device.deviceId === deviceId);
      if (device)
        {collaborationDispatch({
          type: COLLABORATION_VIDEO_DEVICE_ACTION_UPDATE,
          videoDevice: device
        });}
    },
    [collaborationDispatch, videoInputs]
  );

  return (
    <Popup className="flex flex-col">
      <PanelTitle>Communication Settings</PanelTitle>
      <label className="uppercase pb-.5 font-bold font-sans text-xs tracking-widest">
        MICROPHONE
      </label>
      <Select value={collaborationState.audioDevice?.deviceId} onChange={updateAudioDevice}>
        {audioInputs.map((input) => (
          <Option key={input.deviceId} value={input.deviceId}>
            {input.label}
          </Option>
        ))}
      </Select>

      <label className="uppercase pb-.5 font-bold font-sans text-xs tracking-widest">
        CAMERA INPUT
      </label>
      <Select value={collaborationState.videoDevice?.deviceId} onChange={updateVideoDevice}>
        {videoInputs.map((input) => (
          <Option key={input.deviceId} value={input.deviceId}>
            {input.label}
          </Option>
        ))}
      </Select>

      <div className="mt-2">
        <Button type="primary" onClick={onClose}>
          Save and continue
        </Button>
      </div>
    </Popup>
  );
};

export default CommunicationSettingsPopup;
