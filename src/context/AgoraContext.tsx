import {IAgoraRTCClient, IRemoteVideoTrack} from 'agora-rtc-sdk-ng';
import React, {Dispatch, SetStateAction, useCallback, useEffect, useState} from 'react';

import {useConfirmationDialog} from '../hooks/useConformationDialog';

import {ParticipantRole} from './Collaboration/CollaborationTypes';

export interface StageModeUser {
  uid: string;
  role: ParticipantRole;
}

interface AgoraContextInterface {
  client: IAgoraRTCClient;
  appId: string;
  stageClient: IAgoraRTCClient;
  screenShare: IRemoteVideoTrack | null;
  setScreenShare: (screenShare: IRemoteVideoTrack | null) => void;
  screenSharingClient: IAgoraRTCClient | null;
  setScreenSharingClient: (screenSharing: IAgoraRTCClient | null) => void;
  microphoneConsent: boolean;
  cameraConsent: boolean;
  getMicrophoneConsent: () => Promise<boolean>;
  getCameraConsent: () => Promise<boolean>;
  isOnStage: boolean;
  setIsOnStage: (isOnStage: boolean) => void;
  joinedStage: boolean;
  setJoinedStage: (isOnStage: boolean) => void;
  stageModeUsers: StageModeUser[];
  setStageModeUsers: Dispatch<SetStateAction<StageModeUser[]>>;
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const AgoraContext = React.createContext<AgoraContextInterface>(undefined!);

interface AgoraProviderProps {
  client: IAgoraRTCClient;
  stageClient: IAgoraRTCClient;
  appId: string;
  children: React.ReactNode;
}

export const AgoraProvider = ({client, stageClient, appId, children}: AgoraProviderProps) => {
  const [isOnStage, setIsOnStage] = useState(false);
  const [joinedStage, setJoinedStage] = useState(false);
  const [screenSharingClient, setScreenSharingClient] = useState<IAgoraRTCClient | null>(null);
  const [screenShare, setScreenShare] = useState<IRemoteVideoTrack | null>(null);
  const [microphoneConsent, setMicrophoneConsent] = useState(false);
  const [cameraConsent, setCameraConsent] = useState(false);
  const {getConfirmation, resetDialog} = useConfirmationDialog();
  const [stageModeUsers, setStageModeUsers] = useState<StageModeUser[]>([]);

  const getMicrophoneConsent = useCallback(async () => {
    if (microphoneConsent) {
      return true;
    } else {
      getConfirmation({
        blockInterface: true,
        title: 'Microphone access',
        message: 'Click the browser popup to give us access to your microphone'
      });
      return navigator.mediaDevices
        .getUserMedia({audio: true})
        .then(() => {
          resetDialog();
          setMicrophoneConsent(true);
          return true;
        })
        .catch(() => {
          getConfirmation({
            blockInterface: true,
            title: 'Microphone access',
            message:
              'To use Momentum you will need to give access to your microphone. Please update your settings and refresh the page'
          });
          return false;
        });
    }
  }, [microphoneConsent, getConfirmation]);

  const getCameraConsent = useCallback(async () => {
    if (cameraConsent) {
      return true;
    } else {
      const shouldNotShowCameraDialog = localStorage.getItem(`no-camera-info`);

      if (shouldNotShowCameraDialog !== null && shouldNotShowCameraDialog === 'false') {
        getConfirmation({
          blockInterface: true,
          title: 'Camera access',
          message: 'Click the browser popup to give us access to your camera'
        });
      }

      return navigator.mediaDevices
        .getUserMedia({video: true})
        .then(() => {
          resetDialog();
          setCameraConsent(true);
          return true;
        })
        .catch(() => {
          resetDialog();
          if (shouldNotShowCameraDialog === null || shouldNotShowCameraDialog === 'false') {
            getConfirmation({
              blockInterface: true,
              title: 'Camera access',
              message:
                'A camera is required for others to see you. To use your camera, please update your settings and refresh the page',
              checkBox: "Don't show me this notification again",
              onCheck: (isChecked) => {
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                localStorage.setItem('no-camera-info', `${isChecked}`);
              },
              cancelButton: 'Dismiss'
            });
          }
          return false;
        });
    }
  }, [microphoneConsent, getConfirmation]);

  useEffect(() => {
    // @ts-ignore
    getMicrophoneConsent().then((consent) => {
      if (consent) {return getCameraConsent();}
    });
  }, []);

  return (
    <AgoraContext.Provider
      value={{
        client,
        stageClient,
        setScreenShare,
        screenShare,
        appId,
        screenSharingClient,
        setScreenSharingClient,
        microphoneConsent,
        cameraConsent,
        getMicrophoneConsent,
        getCameraConsent,
        isOnStage,
        setIsOnStage,
        joinedStage,
        setJoinedStage,
        stageModeUsers,
        setStageModeUsers
      }}
    >
      {children}
    </AgoraContext.Provider>
  );
};
