import {useEffect} from 'react';

import useContextAuth from 'context/Auth/hooks/useContextAuth';
import {useStore, usePosBusEvent} from 'shared/hooks';

// TODO: Remove and refactor after Andrey refactors Communication and Collaboration
export const useAgoraStageMode = () => {
  const {agoraStore} = useStore().mainStore;
  const {userDevicesStore} = agoraStore;
  const {authState} = useContextAuth();

  usePosBusEvent('stage-mode-kick', (userId) => {
    agoraStore.kickUserOffStage(userId);
  });

  usePosBusEvent('stage-mode-mute', () => {
    userDevicesStore.mute();
  });

  usePosBusEvent('stage-mode-user-joined', (userId) => {
    agoraStore.addStageModeUser(userId);
  });

  usePosBusEvent('stage-mode-user-left', (userId) => {
    agoraStore.removeStageModeUser(userId);
  });

  useEffect(() => {
    agoraStore.updateStageModeUsers();
    agoraStore.updateRemoteUsers();
  }, [agoraStore, agoraStore.stageModeClient.remoteUsers]);

  useEffect(() => {
    if (!agoraStore.isStageMode) {
      agoraStore.leaveStageMode();
    }
  }, [agoraStore, agoraStore.isStageMode]);

  return {
    join: (spaceId: string) => agoraStore.joinStageMode(spaceId, authState.subject),
    enterStage: agoraStore.enterStage,
    leaveStage: agoraStore.leaveStage,
    leave: agoraStore.leaveStageMode,
    canEnterStage: () => agoraStore.canEnterStage,
    isOnStage: agoraStore.isOnStage,
    joinedStage: agoraStore.isOnStage,
    toggleQuality: agoraStore.toggleQuality,
    lowQualityEnabled: agoraStore.isLowQualityModeEnabled,
    createLocalTracks: userDevicesStore.createLocalTracks,
    localAudioTrack: userDevicesStore.localAudioTrack,
    localVideoTrack: userDevicesStore.localVideoTrack,
    remoteUsers: agoraStore.remoteUsers,
    stageModeUsers: agoraStore.stageModeUsers,
    setStageModeUsers: agoraStore.setStageModeUsers
  };
};
