import React, {useEffect, useMemo, useState} from 'react';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';
import {AgoraRemoteUserInterface} from 'stores/MainStore/models/AgoraStore/models';

import MediaPlayer from '../MediaPlayer';
import {useCurrentUser} from '../../../hooks/api/useUser';
import {ReactComponent as MicOff} from '../../../images/icons/microphone-off.svg';
import {ReactComponent as RemoveIcon} from '../../../images/icons/remove.svg';

export interface StageModeStageProps {
  onRemoteUserClick?: (remoteUser: AgoraRemoteUserInterface, type: string) => void;
}

const StageModeStage: React.FC<StageModeStageProps> = ({onRemoteUserClick}) => {
  const [gridCols, setGridCols] = useState<string>('grid-cols-1');
  const [currentUser, , ,] = useCurrentUser();

  const {
    mainStore: {agoraStore}
  } = useStore();
  const {userDevicesStore} = agoraStore;

  const stageCount = useMemo(
    () =>
      agoraStore.isOnStage ? agoraStore.remoteUsers.length + 1 : agoraStore.remoteUsers.length,
    [agoraStore.isOnStage, agoraStore.remoteUsers.length]
  );

  useEffect(() => {
    if (stageCount === 1) {
      setGridCols('grid-cols-1');
    } else if (stageCount > 1 && stageCount <= 4) {
      setGridCols('grid-cols-2');
    } else if (stageCount > 4 && stageCount <= 9) {
      setGridCols('grid-cols-3');
    } else if (stageCount > 9) {
      setGridCols('grid-cols-4');
    }
  }, [stageCount]);

  return (
    <div className="relative w-full h-full flex items-center p-1 max-h-[80vh] max-w-[142vh]">
      {/*<div className="absolute top-0 z-pop-over">*/}
      {/*  DEBUG:<br/>*/}
      {/*  onstage:{isOnStage? 'true':'false'}<br/>*/}
      {/*  remoteUsers: {client.remoteUsers.length}<br/>*/}
      {/*  localVideoTrack: {localCameraTrack? 'true':'false'}<br/>*/}
      {/*  mutedVideo: {isLocalVideoMuted? 'true':'false'}<br/>*/}
      {/*  method: {onRemoteUserClick? 'true': 'false'}*/}
      {/*</div>*/}

      <div className={`w-full max-h-full grid gap-0 ${gridCols} items-center `}>
        {stageCount === 0 && (
          <div className="mt-2 text-center">
            <p className="text-xl uppercase text-white-50 self-center text-center font-bold">
              There are currently no participants on stage.
            </p>
          </div>
        )}

        {agoraStore.isOnStage && currentUser && (
          <div
            className="w-full max-h-full aspect-ratio-video bg-black-100 flex items-center justify-center overflow-hidden"
            key="stageuser-local"
          >
            <MediaPlayer
              videoTrack={userDevicesStore.localVideoTrack}
              audioTrack={undefined}
              isVideoMuted={userDevicesStore.cameraOff}
              isAudioMuted={userDevicesStore.muted}
              currentUser={currentUser}
              soundLevel={agoraStore.localSoundLevel}
            />
          </div>
        )}

        {agoraStore.remoteUsers.map((user) => (
          <div
            className={`relative w-full max-h-full aspect-ratio-video bg-black-100 flex items-center justify-center overflow-hidden group ${
              onRemoteUserClick ? '' : ''
            } `}
            key={`stageuser-${user.uid}`}
          >
            <MediaPlayer
              remoteUser={user}
              videoTrack={user.videoTrack}
              isVideoMuted={user.cameraOff}
              audioTrack={user.audioTrack}
              isAudioMuted={user.isMuted}
              soundLevel={agoraStore.remoteUsers.find(({uid}) => uid === user.uid)?.soundLevel ?? 0}
            />
            <div
              className={`absolute inset-0 hidden justify-center items-center   ${
                onRemoteUserClick ? 'group-hover:block ' : ''
              }`}
            >
              <div className="h-full flex items-center justify-center opacity-0 transition-opacity duration-300 hover:opacity-100">
                <div className="flex bg-black-70 gap-2 rounded p-1">
                  {!user.isMuted && (
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
                  )}
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

export default observer(StageModeStage);
