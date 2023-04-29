import {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {Hexagon, Panel} from '@momentum-xyz/ui-kit-storybook';

import {useStore} from 'shared/hooks';
import {WidgetEnum} from 'core/enums';
import {getImageAbsoluteUrl} from 'core/utils';

import {VoiceChatUser} from './components';
import * as styled from './VoiceChatWidget.styled';

const VoiceChatWidget: FC = () => {
  const {agoraStore, sessionStore, universeStore, widgetManagerStore} = useStore();
  const {agoraVoiceChatStore, userDevicesStore} = agoraStore;
  const {user} = sessionStore;

  const {t} = useI18n();

  useEffect(() => {
    if (!agoraStore.hasJoined) {
      agoraStore.initAgora(universeStore.worldId, sessionStore.userId);
    }
  }, [agoraStore, universeStore.worldId, sessionStore]);

  const handleToggleVoiceChat = useCallback(() => {
    if (agoraVoiceChatStore.hasJoined) {
      agoraStore.leaveVoiceChat();
    } else {
      agoraStore.joinVoiceChat();
    }
  }, [agoraVoiceChatStore, agoraStore]);

  return (
    <styled.Container data-testid="VoiceChatWidget-test">
      <Panel
        isFullHeight
        size="normal"
        icon="voice_chat"
        variant="primary"
        title={t('labels.voiceChat')}
        onClose={() => widgetManagerStore.close(WidgetEnum.VOICE_CHAT)}
      >
        <styled.Content>
          <styled.ScrollableContainer>
            {/* VOICE USERS */}
            <styled.VoiceChatUsers>
              {agoraVoiceChatStore.hasJoined && user && (
                <VoiceChatUser
                  key={user.id}
                  name={user.name}
                  avatarSrc={getImageAbsoluteUrl(user.profile.avatarHash)}
                  soundLevel={agoraVoiceChatStore.localSoundLevel}
                  isMuted={userDevicesStore.muted}
                />
              )}

              {agoraVoiceChatStore.joinedUsers.map((user) => (
                <VoiceChatUser
                  key={user.id}
                  name={user.name}
                  avatarSrc={getImageAbsoluteUrl(user.image)}
                  soundLevel={user.soundLevel}
                  isMuted={user.isMuted}
                />
              ))}
            </styled.VoiceChatUsers>
          </styled.ScrollableContainer>

          {/* MY ACTIONS */}
          <styled.Footer>
            {!agoraVoiceChatStore.hasJoined && (
              <styled.JoinTitle>{t('actions.joinVoiceChat')}</styled.JoinTitle>
            )}

            <styled.VoiceChatActions>
              {/* START & END CALL */}
              {agoraVoiceChatStore.hasJoined ? (
                <Hexagon
                  type="secondary"
                  color="danger"
                  iconName="call_disconnected"
                  onClick={handleToggleVoiceChat}
                />
              ) : (
                <Hexagon
                  type="secondary"
                  color="success"
                  iconName="call_connect"
                  onClick={handleToggleVoiceChat}
                />
              )}

              {/* MUTE & UNMUTE MICROPHONE */}
              {userDevicesStore.muted ? (
                <Hexagon
                  type="secondary"
                  iconName="microphoneOff"
                  noHover={!agoraStore.canToggleMicrophone}
                  onClick={() => {
                    if (agoraStore.canToggleMicrophone) {
                      userDevicesStore.toggleMicrophone();
                    }
                  }}
                />
              ) : (
                <Hexagon
                  type="secondary"
                  iconName="microphoneOn"
                  noHover={!agoraStore.canToggleMicrophone}
                  onClick={() => {
                    if (agoraStore.canToggleMicrophone) {
                      userDevicesStore.toggleMicrophone();
                    }
                  }}
                />
              )}
            </styled.VoiceChatActions>
          </styled.Footer>
        </styled.Content>
      </Panel>
    </styled.Container>
  );
};

export default observer(VoiceChatWidget);
