import AgoraRTC, {
  ConnectionDisconnectedReason,
  ConnectionState,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  ILocalAudioTrack,
  ILocalVideoTrack,
  IMicrophoneAudioTrack
} from 'agora-rtc-sdk-ng';
import {useCallback, useContext, useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';

import {request} from 'api/request';
import {ROUTES} from 'core/constants';

import useContextAuth from '../../context/Auth/hooks/useContextAuth';
import {AgoraContext} from '../../context/AgoraContext';
import CONFIG from '../../config/config';
import useWebsocketEvent from '../../context/Websocket/hooks/useWebsocketEvent';
import useCollaboration from '../../context/Collaboration/hooks/useCollaboration';
import {ParticipantRole} from '../../context/Collaboration/CollaborationTypes';
import {
  COLLABORATION_IS_TOGGLING_CAMERA_ACTION_UPDATE,
  COLLABORATION_IS_TOGGLING_MUTE_ACTION_UPDATE,
  COLLABORATION_MUTED_ACTION_UPDATE
} from '../../context/Collaboration/CollaborationReducer';

import {useStageClient} from './useAgoraClient';

export const useAgoraStageMode = () => {
  const {authState} = useContextAuth();
  const {
    appId,
    getMicrophoneConsent,
    getCameraConsent,
    microphoneConsent,
    cameraConsent,
    isOnStage,
    setIsOnStage,
    stageModeUsers,
    setStageModeUsers,
    joinedStage,
    setJoinedStage,
    setScreenShare
  } = useContext(AgoraContext);
  const {collaborationState, collaborationDispatch, currentUserId} = useCollaboration();
  const history = useHistory();
  const client = useStageClient();
  const [localVideoTrack] = useState<ILocalVideoTrack | undefined>(undefined);
  const [localAudioTrack] = useState<ILocalAudioTrack | undefined>(undefined);
  const [lowQualityEnabled, setLowQualityEnabled] = useState<boolean>(false);
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);

  const clientRoleOptions = {
    // Set latency level to low latency
    level: 1
  };

  const leaveStage = useCallback(async () => {
    if (client) {
      // @ts-ignore
      client.localTracks.forEach((localTrack) => {
        localTrack.setEnabled(false);
        // localTrack.stop();
        // localTrack.close();
      });
      await client.unpublish();
      await client.setClientRole('audience', clientRoleOptions);
      setIsOnStage(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

  const leave = useCallback(async () => {
    if (client) {
      console.info('[agora][STAGEMODE] Leave stage mode');

      client.localTracks.forEach((localTrack) => {
        localTrack.setEnabled(false);
        localTrack.stop();
        localTrack.close();
      });

      await client.leave();
      setRemoteUsers([]);
      setJoinedStage(false);
      setIsOnStage(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

  const updateStageUsers = (userId: string) => {
    setStageModeUsers(
      stageModeUsers.map((user) => ({
        uid: user.uid,
        role: user.uid === userId ? ParticipantRole.AUDIENCE_MEMBER : user.role
      }))
    );
  };

  useWebsocketEvent('stage-mode-kick', (userId) => {
    //if (spaceId !== collaborationState.collaborationSpace?.id) return;

    if (userId !== currentUserId) {
      updateStageUsers(userId);
    } else {
      leaveStage().then(() => {
        updateStageUsers(userId);
      });
    }
  });

  useWebsocketEvent('stage-mode-mute', () => {
    collaborationDispatch({
      type: COLLABORATION_MUTED_ACTION_UPDATE,
      muted: true
    });
  });

  useWebsocketEvent('stage-mode-user-joined', (userId) => {
    //if (spaceId !== collaborationState.collaborationSpace?.id) return;
    if (stageModeUsers.filter((user) => user.uid === userId).length !== 0) {
      return;
    }
    if (userId === currentUserId) {
      return;
    }

    setStageModeUsers([
      ...stageModeUsers,
      {
        uid: userId,
        role: ParticipantRole.AUDIENCE_MEMBER
      }
    ]);
  });

  useWebsocketEvent('stage-mode-user-left', (userId) => {
    //if (spaceId !== collaborationState.collaborationSpace?.id) return;

    setStageModeUsers(stageModeUsers.filter((user) => user.uid !== userId));
  });

  const createLocalTracks = useCallback(async (): Promise<
    [IMicrophoneAudioTrack, ICameraVideoTrack]
  > => {
    if (!microphoneConsent) {
      await getMicrophoneConsent();
    }

    const microphoneTrack = await AgoraRTC.createMicrophoneAudioTrack({
      microphoneId: collaborationState.audioDevice?.deviceId
    });

    if (collaborationState.videoDevice?.deviceId && !cameraConsent) {
      await getCameraConsent();
    }

    const cameraTrack = await AgoraRTC.createCameraVideoTrack({
      cameraId: collaborationState.videoDevice?.deviceId,
      facingMode: 'user',
      // https://docs.agora.io/en/Agora%20Platform/video_profile_web_ng?platform=Web#recommended-video-profiles
      encoderConfig: '480p_1'
    });

    return [microphoneTrack, cameraTrack];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setStageModeUsers(
      stageModeUsers.map((user) => ({
        uid: user.uid,
        role:
          remoteUsers.filter((remoteUser) => remoteUser.uid === user.uid).length === 0
            ? ParticipantRole.AUDIENCE_MEMBER
            : ParticipantRole.SPEAKER
      }))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remoteUsers]);

  useEffect(() => {
    console.info('[STAGEMODE] connectionstate', client.connectionState);
    if (client.connectionState === 'CONNECTED') {
      setJoinedStage(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const join = useCallback(
    async (channel: string) => {
      if (client) {
        try {
          await client.setClientRole('audience', clientRoleOptions);

          const tokenResponse = await request.get(
            window._env_.BACKEND_ENDPOINT_URL + `/agora/token/stage-${channel}`
          );

          console.info('[STAGEMODE] Got token response: ', tokenResponse);
          console.info('[STAGEMODE] auth: ', authState);

          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          await client.join(appId, 'stage-' + channel, tokenResponse.data, authState.subject);

          setJoinedStage(true);
          setRemoteUsers(client.remoteUsers);
          console.info('[agora][STAGEMODE] Joining Channel', client);
        } catch (error) {
          console.error('[agora][STAGEMODE] Error joining Channel', error);
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [clientRoleOptions, appId, authState.subject]
  );

  const enterStage = useCallback(async () => {
    if (client) {
      try {
        console.info('[agora][STAGEMODE] Enter stage, change client role');
        await client.setClientRole('host');

        const [microphoneTrack, cameraTrack] = await createLocalTracks();

        microphoneTrack.setEnabled(!collaborationState.muted).then();
        cameraTrack?.setEnabled(!collaborationState.cameraOff).then();

        await client.publish([microphoneTrack, cameraTrack]);
        setIsOnStage(true);
        setRemoteUsers(client.remoteUsers);

        console.info('[agora][STAGEMODE] Entering Stage', client);
      } catch (error) {
        console.error('[agora][STAGEMODE] Error joining Channel', error);
        throw error;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientRoleOptions, appId, authState.subject]);

  useEffect(() => {
    if (!client) {
      return;
    }

    setRemoteUsers(() =>
      Array.from(
        client.remoteUsers.filter((item) => {
          return (item.uid as string).split('|')[0] !== 'ss';
        })
      )
    );

    const handleUserPublished = async (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
      console.info('[STAGEMODE] handleUserpublished ');

      await client.subscribe(user, mediaType);
      setRemoteUsers(() => Array.from(client.remoteUsers));
      const isScreenshare = (user?.uid as string).split('|')[0] === 'ss';
      if (isScreenshare) {
        console.info('[STAGEMODE] ISSCREENSHARE', isScreenshare);
        setScreenShare(user?.videoTrack ? user?.videoTrack : null);
      }
    };
    const handleUserUnpublished = (user: IAgoraRTCRemoteUser) => {
      console.info('[STAGEMODE] handleUserUnpublished: ', user.uid);

      setRemoteUsers(() =>
        Array.from(
          client.remoteUsers.filter((item) => {
            return (item.uid as string).split('|')[0] !== 'ss';
          })
        )
      );
    };
    const handleUserJoined = (user: IAgoraRTCRemoteUser) => {
      console.info('[STAGEMODE] handleUserJoined ');
      const isScreenshare = (user?.uid as string).split('|')[0] === 'ss';
      if (isScreenshare) {
        history.push({pathname: ROUTES.screenShare});
        setScreenShare(user?.videoTrack ? user?.videoTrack : null);
      }

      setRemoteUsers(() => Array.from(client.remoteUsers));
    };
    const handleUserLeft = (user: IAgoraRTCRemoteUser) => {
      console.info('[STAGEMODE] handleUserLeft ');
      setRemoteUsers(() => Array.from(client.remoteUsers));

      const userId = user?.uid as string;
      const isScreenshare = userId.split('|')[0] === 'ss';
      if (isScreenshare) {
        console.info('[STAGEMODE] ISSCREENSHARE', isScreenshare);
        setScreenShare(null);
      }
    };

    const handleConnectionStateChange = (
      curState: ConnectionState,
      revState: ConnectionState,
      reason?: ConnectionDisconnectedReason
    ) => {
      console.info('[STAGEMODE] handleConnectionStateChange ', curState, revState, reason);
    };
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    client.on('user-published', handleUserPublished);
    client.on('user-unpublished', handleUserUnpublished);
    client.on('user-joined', handleUserJoined);
    client.on('user-left', handleUserLeft);
    client.on('connection-state-change', handleConnectionStateChange);

    return () => {
      console.info('[agora][STAGEMODE] Cleaning up AgoraRTM client');
      client.removeAllListeners();
    };
  }, [client]);

  useEffect(() => {
    if (!client) {
      return;
    }

    client.remoteUsers.forEach((user: IAgoraRTCRemoteUser) => {
      client.setRemoteVideoStreamType(user.uid, lowQualityEnabled ? 1 : 0).then();
    });
  }, [client, lowQualityEnabled]);

  useEffect(() => {
    if (!collaborationState.stageMode) {
      leave().then();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collaborationState.stageMode]);

  const canEnterStage = useCallback(() => {
    if (!client) {
      return false;
    }

    return client.remoteUsers.length + (isOnStage ? 1 : 0) < CONFIG.video.MAX_STAGE_USERS;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remoteUsers, isOnStage]);

  const toggleQuality = useCallback(async () => {
    setLowQualityEnabled(!lowQualityEnabled);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

  const updateMuteTogglingState = (state = false) => {
    collaborationDispatch({
      type: COLLABORATION_IS_TOGGLING_MUTE_ACTION_UPDATE,
      isTogglingMute: state
    });
  };

  const updateCameraTogglingState = (state = false) => {
    collaborationDispatch({
      type: COLLABORATION_IS_TOGGLING_CAMERA_ACTION_UPDATE,
      isTogglingCamera: state
    });
  };

  useEffect(() => {
    if (client.localTracks.length === 0) {
      updateMuteTogglingState(false);
    }
    client.localTracks.forEach((localTrack) => {
      if (localTrack.trackMediaType === 'audio') {
        localTrack.setEnabled(!collaborationState.muted).then(() => {
          updateMuteTogglingState(false);
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collaborationState.muted]);

  useEffect(() => {
    console.info('cam off true');
    if (client.localTracks.length === 0) {
      updateCameraTogglingState(false);
    }
    client.localTracks.forEach((localTrack) => {
      if (localTrack.trackMediaType === 'video') {
        localTrack.setEnabled(!collaborationState.cameraOff).then(() => {
          updateCameraTogglingState(false);
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collaborationState.cameraOff]);

  return {
    join,
    enterStage,
    leaveStage,
    leave,
    canEnterStage,
    joinedStage,
    isOnStage,
    toggleQuality,
    lowQualityEnabled,
    createLocalTracks,
    localAudioTrack,
    localVideoTrack,
    remoteUsers,
    stageModeUsers,
    setStageModeUsers
  };
};
