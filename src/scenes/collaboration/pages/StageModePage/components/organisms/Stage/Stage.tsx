import React, {useEffect, useState} from 'react';
import {observer, useObserver} from 'mobx-react-lite';
import cn from 'classnames';
import {useTranslation} from 'react-i18next';

import {useStore} from 'shared/hooks';
import {AgoraRemoteUserInterface} from 'stores/MainStore/models/AgoraStore/models';
import {MediaPlayer} from 'scenes/collaboration/pages/StageModePage/components';
import {IconSvg, Text} from 'ui-kit';

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
  const {userDevicesStore, stageModeStore} = agoraStore;

  const {t} = useTranslation();

  const stageCount = useObserver(() =>
    stageModeStore.isOnStage ? agoraStore.remoteUsers.length + 1 : agoraStore.remoteUsers.length
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
          <styled.MessageContainer>
            <Text
              text={t('messages.noParticipantsOnStage')}
              size="xl"
              align="center"
              transform="uppercase"
              weight="bold"
            />
          </styled.MessageContainer>
        )}

        {stageModeStore.isOnStage && (
          <styled.MediaPlayerContainer key="stageuser-local">
            <MediaPlayer
              videoTrack={userDevicesStore.localVideoTrack}
              isCameraOff={userDevicesStore.cameraOff}
              isMuted={userDevicesStore.muted}
              soundLevel={agoraStore.localSoundLevel}
              currentUser={sessionStore.profile ?? undefined}
              loadCurrentUserProfile={sessionStore.loadUserProfile}
            />
          </styled.MediaPlayerContainer>
        )}

        {agoraStore.remoteUsers.map((user) => (
          <styled.MediaPlayerContainer
            className={cn('relative', onRemoteUserClick && 'showActionsOnHover')}
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
            <styled.RemoteUserActionsContainer>
              <styled.RemoteUserActions>
                <styled.RemoteUserActionButtons>
                  {!user.isMuted && (
                    <styled.RemoteUserActionButton
                      onClick={() => {
                        if (onRemoteUserClick) {
                          onRemoteUserClick(user, 'mute');
                        }
                      }}
                    >
                      <styled.RemoteUserAction>
                        <IconSvg name="microphoneOff" size="medium-large" />
                        <Text text={t('actions.mute')} size="s" />
                      </styled.RemoteUserAction>
                    </styled.RemoteUserActionButton>
                  )}
                  <styled.RemoteUserActionButton
                    onClick={() => {
                      if (onRemoteUserClick) {
                        onRemoteUserClick(user, 'remove');
                      }
                    }}
                  >
                    <styled.RemoteUserAction>
                      <IconSvg name="bin" size="medium-large" />
                      <Text text={t('actions.remove')} size="s" />
                    </styled.RemoteUserAction>
                  </styled.RemoteUserActionButton>
                </styled.RemoteUserActionButtons>
              </styled.RemoteUserActions>
            </styled.RemoteUserActionsContainer>
          </styled.MediaPlayerContainer>
        ))}
      </styled.Grid>
    </styled.Container>
  );
};

export default observer(Stage);
