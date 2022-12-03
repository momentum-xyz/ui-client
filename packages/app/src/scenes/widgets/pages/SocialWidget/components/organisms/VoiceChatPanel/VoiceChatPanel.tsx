import {IconSvg, Text} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';
import {FC, useCallback} from 'react';

import {usePosBusEvent, useStore} from 'shared/hooks';
import {VoiceChatUser} from 'scenes/widgets/pages/SocialWidget/components';

import * as styled from './VoiceChatPanel.styled';

const VoiceChatPanel: FC = () => {
  const {agoraStore, sessionStore} = useStore();
  const {agoraVoiceChatStore, userDevicesStore} = agoraStore;
  const {user} = sessionStore;

  const handleToggleVoiceChat = useCallback(() => {
    if (agoraVoiceChatStore.hasJoined) {
      agoraStore.leaveVoiceChat();
    } else {
      agoraStore.joinVoiceChat();
    }
  }, [agoraVoiceChatStore, agoraStore]);

  usePosBusEvent('voice-chat-mute', agoraStore.handleUserMuted);

  usePosBusEvent('voice-chat-kick', agoraVoiceChatStore.handleUserKicked);

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
                console.log('kicking...');
                agoraVoiceChatStore.kickUser(user.id);
              }}
              onUserMute={() => {
                agoraVoiceChatStore.muteUser(user.id);
              }}
              isRemote
            />
          );
        })}
      </styled.Body>
      <styled.Footer>
        <styled.EnterLeaveButton onClick={handleToggleVoiceChat}>
          <styled.EnterLeaveButtonLabel
            text={agoraVoiceChatStore.hasJoined ? 'Leave Voice Chat' : 'Join Voice Chat'}
            size="xs"
            weight="light"
          />
        </styled.EnterLeaveButton>
        <styled.VoiceActions>
          <styled.VoiceAction>
            <IconSvg name="microphoneOff" />
            <Text text="Mute All" size="xs" weight="light" />
          </styled.VoiceAction>
          <styled.VoiceAction
            onClick={() => {
              agoraStore.canToggleMicrophone && userDevicesStore.toggleMicrophone();
            }}
            disabled={!agoraStore.canToggleMicrophone}
          >
            <IconSvg name={userDevicesStore.muted ? 'microphoneOff' : 'microphoneOn'} />
            <Text text={userDevicesStore.muted ? 'Mic Off' : 'Mic On'} size="xs" weight="light" />
          </styled.VoiceAction>
        </styled.VoiceActions>
      </styled.Footer>
    </styled.Container>
  );
};

export default observer(VoiceChatPanel);
