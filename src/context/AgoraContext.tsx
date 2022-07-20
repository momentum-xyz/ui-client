import {IAgoraRTCClient, IRemoteVideoTrack} from 'agora-rtc-sdk-ng';
import React, {Dispatch, SetStateAction, useState} from 'react';

import {useStore} from 'shared/hooks';

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
  children: React.ReactNode;
}

export const AgoraProvider = ({children}: AgoraProviderProps) => {
  const [, setIsOnStage] = useState(false);
  const [joinedStage, setJoinedStage] = useState(false);
  const [, setScreenSharingClient] = useState<IAgoraRTCClient | null>(null);
  const [, setScreenShare] = useState<IRemoteVideoTrack | null>(null);
  const [, setStageModeUsers] = useState<StageModeUser[]>([]);
  const {agoraStore} = useStore().mainStore;

  const {userDevicesStore} = agoraStore;

  return (
    <AgoraContext.Provider
      value={{
        client: agoraStore.videoCallClient,
        stageClient: agoraStore.stageModeClient,
        setScreenShare,
        screenShare: agoraStore.screenShare ?? null,
        appId: agoraStore.appId,
        screenSharingClient: agoraStore.screenShareClient ?? null,
        setScreenSharingClient,
        microphoneConsent: userDevicesStore.microphoneConsent,
        cameraConsent: userDevicesStore.cameraConsent,
        getMicrophoneConsent: userDevicesStore.getMicrophoneConsent,
        getCameraConsent: userDevicesStore.getCameraConsent,
        isOnStage: agoraStore.isOnStage,
        setIsOnStage,
        joinedStage,
        setJoinedStage,
        stageModeUsers: agoraStore.stageModeUsers,
        setStageModeUsers
      }}
    >
      {children}
    </AgoraContext.Provider>
  );
};
