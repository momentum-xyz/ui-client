/* eslint-disable react-hooks/exhaustive-deps */
import {
  ConnectionState,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
  IRemoteAudioTrack,
  IRemoteVideoTrack
} from 'agora-rtc-sdk-ng';
import {useCallback, useContext, useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';

import {request} from 'api/request';
import {ROUTES} from 'core/constants';

import {AgoraContext} from '../../context/AgoraContext';
import useContextAuth from '../../context/Auth/hooks/useContextAuth';
import {
  COLLABORATION_ENABLED_ACTION_UPDATE,
  COLLABORATION_LOADING_UPDATE
} from '../../context/Collaboration/CollaborationReducer';
import useCollaboration from '../../context/Collaboration/hooks/useCollaboration';

import {useAgoraClient} from './useAgoraClient';
import {useAgoraEvents} from './useAgoraEvents';
import {useAgoraLocalTracks} from './useAgoraLocalTracks';
import {useAgoraScreenShare} from './useAgoraScreenShare';

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
  const client = useAgoraClient();
  const {appId, setScreenShare} = useContext(AgoraContext);
  const {authState} = useContextAuth();
  const {collaborationState, collaborationDispatch} = useCollaboration();
  const [connectionState, setConnectionState] = useState<ConnectionState>('DISCONNECTED');
  const {events} = useAgoraEvents();
  const {cleanupTracks} = useAgoraLocalTracks();
  const [remoteParticipants, setRemoteParticipants] = useState<AgoraParticipant[]>([]);
  const [userSoundLevel, setUserSoundLevel] = useState(0);
  const [uid, setUid] = useState<string | null>(null);
  const {stopScreenCast} = useAgoraScreenShare();
  const history = useHistory();

  const leaveCall = useCallback(async () => {
    cleanupTracks();
    stopScreenCast();
    setScreenShare(null);
    await client.leave();
  }, [cleanupTracks, client]);

  const joinChannel = useCallback(
    async (channel: string, token: string) => {
      try {
        if (client) {
          console.info('[agora] joining channel', appId, channel, token);
          collaborationDispatch({
            type: COLLABORATION_LOADING_UPDATE,
            isLoading: true
          });
          // #todo Dit verbeteren.
          const uid = (await client.join(appId, channel, token, authState.subject)) as string;
          collaborationDispatch({
            type: COLLABORATION_ENABLED_ACTION_UPDATE,
            enabled: true
          });

          setUid(uid);
          client.enableAudioVolumeIndicator();
          collaborationDispatch({
            type: COLLABORATION_LOADING_UPDATE,
            isLoading: false
          });
          //connection debugging
          // setInterval(()=> {
          //   const stats = client.getRTCStats()
          //   const localStats = {
          //       video: client.getLocalVideoStats(),
          //       audio: client.getLocalAudioStats()
          //     };
          //   const remoteNetworkQuality = client.getRemoteNetworkQuality();
          //
          //   const remoteTracksStats = {
          //       video: client.getRemoteVideoStats(),
          //       audio: client.getRemoteAudioStats()
          //     };
          //
          //   console.info('AGORA STATS RTC:', stats)
          //   console.info('AGORA STATS local:', localStats)
          //   console.info('AGORA STATS remotequality:', remoteNetworkQuality)
          //   console.info('AGORA STATS remoteTracksStats:', remoteTracksStats)
          // }, 5000)
        }
      } catch (error) {
        console.error('[agora] Error joining Channel', error);
      }
    },
    [appId, client, authState.subject]
  );

  const startCallAndStream = useCallback(
    async (channel: string) => {
      if (client) {
        console.info('CHANNEL');
        console.info(channel);
        const tokenResponse = await request.get(
          window._env_.BACKEND_ENDPOINT_URL + `/agora/token/${channel}`
        );

        console.info('STARING CALL...');

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        joinChannel(channel, tokenResponse.data);
      }
    },
    [client, joinChannel]
  );

  useEffect(() => {
    if (collaborationState.collaborationSpace?.id && collaborationState.stageMode) {
      leaveCall().then();
    } else if (collaborationState.collaborationSpace?.id) {
      console.info('Space');
      console.info(collaborationState.collaborationSpace);
      if (client.channelName !== collaborationState.collaborationSpace.id) {
        leaveCall().then(() => {
          if (collaborationState.collaborationSpace)
            startCallAndStream(collaborationState.collaborationSpace.id);
        });
      }
    } else if (collaborationState.collaborationTable?.id) {
      console.info('Table');
      if (client.channelName !== collaborationState.collaborationTable.id) {
        leaveCall().then(() => {
          if (collaborationState.collaborationTable)
            startCallAndStream(collaborationState.collaborationTable.id);
        });
      }
    } else {
      if (client.connectionState === 'CONNECTED') leaveCall();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    collaborationState.collaborationSpace,
    collaborationState.collaborationTable,
    collaborationState.stageMode
  ]);

  useEffect(() => {
    const rUser = events.data.remoteUser;
    const isScreenshare = rUser?.uid.split('|')[0] === 'ss';
    switch (events.event) {
      case 'volume-indicator':
        // eslint-disable-next-line no-case-declarations
        const soundLevels = events.data.result.reduce(
          // @ts-ignore: Refactoring
          (acc, curr) => ({...acc, [curr.uid]: curr}),
          {}
        );
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        if (soundLevels[uid as string]) setUserSoundLevel(soundLevels[uid as string].level);
        setRemoteParticipants((users) =>
          users.map((user) => {
            user.soundLevel = soundLevels[user.uid]?.level || 0;
            return user;
          })
        );
        break;
      case 'connection-state-change':
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        setConnectionState(events.data.currentState);
        break;
      case 'user-joined':
        if (isScreenshare) {
          history.push({pathname: ROUTES.screenShare});
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          setScreenShare(rUser.videoTrack);
        } else
          setRemoteParticipants((users) => [
            ...users,
            {
              uid: rUser.uid,
              audioTrack: rUser.audioTrack,
              videoTrack: rUser.videoTrack,
              hasAudio: rUser.hasAudio,
              hasVideo: rUser.hasVideo,
              soundLevel: 0
            }
          ]);
        break;
      case 'user-published':
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        if (isScreenshare) setScreenShare(rUser.videoTrack);
        else
          setRemoteParticipants((users) =>
            users.map((user) =>
              user.uid === rUser.uid
                ? {
                    uid: rUser.uid,
                    audioTrack: rUser.audioTrack,
                    videoTrack: rUser.videoTrack,
                    hasAudio: rUser.hasAudio,
                    hasVideo: rUser.hasVideo,
                    soundLevel: 0
                  }
                : user
            )
          );
        break;
      case 'user-unpublished':
        setRemoteParticipants((users) =>
          users.map((user) =>
            user.uid === rUser.uid
              ? {
                  uid: rUser.uid,
                  audioTrack: rUser.audioTrack,
                  videoTrack: rUser.videoTrack,
                  hasAudio: rUser.hasAudio,
                  hasVideo: rUser.hasVideo,
                  soundLevel: 0
                }
              : user
          )
        );
        break;
      case 'user-left':
        if (isScreenshare) setScreenShare(null);
        else
          setRemoteParticipants((users) => {
            const user = rUser;
            return users.filter((oldUser) => oldUser.uid !== user.uid);
          });
        break;
    }
  }, [events]);

  // useEffect(() => {
  //   if(collaborationState.stageMode){
  //     leaveCall()
  //   }
  // },[collaborationState.stageMode])

  useEffect(() => {
    console.info(`[agora] catching agora event of type ${events.event}`, events.data);
    switch (connectionState) {
      case 'DISCONNECTED':
        // collaborationDispatch({
        //   type: MEETING_SPACE_ENABLED_ACTION_UPDATE,
        //   enabled: false,
        // });
        break;
      // case "CONNECTING":
      //   collaborationDispatch({
      //     type: MEETING_SPACE_ENABLED_ACTION_UPDATE,
      //     enabled: true,
      //   });
      //   break;
      // case "RECONNECTING":
      //   break;
      // case "CONNECTED":
      //   collaborationDispatch({
      //     type: MEETING_SPACE_ENABLED_ACTION_UPDATE,
      //     enabled: true,
      //   });
      //   break;
      case 'DISCONNECTING':
        setRemoteParticipants([]);
        break;
    }
  }, [connectionState, collaborationDispatch]);

  return {
    connectionState: connectionState,
    localUser: {
      uid,
      soundLevel: userSoundLevel
    } as ILocalUser,
    remoteParticipants: remoteParticipants
  };
};

export default useAgoraVideo;
