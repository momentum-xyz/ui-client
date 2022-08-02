import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import cn from 'classnames';
import {useTranslation} from 'react-i18next';

import {useStore} from 'shared/hooks';
import {AgoraRemoteUserInterface} from 'core/models';
import {IconSvg, Text, MediaPlayer} from 'ui-kit';

import * as styled from './Stage.styled';

interface StagePropsInterface {
  onRemoteUserClick?: (remoteUser: AgoraRemoteUserInterface, type: string) => void;
}

const Stage: React.FC<StagePropsInterface> = ({onRemoteUserClick}) => {
  const {mainStore, sessionStore} = useStore();
  const {agoraStore} = mainStore;
  const {userDevicesStore, agoraStageModeStore} = agoraStore;

  const [cols, setCols] = useState<string>('cols-1');

  const {t} = useTranslation();

  useEffect(() => {
    const {numberOfSpeakers} = agoraStageModeStore;
    if (numberOfSpeakers === 1) {
      setCols('cols-1');
    } else if (numberOfSpeakers > 1 && numberOfSpeakers <= 4) {
      setCols('cols-2');
    } else if (numberOfSpeakers > 4 && numberOfSpeakers <= 9) {
      setCols('cols-3');
    } else if (numberOfSpeakers > 9) {
      setCols('cols-4');
    }
  }, [agoraStageModeStore]);

  return (
    <styled.Container>
      <styled.Grid className={cols}>
        {agoraStageModeStore.numberOfSpeakers === 0 && (
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

        {agoraStageModeStore.isOnStage && (
          <styled.MediaPlayerContainer>
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
                        onRemoteUserClick?.(user, 'mute');
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
                      onRemoteUserClick?.(user, 'remove');
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
