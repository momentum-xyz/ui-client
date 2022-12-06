import {IconSvg, Text} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';
import {FC, useCallback} from 'react';
import {useTranslation} from 'react-i18next';

import {usePosBusEvent, useStore} from 'shared/hooks';
import {VoiceChatUser} from 'scenes/widgets/pages/SocialWidget/components';

import * as styled from './VoiceChatPanel.styled';

const VoiceChatPanel: FC = () => {
  const {agoraStore, sessionStore} = useStore();
  const {agoraVoiceChatStore, userDevicesStore} = agoraStore;
  const {user} = sessionStore;

  const {t} = useTranslation();

  const handleToggleVoiceChat = useCallback(() => {
    if (agoraVoiceChatStore.hasJoined) {
      agoraStore.leaveVoiceChat();
    } else {
      agoraStore.joinVoiceChat();
    }
  }, [agoraVoiceChatStore, agoraStore]);

  usePosBusEvent('voice-chat-mute-user', agoraStore.handleUserMuted);

  usePosBusEvent('voice-chat-mute-all', agoraStore.handleAllMuted);

  usePosBusEvent('voice-chat-kick-user', agoraVoiceChatStore.handleUserKicked);

  usePosBusEvent('voice-chat-user-joined', agoraVoiceChatStore.handleUserJoined);

  usePosBusEvent('voice-chat-user-left', agoraVoiceChatStore.handleUserLeft);

  return (
    <styled.Container>
      <styled.Body>
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
              onUserKick={() => {
                agoraVoiceChatStore.kickUser(user.id);
              }}
              onUserMute={() => {
                agoraVoiceChatStore.muteUser(user.id);
              }}
              isMuted={remoteUser?.isMuted ?? true}
              isRemote
            />
          );
        })}
      </styled.Body>
      <styled.Footer>
        <styled.EnterLeaveButton onClick={handleToggleVoiceChat}>
          <styled.EnterLeaveButtonLabel
            text={
              agoraVoiceChatStore.hasJoined
                ? t('actions.leaveVoiceChat')
                : t('actions.joinVoiceChat')
            }
            size="xs"
            weight="light"
          />
        </styled.EnterLeaveButton>
        <styled.VoiceActions>
          <styled.VoiceAction
            onClick={agoraVoiceChatStore.muteAll}
            disabled={agoraVoiceChatStore.muteAllRequest.isPending}
          >
            <IconSvg name="microphoneOff" />
            <Text text={t('actions.muteAll')} size="xs" weight="light" />
          </styled.VoiceAction>
          <styled.VoiceAction
            onClick={() => {
              agoraStore.canToggleMicrophone && userDevicesStore.toggleMicrophone();
            }}
            disabled={!agoraStore.canToggleMicrophone}
          >
            <IconSvg name={userDevicesStore.muted ? 'microphoneOff' : 'microphoneOn'} />
            <Text
              text={userDevicesStore.muted ? t('labels.micOff') : t('labels.micOn')}
              size="xs"
              weight="light"
            />
          </styled.VoiceAction>
        </styled.VoiceActions>
      </styled.Footer>
    </styled.Container>
  );
};

export default observer(VoiceChatPanel);
