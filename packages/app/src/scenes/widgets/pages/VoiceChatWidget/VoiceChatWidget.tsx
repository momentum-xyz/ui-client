import {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {Hexagon, Panel} from '@momentum-xyz/ui-kit-storybook';

import {usePosBusEvent, useStore} from 'shared/hooks';
import {WidgetEnum} from 'core/enums';

import {VoiceChatUser} from './components';
import * as styled from './VoiceChatWidget.styled';

const VoiceChatWidget: FC = () => {
  const {agoraStore, sessionStore, universeStore, widgetManagerStore} = useStore();
  const {agoraVoiceChatStore, userDevicesStore} = agoraStore;
  const {user} = sessionStore;

  const {t} = useI18n();

  useEffect(() => {
    agoraStore.init(universeStore.worldId, sessionStore.userId);
  }, [agoraStore, universeStore.worldId, sessionStore]);

  usePosBusEvent('voice-chat-mute-user', agoraStore.handleUserMuted);
  usePosBusEvent('voice-chat-mute-all', agoraStore.handleAllMuted);
  usePosBusEvent('voice-chat-kick-user', agoraVoiceChatStore.handleUserKicked);
  usePosBusEvent('voice-chat-user-joined', agoraVoiceChatStore.handleUserJoined);
  usePosBusEvent('voice-chat-user-left', agoraVoiceChatStore.handleUserLeft);

  const handleToggleVoiceChat = useCallback(() => {
    if (agoraVoiceChatStore.hasJoined) {
      agoraStore.leaveVoiceChat();
    } else {
      agoraStore.joinVoiceChat();
    }
  }, [agoraVoiceChatStore, agoraStore]);

  const handleClose = useCallback(async () => {
    if (agoraVoiceChatStore.hasJoined) {
      await agoraStore.leaveVoiceChat();
    }

    widgetManagerStore.close(WidgetEnum.VOICE_CHAT);
  }, [agoraStore, agoraVoiceChatStore.hasJoined, widgetManagerStore]);

  return (
    <styled.Container data-testid="VoiceChatWidget-test">
      <Panel
        isFullHeight
        size="normal"
        icon="voice_chat"
        variant="primary"
        title={t('labels.voiceChat')}
        onClose={handleClose}
      >
        <styled.Content>
          <styled.ScrollableContainer>
            {/* VOICE USERS */}
            <styled.VoiceChatUsers>
              {agoraVoiceChatStore.hasJoined && user && (
                <VoiceChatUser
                  key={user.id}
                  name={user.name}
                  avatarSrc={user.avatarSrc}
                  soundLevel={agoraVoiceChatStore.localSoundLevel}
                  isMuted={userDevicesStore.muted}
                />
              )}

              {agoraVoiceChatStore.users.map((user) => {
                const remoteUser = agoraVoiceChatStore.getAgoraRemoteUser(user.id);
                return (
                  <VoiceChatUser
                    key={user.id}
                    name={user.name}
                    avatarSrc={user.avatarSrc}
                    soundLevel={remoteUser?.soundLevel ?? 0}
                    onUserKick={() => agoraVoiceChatStore.kickUser(user.id)}
                    onUserMute={() => agoraVoiceChatStore.muteUser(user.id)}
                    isMuted={remoteUser?.isMuted ?? true}
                    isRemote
                  />
                );
              })}
            </styled.VoiceChatUsers>
          </styled.ScrollableContainer>

          {/* MY ACTIONS */}
          <styled.Footer>
            {!agoraVoiceChatStore.hasJoined ? (
              <styled.JoinTitle>{t('actions.joinVoiceChat')}</styled.JoinTitle>
            ) : (
              <>
                {/*<styled.MuteAllAction>
                  <button
                    onClick={agoraVoiceChatStore.muteAll}
                    disabled={agoraVoiceChatStore.muteAllRequest.isPending}
                  >
                    <IconSvg name="microphoneOff" isWhite />
                    <span>{t('actions.muteAll')}</span>
                  </button>
                </styled.MuteAllAction>*/}
              </>
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
