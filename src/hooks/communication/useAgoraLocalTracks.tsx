import AgoraRTC, {ICameraVideoTrack, ILocalTrack, IMicrophoneAudioTrack} from 'agora-rtc-sdk-ng';
import {useCallback, useContext, useEffect, useRef, useState} from 'react';

import {AgoraContext} from '../../context/AgoraContext';
import {
  COLLABORATION_AUDIO_DEVICE_ACTION_UPDATE,
  COLLABORATION_IS_TOGGLING_CAMERA_ACTION_UPDATE,
  COLLABORATION_IS_TOGGLING_MUTE_ACTION_UPDATE,
  COLLABORATION_VIDEO_DEVICE_ACTION_UPDATE
} from '../../context/Collaboration/CollaborationReducer';
import useCollaboration from '../../context/Collaboration/hooks/useCollaboration';

import {useAgoraClient} from './useAgoraClient';

export const useAgoraLocalTracks = () => {
  const client = useAgoraClient();
  const {microphoneConsent, cameraConsent} = useContext(AgoraContext);
  const {collaborationState, collaborationDispatch} = useCollaboration();

  const [localVideoTrack, setLocalVideoTrack] = useState<ILocalTrack>();
  const [localAudioTrack, setLocalAudioTrack] = useState<ILocalTrack>();

  const getDefaultCamera = useCallback(async () => {
    const preferredVideoTrack = await navigator.mediaDevices
      .enumerateDevices()
      .then((devices) =>
        devices.find((item) => item.deviceId === localStorage.getItem('video-track'))
      );
    if (preferredVideoTrack) {
      collaborationDispatch({
        type: COLLABORATION_VIDEO_DEVICE_ACTION_UPDATE,
        videoDevice: preferredVideoTrack
      });
      return preferredVideoTrack;
    } else {
      const initialDevice = await AgoraRTC.getCameras()
        .then((devices) => {
          return devices[0];
        })
        .catch((e) => {
          console.error('get devices error!', e);
        });
      if (initialDevice) {
        collaborationDispatch({
          type: COLLABORATION_VIDEO_DEVICE_ACTION_UPDATE,
          videoDevice: initialDevice
        });
        return initialDevice;
      }
      return null;
    }
  }, [collaborationDispatch]);

  const getDefaultMicrophone = useCallback(async () => {
    const preferredAudioTrack = await navigator.mediaDevices
      .enumerateDevices()
      .then((devices) =>
        devices.find((item) => item.deviceId === localStorage.getItem('audio-track'))
      );
    if (preferredAudioTrack) {
      collaborationDispatch({
        type: COLLABORATION_AUDIO_DEVICE_ACTION_UPDATE,
        audioDevice: preferredAudioTrack
      });
      return preferredAudioTrack;
    } else {
      const initialDevice = await AgoraRTC.getMicrophones()
        .then((devices) => {
          return devices[0];
        })
        .catch((e) => {
          console.error('get devices error!', e);
        });
      if (initialDevice) {
        collaborationDispatch({
          type: COLLABORATION_AUDIO_DEVICE_ACTION_UPDATE,
          audioDevice: initialDevice
        });
        return initialDevice;
      }
      return null;
    }
  }, [collaborationDispatch]);

  const cleanupTracks = useCallback(() => {
    client.localTracks.forEach((localTrack) => {
      localTrack.close();
    });
    setLocalVideoTrack(undefined);
    setLocalAudioTrack(undefined);
  }, [client.localTracks]);

  const updateMuteTogglingState = (state = false) => {
    if (collaborationState.stageMode) {return;}
    collaborationDispatch({
      type: COLLABORATION_IS_TOGGLING_MUTE_ACTION_UPDATE,
      isTogglingMute: state
    });
  };

  const updateCameraTogglingState = (state = false) => {
    if (collaborationState.stageMode) {return;}
    collaborationDispatch({
      type: COLLABORATION_IS_TOGGLING_CAMERA_ACTION_UPDATE,
      isTogglingCamera: state
    });
  };

  const creatingVideoTrack = useRef(false);
  const createVideoTrack = async () => {
    if (client.connectionState === 'CONNECTED' && !localVideoTrack && !creatingVideoTrack.current) {
      creatingVideoTrack.current = true;
      const cameraDevice = collaborationState.videoDevice || (await getDefaultCamera());
      try {
        const publishedCameraTrack = await AgoraRTC.createCameraVideoTrack({
          cameraId: cameraDevice?.deviceId,
          facingMode: 'user',
          // https://docs.agora.io/en/Agora%20Platform/video_profile_web_ng?platform=Web#recommended-video-profiles
          encoderConfig: '240p_1'
        });
        await client.publish(publishedCameraTrack);
        setLocalVideoTrack(publishedCameraTrack);
        creatingVideoTrack.current = false;
      } catch (e) {
        creatingVideoTrack.current = false;
      }
    }
  };

  const creatingAudioTrack = useRef(false);
  const createAudioTrack = async () => {
    if (client.connectionState === 'CONNECTED' && !localAudioTrack && !creatingAudioTrack.current) {
      creatingAudioTrack.current = true;
      const audioDevice = collaborationState.audioDevice || (await getDefaultMicrophone());
      try {
        const audioTrack = await AgoraRTC.createMicrophoneAudioTrack({
          microphoneId: audioDevice?.deviceId
        });
        await client.publish(audioTrack);
        setLocalAudioTrack(audioTrack);
        creatingAudioTrack.current = false;
      } catch (e) {
        creatingAudioTrack.current = false;
      }
    }
  };

  useEffect(() => {
    if (!localAudioTrack) {
      updateMuteTogglingState(false);
      if (!collaborationState.muted) {
        createAudioTrack().then(() => updateMuteTogglingState(false));
      } else {
        updateMuteTogglingState(false);
      }
    }

    localAudioTrack?.setEnabled(!collaborationState.muted).then(() => {
      updateMuteTogglingState(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collaborationState.muted]);

  useEffect(() => {
    if (!localVideoTrack) {
      if (!collaborationState.cameraOff) {
        createVideoTrack().then(() => updateCameraTogglingState(false));
      } else {
        updateCameraTogglingState(false);
      }
    } else {
      localVideoTrack
        ?.setEnabled(!collaborationState.cameraOff)
        .then(() => {
          //enable camera mute button
          updateCameraTogglingState(false);
        })
        .catch(() => {
          updateCameraTogglingState(false);
        });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collaborationState.cameraOff]);

  useEffect(() => {
    if (cameraConsent) {
      (async () => {
        const cameraTrack = client.localTracks.find(
          (track) => track.trackMediaType === 'video'
        ) as ICameraVideoTrack;
        const cameraDevice = collaborationState.videoDevice || (await getDefaultCamera());
        if (cameraTrack) {
          if (cameraDevice && cameraDevice.label !== cameraTrack.getTrackLabel()) {
            // console.info(
            //   'agora new audio device update track',
            //   cameraDevice.deviceId,
            //   cameraTrack,
            // );
            localStorage.setItem('video-track', cameraDevice.deviceId);
            cameraTrack.setDevice(cameraDevice.deviceId).then();
          }
        } else {
          console.info('[CAMMUTE] NO CAMERA TRACK:', client.connectionState);
          if (!collaborationState.cameraOff) {
            await createVideoTrack();
          }
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collaborationState.videoDevice, client.connectionState]);

  useEffect(() => {
    if (microphoneConsent) {
      (async () => {
        const audioTrack = client.localTracks.find(
          (track) => track.trackMediaType === 'audio'
        ) as IMicrophoneAudioTrack;
        const audioDevice = collaborationState.audioDevice || (await getDefaultMicrophone());
        if (audioTrack) {
          if (audioDevice && audioDevice.label !== audioTrack.getTrackLabel()) {
            // console.info(
            //   'agora new audio device update track',
            //   audioDevice.deviceId,
            //   audioTrack,
            // );
            localStorage.setItem('audio-track', audioDevice.deviceId);
            audioTrack.setDevice(audioDevice.deviceId).then();
          }
        } else {
          if (!collaborationState.muted) {
            await createAudioTrack();
          }
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collaborationState.audioDevice, client.connectionState]);

  return {cleanupTracks};
};
