import React, {useEffect, useMemo, useState} from 'react';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';
import {AgoraRemoteUserInterface} from 'stores/MainStore/models/AgoraStore/models';
import {MediaPlayer} from 'scenes/collaboration/pages/StageModePage/components';
import {IconSvg} from 'ui-kit';

import * as styled from './Stage.styled';

export interface StagePropsInterface {
  onRemoteUserClick?: (remoteUser: AgoraRemoteUserInterface, type: string) => void;
}

const Stage: React.FC<StagePropsInterface> = ({onRemoteUserClick}) => {
  const [cols, setCols] = useState<string>('cols-1');

  const {
    mainStore: {agoraStore},
    sessionStore
  } = useStore();
  const {userDevicesStore} = agoraStore;

  const stageCount = useMemo(
    () =>
      agoraStore.isOnStage ? agoraStore.remoteUsers.length + 1 : agoraStore.remoteUsers.length,
    [agoraStore.isOnStage, agoraStore.remoteUsers.length]
  );

  useEffect(() => {
    if (stageCount === 1) {
      setCols('cols-1');
    } else if (stageCount > 1 && stageCount <= 4) {
      setCols('cols-2');
    } else if (stageCount > 4 && stageCount <= 9) {
      setCols('cols-3');
    } else if (stageCount > 9) {
      setCols('cols-4');
    }
  }, [stageCount]);

  return (
    <styled.Container>
      <styled.Grid className={cols}>
        {stageCount === 0 && (
          <div className="mt-2 text-center">
            <p className="text-xl uppercase text-white-50 self-center text-center font-bold">
              There are currently no participants on stage.
            </p>
          </div>
        )}

        {agoraStore.isOnStage && (
          <div
            className="w-full max-h-full aspect-ratio-video bg-black-100 flex items-center justify-center overflow-hidden"
            key="stageuser-local"
          >
            <MediaPlayer
              videoTrack={userDevicesStore.localVideoTrack}
              isCameraOff={userDevicesStore.cameraOff}
              isMuted={userDevicesStore.muted}
              soundLevel={agoraStore.localSoundLevel}
              currentUser={sessionStore.profile ?? undefined}
              loadCurrentUserProfile={sessionStore.loadUserProfile}
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
              isCameraOff={user.cameraOff}
              isMuted={user.isMuted}
              soundLevel={user.soundLevel}
              currentUser={sessionStore.profile ?? undefined}
              loadCurrentUserProfile={sessionStore.loadUserProfile}
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
                        <IconSvg name="microphoneOff" size="medium-large" />
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
                      <IconSvg name="bin" size="medium-large" />
                      <span className="text-sm">Remove</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </styled.Grid>
    </styled.Container>
  );
};

export default observer(Stage);
