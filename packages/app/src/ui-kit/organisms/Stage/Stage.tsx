import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import cn from 'classnames';
import {useTranslation} from 'react-i18next';
import {IconSvg, Text} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
import {AgoraRemoteUserInterface} from 'core/models';
import {RemoteOrLocalUser} from 'ui-kit';
import {StageModeModerationEventEnum} from 'core/enums';

import * as styled from './Stage.styled';

interface StagePropsInterface {
  onRemoteUserClick?: (
    remoteUser: AgoraRemoteUserInterface,
    type: StageModeModerationEventEnum
  ) => void;
}

const Stage: React.FC<StagePropsInterface> = ({onRemoteUserClick}) => {
  const {mainStore, sessionStore} = useStore();
  const {agoraStore_OLD} = mainStore;
  const {userDevicesStore, agoraStageModeStore} = agoraStore_OLD;

  const [cols, setCols] = useState<string>('cols-1');

  const {t} = useTranslation();

  useEffect(() => {
    if (agoraStageModeStore.numberOfSpeakers === 1) {
      setCols('cols-1');
    } else if (
      agoraStageModeStore.numberOfSpeakers > 1 &&
      agoraStageModeStore.numberOfSpeakers <= 4
    ) {
      setCols('cols-2');
    } else if (
      agoraStageModeStore.numberOfSpeakers > 4 &&
      agoraStageModeStore.numberOfSpeakers <= 9
    ) {
      setCols('cols-3');
    } else if (agoraStageModeStore.numberOfSpeakers > 9) {
      setCols('cols-4');
    }
  }, [agoraStageModeStore.numberOfSpeakers]);

  return (
    <styled.Container data-testid="Stage-test">
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
            <RemoteOrLocalUser
              videoTrack={userDevicesStore.localVideoTrack}
              isCameraOff={userDevicesStore.cameraOff}
              isMuted={userDevicesStore.muted}
              soundLevel={agoraStageModeStore.localSoundLevel}
              currentUser={sessionStore.user ?? undefined}
              loadCurrentUserProfile={sessionStore.loadUserProfile}
            />
          </styled.MediaPlayerContainer>
        )}

        {agoraStore_OLD.agoraStageModeStore.speakers.map((user) => (
          <styled.MediaPlayerContainer
            className={cn('relative', onRemoteUserClick && 'showActionsOnHover')}
            key={`stageuser-${user.uid}`}
          >
            <RemoteOrLocalUser
              remoteUser={user}
              videoTrack={user.videoTrack}
              isCameraOff={user.cameraOff}
              isMuted={user.isMuted}
              soundLevel={user.soundLevel}
            />
            <styled.RemoteUserActionsContainer>
              <styled.RemoteUserActions>
                <styled.RemoteUserActionButtons>
                  {!user.isMuted && (
                    <styled.RemoteUserActionButton
                      onClick={() => {
                        onRemoteUserClick?.(user, StageModeModerationEventEnum.MUTE);
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
                      onRemoteUserClick?.(user, StageModeModerationEventEnum.REMOVE);
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
