/* eslint-disable react-hooks/exhaustive-deps */
import {
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
  IRemoteAudioTrack,
  IRemoteVideoTrack
} from 'agora-rtc-sdk-ng';
import {useEffect} from 'react';

import {useStore} from 'shared/hooks';

import useContextAuth from '../../context/Auth/hooks/useContextAuth';
import useCollaboration from '../../context/Collaboration/hooks/useCollaboration';

/*
 * TODO: Remove this and refactor inside the AgoraStore when Andrey refactors
 * communication layer and Collaboration.
 */

export interface ILocalUser {
  uid: string;
  cameraTrack?: ICameraVideoTrack;
  audioTrack?: IMicrophoneAudioTrack;
  soundLevel: number;
}

export interface AgoraParticipant {
  uid: string | number;
  audioTrack?: IRemoteAudioTrack;
  videoTrack?: IRemoteVideoTrack;
  hasAudio: boolean;
  hasVideo: boolean;
  soundLevel: number;
}

const useAgoraVideo = () => {
  const {agoraStore} = useStore().mainStore;

  const {authState} = useContextAuth();
  const {collaborationState} = useCollaboration();

  useEffect(() => {
    if (collaborationState.collaborationSpace?.id && collaborationState.stageMode) {
      agoraStore.leaveCall();
    } else if (collaborationState.collaborationSpace?.id) {
      if (agoraStore.spaceId !== collaborationState.collaborationSpace.id) {
        agoraStore.leaveCall().then(() => {
          if (collaborationState.collaborationSpace) {
            agoraStore.joinOrStartVideoCall(
              collaborationState.collaborationSpace.id,
              authState.subject
            );
          }
        });
      }
    } else if (collaborationState.collaborationTable?.id) {
      console.info('Table');
      if (agoraStore.spaceId !== collaborationState.collaborationSpace?.id) {
        agoraStore.leaveCall().then(() => {
          if (collaborationState.collaborationTable) {
            agoraStore.joinOrStartVideoCall(
              collaborationState.collaborationTable.id,
              authState.subject
            );
          }
        });
      }
    } else {
      if (agoraStore.connectionState === 'CONNECTED') {
        agoraStore.leaveCall();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    collaborationState.collaborationSpace,
    collaborationState.collaborationTable,
    collaborationState.stageMode
  ]);

  return {
    connectionState: agoraStore.connectionState,
    localUser: {
      uid: agoraStore.userId,
      soundLevel: agoraStore.localSoundLevel ?? 0
    } as ILocalUser,
    remoteParticipants: agoraStore.remoteUsers
  };
};

export default useAgoraVideo;
