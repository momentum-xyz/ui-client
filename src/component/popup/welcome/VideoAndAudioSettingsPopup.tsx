import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';

import useCollaboration from '../../../context/Collaboration/hooks/useCollaboration';
import {AgoraContext} from '../../../context/AgoraContext';
import {
  COLLABORATION_AUDIO_DEVICE_ACTION_UPDATE,
  COLLABORATION_VIDEO_DEVICE_ACTION_UPDATE
} from '../../../context/Collaboration/CollaborationReducer';
import {PopupTitle} from '../../atoms/Popup';
import Select, {Option} from '../../atoms/input/Select';
import Button from '../../atoms/Button';

export interface VideoAndAudioSettingsPopupProps {
  onPrevious?: () => void;
  onNext?: () => void;
  onClose?: () => void;
}

const VideoAndAudioSettingsPopup: React.FC<VideoAndAudioSettingsPopupProps> = ({
  onPrevious,
  onNext,
  onClose
}) => {
  const {collaborationState, collaborationDispatch} = useCollaboration();
  const {getMicrophoneConsent, getCameraConsent} = useContext(AgoraContext);

  const [videoInputs, setVideoInputs] = useState<MediaDeviceInfo[]>([]);
  const [audioOutputs, setAudioOutputs] = useState<MediaDeviceInfo[]>([]);
  const [audioInputs, setAudioInputs] = useState<MediaDeviceInfo[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const pauseVideo = () => {
    const video = videoRef.current;

    if (video && video.srcObject && 'getTracks' in video.srcObject) {
      video.pause();
      video.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  const getCommunicationDevices = () => {
    getMicrophoneConsent()
      .then((microphoneConsent) => {
        if (!microphoneConsent) {
          return;
        }
        navigator.mediaDevices.enumerateDevices().then((devices) => {
          setAudioOutputs(devices.filter((device) => device.kind === 'audiooutput'));
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
    return pauseVideo;
  }, []);

  useEffect(() => {
    const videoDeviceId = collaborationState.videoDevice?.deviceId;

    // @ts-ignore
    navigator.mediaDevices.getUserMedia({video: {deviceId: videoDeviceId}}).then((mediaStream) => {
      const video = videoRef.current;
      if (video) {
        video.srcObject = mediaStream;
        return video.play();
      }
    });
  }, [videoRef, audioRef, collaborationState.audioDevice, collaborationState.videoDevice]);

  const updateAudioDevice = useCallback(
    (e) => {
      const deviceId = e.target.value;
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

  const updateAudioOutputDevice = useCallback(() => {
    /*const deviceId = e.target.value;
      const device = audioOutputs.find((device) => device.deviceId === deviceId);

      if (device) {
      }
      // collaborationDispatch({
      //   type: COLLABORATION_AUDIO_DEVICE_ACTION_UPDATE,
      //   audioDevice: device,
      // });*/
  }, []);

  const updateVideoDevice = useCallback(
    (e) => {
      const deviceId = e.target.value;
      const device = videoInputs.find((device) => device.deviceId === deviceId);
      if (device) {
        collaborationDispatch({
          type: COLLABORATION_VIDEO_DEVICE_ACTION_UPDATE,
          videoDevice: device
        });

        // @ts-ignore
        navigator.mediaDevices.getUserMedia({video: {deviceId: deviceId}}).then((mediaStream) => {
          const video = videoRef.current;
          if (video) {
            video.srcObject = mediaStream;
            return video.play();
          }
        });
      }
    },
    [collaborationDispatch, videoInputs]
  );

  return (
    <div className="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 fixed flex flex-row space-x-0">
      <div className="p-4 self-center">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <audio ref={audioRef} />
        <div
          className={
            'mb-1 rounded-full bg-white-20 border-2 border-prime-blue-100 flex items-center overflow-hidden relative' +
            (audioRef.current?.volume && audioRef.current?.volume > 4 ? ' ring-4' : '')
          }
          style={{width: '260px', height: '260px'}}
        >
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video ref={videoRef} className="absolute object-cover h-full w-full overflow-hidden" />
        </div>
      </div>
      <div className="gradient-border bg-gradient-dark-blue-black-50 rounded relative p-4 w-360px flex-shrink-0">
        <PopupTitle onClose={onClose}>Audio & Video Settings</PopupTitle>
        <p className="pb-2">
          Please choose your prefered microphone, camera, speakers and microphone to use within
          Momentum.
        </p>
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
          SPEAKERS
        </label>
        <Select
          value={collaborationState.speakerDevice?.deviceId}
          onChange={updateAudioOutputDevice}
        >
          {audioOutputs.map((input) => (
            <Option key={input.deviceId} value={input.deviceId}>
              {input.label}
            </Option>
          ))}
        </Select>

        <label className="uppercase pb-.5 font-bold font-sans text-xs tracking-widest">
          CAMERA
        </label>
        <Select value={collaborationState.videoDevice?.deviceId} onChange={updateVideoDevice}>
          {videoInputs.map((input) => (
            <Option key={input.deviceId} value={input.deviceId}>
              {input.label}
            </Option>
          ))}
        </Select>

        <div className="flex justify-between mt-2 space-x-2">
          <Button type="ghost" onClick={onPrevious}>
            previous
          </Button>
          <Button type="primary" onClick={onNext}>
            next
          </Button>
        </div>
      </div>
      <div className="p-4 flex-shrink-0">
        <img alt="" src="img/flamingo.png" style={{width: 83, height: 210}} />
      </div>
    </div>
  );
};

export default VideoAndAudioSettingsPopup;
