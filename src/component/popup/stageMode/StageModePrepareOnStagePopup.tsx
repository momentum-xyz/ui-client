import React, {useContext, useEffect, useRef, useState} from 'react';

import Popup, {PopupTitle} from '../../atoms/Popup';
import Button from '../../atoms/Button';
import useCollaboration from '../../../context/Collaboration/hooks/useCollaboration';
import {AgoraContext} from '../../../context/AgoraContext';
import {
  COLLABORATION_CAMERA_OFF_ACTION_UPDATE,
  COLLABORATION_MUTED_ACTION_UPDATE
} from '../../../context/Collaboration/CollaborationReducer';
import {ReactComponent as MicOff} from '../../../images/icons/microphone-off.svg';
import {ReactComponent as MicOn} from '../../../images/icons/microphone.svg';
import {ReactComponent as CameraOff} from '../../../images/icons/camera-off.svg';
import {ReactComponent as CameraOn} from '../../../images/icons/camera.svg';
import Avatar from '../../atoms/Avatar';
import {useCurrentUser} from '../../../hooks/api/useUser';

export interface StageModePrepareOnStagePopupProps {
  onClose?: () => void;
  onReady?: () => void;
}

const StageModePrepareOnStagePopup: React.FC<StageModePrepareOnStagePopupProps> = ({
  onClose,
  onReady
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const {collaborationState, collaborationDispatch} = useCollaboration();
  const {getMicrophoneConsent, getCameraConsent} = useContext(AgoraContext);

  const [, setVideoInputs] = useState<MediaDeviceInfo[]>([]);
  const [, setAudioOutputs] = useState<MediaDeviceInfo[]>([]);
  const [, setAudioInputs] = useState<MediaDeviceInfo[]>([]);

  const [muted, setMuted] = useState(collaborationState.muted);
  const [webcamEnabled, setWebcamEnabled] = useState(!collaborationState.cameraOff);
  const [user, , ,] = useCurrentUser();

  const cleanupVideo = () => {
    const video = videoRef.current;

    if (video && video.srcObject && 'getTracks' in video.srcObject) {
      video.pause();
      video.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  const getCommunicationDevices = () => {
    getMicrophoneConsent()
      .then((microphoneConsent) => {
        if (!microphoneConsent) {return;}
        navigator.mediaDevices.enumerateDevices().then((devices) => {
          setAudioOutputs(devices.filter((device) => device.kind === 'audiooutput'));
          setAudioInputs(devices.filter((device) => device.kind === 'audioinput'));
        });

        return getCameraConsent();
      })
      .then((cameraConsent) => {
        if (!cameraConsent) {return;}
        navigator.mediaDevices.enumerateDevices().then((devices) => {
          setVideoInputs(devices.filter((device) => device.kind === 'videoinput'));
        });
      });
  };

  useEffect(() => {
    getCommunicationDevices();
    return cleanupVideo;
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webcamEnabled]);

  useEffect(() => {
    const videoDeviceId = collaborationState.videoDevice?.deviceId;

    navigator.mediaDevices.getUserMedia({video: {deviceId: videoDeviceId}}).then((mediaStream) => {
      const video = videoRef.current;
      if (video) {
        video.srcObject = mediaStream;
      }
    });
  }, [videoRef, collaborationState.audioDevice, collaborationState.videoDevice]);

  return (
    <Popup className="w-36">
      <PopupTitle>
        <p className="text-md">Prepare to go on stage</p>
      </PopupTitle>
      <div className="flex flex-col space-y-2">
        <p className="text-sm uppercase pt-1">Webcam Preview:</p>
        <div className="flex flex-col items-center">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            ref={videoRef}
            className={`object-cover rounded-full border-prime-blue-100 border-2 border-dashed overflow-hidden ${
              videoRef.current?.paused ? 'bg-black-100' : ''
            }`}
            style={{width: '200px', height: '200px'}}
          />
          {!webcamEnabled && (
            <Avatar className="absolute w-20 h-20" size="l" avatarHash={user?.profile.avatarHash} />
          )}
        </div>
        <div className="flex flex-col space-y-1">
          <p className="text-sm uppercase">Audio/ Video Settings</p>
          <div className="flex flex-col space-y-1">
            <button
              onClick={() => setWebcamEnabled(!webcamEnabled)}
              className="flex flex-row space-x-1 items-center"
            >
              {!webcamEnabled ? <CameraOff className="w-2" /> : <CameraOn className="w-2 h-2" />}
              <p className="uppercase">Camera {!webcamEnabled ? 'off' : 'on'}</p>
            </button>
            <button
              onClick={() => setMuted(!muted)}
              className="flex flex-row space-x-1 items-center"
            >
              {muted ? <MicOff className="w-2" /> : <MicOn className="w-2" />}
              <p className="uppercase">Microphone {muted ? 'off' : 'on'}</p>
            </button>
          </div>
        </div>
        <div className="flex flex-row space-x-2">
          <Button
            type="ghost"
            onClick={() => {
              if (onReady) {
                collaborationDispatch({
                  type: COLLABORATION_CAMERA_OFF_ACTION_UPDATE,
                  cameraOff: !webcamEnabled
                });
                collaborationDispatch({
                  type: COLLABORATION_MUTED_ACTION_UPDATE,
                  muted: muted
                });

                onReady();
                onClose?.();
              }
            }}
          >
            Ready
          </Button>
          <Button type="ghost-red" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Popup>
  );
};

export default StageModePrepareOnStagePopup;
