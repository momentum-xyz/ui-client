import React, {useEffect, useState} from 'react';
import {IAgoraRTCRemoteUser, ILocalVideoTrack} from 'agora-rtc-sdk-ng';

import MediaPlayer from '../MediaPlayer';
import {useStageClient} from '../../../hooks/communication/useAgoraClient';
import {useCurrentUser} from '../../../hooks/api/useUser';
import {bytesToUuid} from '../../../core/utils';
import {ReactComponent as MicOff} from '../../../images/icons/microphone-off.svg';
import {ReactComponent as RemoveIcon} from '../../../images/icons/remove.svg';
import {Volume} from '../../../context/type/StageMode';

export interface StageModeStageProps {
  isOnStage: boolean;
  onRemoteUserClick?: (remoteUser: IAgoraRTCRemoteUser, type: string) => void;
}

const StageModeStage: React.FC<StageModeStageProps> = ({isOnStage, onRemoteUserClick}) => {
  const [gridCols, setGridCols] = useState<string>('grid-cols-1');
  const [numStageUsers, setStageNumUsers] = useState<number>(0);
  const [localCameraTrack, setLocalCameraTrack] = useState<ILocalVideoTrack | undefined>();
  const [agoraRemoteUsers, setAgoraRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [isLocalVideoMuted, setIsLocalVideoMuted] = useState<boolean>(false);
  const [isLocalAudioMuted, setIsLocalAudioMuted] = useState<boolean>(false);
  const [soundLevels, setSoundLevels] = useState<Volume[]>([]);
  const [currentUser, , ,] = useCurrentUser();

  const client = useStageClient();

  // @ts-ignore
  const handleVolumeIndicator = (volumes) => {
    setSoundLevels(volumes as Volume[]);
  };

  useEffect(() => {
    if (client) {
      client.enableAudioVolumeIndicator();
      client.on('volume-indicator', handleVolumeIndicator);
    }

    return () => {
      if (client) {
        client.off('volume-indicator', handleVolumeIndicator);
      }
    };
  }, [client]);

  useEffect(() => {
    console.info('[stagemode] stage is onstage', isOnStage);

    const numUsers = isOnStage ? agoraRemoteUsers.length + 1 : agoraRemoteUsers.length;

    if (numUsers === 1) {
      setGridCols('grid-cols-1');
    } else if (numUsers > 1 && numUsers <= 4) {
      setGridCols('grid-cols-2');
    } else if (numUsers > 4 && numUsers <= 9) {
      setGridCols('grid-cols-3');
    } else if (numUsers > 9) {
      setGridCols('grid-cols-4');
    }

    setStageNumUsers(numUsers);
  }, [agoraRemoteUsers.length, isOnStage]);

  useEffect(() => {
    setAgoraRemoteUsers(() =>
      Array.from(
        client.remoteUsers.filter((item) => {
          return (item.uid as string).split('|')[0] !== 'ss';
        })
      )
    );
  }, [client.remoteUsers, client.remoteUsers.length]);

  useEffect(() => {
    // console.info('[STAGEMODE] localtracks update:', client)
    const cameraTrack = client.localTracks.find((track) => track.trackMediaType === 'video');
    const audioTrack = client.localTracks.find((track) => track.trackMediaType === 'audio');
    if (cameraTrack) {
      setIsLocalVideoMuted(!cameraTrack.enabled);
    }
    if (audioTrack) {
      setIsLocalAudioMuted(!audioTrack.enabled);
    }
    setLocalCameraTrack(cameraTrack as ILocalVideoTrack);
  }, [client, client.localTracks]);

  return (
    <div className="relative w-full h-full flex items-center p-1">
      {/*<div className="absolute top-0 z-pop-over">*/}
      {/*  DEBUG:<br/>*/}
      {/*  onstage:{isOnStage? 'true':'false'}<br/>*/}
      {/*  remoteUsers: {client.remoteUsers.length}<br/>*/}
      {/*  localVideoTrack: {localCameraTrack? 'true':'false'}<br/>*/}
      {/*  mutedVideo: {isLocalVideoMuted? 'true':'false'}<br/>*/}
      {/*  method: {onRemoteUserClick? 'true': 'false'}*/}
      {/*</div>*/}

      <div className={`w-full max-h-full grid gap-0 ${gridCols} items-center `}>
        {numStageUsers === 0 && (
          <div className="mt-2 text-center">
            <p className="text-xl uppercase text-white-50 self-center text-center font-bold">
              There are currently no participants on stage.
            </p>
          </div>
        )}

        {isOnStage && currentUser && (
          <div
            className="w-full max-h-full aspect-ratio-video bg-black-100 flex items-center justify-center overflow-hidden"
            key="stageuser-local"
          >
            <MediaPlayer
              videoTrack={localCameraTrack}
              audioTrack={undefined}
              isVideoMuted={isLocalVideoMuted}
              isAudioMuted={isLocalAudioMuted}
              currentUser={currentUser}
              soundLevel={
                soundLevels.find(({uid}) => uid === bytesToUuid(currentUser?.id.data))?.level
                  ? soundLevels.find(({uid}) => uid === bytesToUuid(currentUser?.id.data))?.level
                  : 0
              }
            />
          </div>
        )}

        {agoraRemoteUsers.map((user) => (
          <div
            className={`relative w-full max-h-full aspect-ratio-video bg-black-100 flex items-center justify-center overflow-hidden group ${
              onRemoteUserClick ? '' : ''
            } `}
            key={`stageuser-${user.uid}`}
          >
            <MediaPlayer
              remoteUser={user}
              videoTrack={user.videoTrack}
              isVideoMuted={!user.hasVideo}
              audioTrack={user.audioTrack}
              isAudioMuted={!user.hasAudio}
              soundLevel={
                soundLevels.find(({uid}) => uid === user.uid)?.level
                  ? soundLevels.find(({uid}) => uid === user.uid)?.level
                  : 0
              }
            />
            <div
              className={`absolute inset-0 hidden justify-center items-center   ${
                onRemoteUserClick ? 'group-hover:block ' : ''
              }`}
            >
              <div className="h-full flex items-center justify-center opacity-0 transition-opacity duration-300 hover:opacity-100">
                <div className="flex bg-black-70 gap-2 rounded p-1">
                  <button
                    className="hover:text-prime-blue-100 w-4"
                    onClick={() => {
                      if (onRemoteUserClick) {
                        onRemoteUserClick(user, 'mute');
                      }
                    }}
                  >
                    <div className="flex flex-col gap-1 justify-center items-center">
                      <MicOff className="w-2" />
                      <span className="text-sm">Mute</span>
                    </div>
                  </button>
                  <button
                    className="hover:text-prime-blue-100 w-4"
                    onClick={() => {
                      if (onRemoteUserClick) {
                        onRemoteUserClick(user, 'remove');
                      }
                    }}
                  >
                    <div className="flex flex-col gap-1 justify-center items-center">
                      <RemoveIcon className="w-2" />
                      <span className="text-sm">Remove</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StageModeStage;
