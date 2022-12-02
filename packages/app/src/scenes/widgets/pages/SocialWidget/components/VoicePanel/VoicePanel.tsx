import {IconSvg, Text} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';
import {FC, useCallback} from 'react';

import {usePosBusEvent, useStore} from 'shared/hooks';

import * as styled from './VoicePanel.styled';

const VoicePanel: FC = () => {
  const {agoraStore, sessionStore, mainStore} = useStore();
  const {worldStore} = mainStore;
  const {agoraVoiceChatStore, userDevicesStore} = agoraStore;
  const {user} = sessionStore;

  const handleToggleVoiceChat = useCallback(() => {
    if (agoraStore.hasJoined) {
      agoraStore.leave();
    } else {
      agoraStore.join(sessionStore.userId, worldStore.worldId);
    }
  }, [agoraStore, sessionStore.userId, worldStore.worldId]);

  usePosBusEvent('voice-chat-mute', agoraStore.handleUserMuted);

  usePosBusEvent('voice-chat-kick', agoraVoiceChatStore.handleUserKicked);

  usePosBusEvent('voice-chat-user-joined', agoraVoiceChatStore.handleUserJoined);

  usePosBusEvent('voice-chat-user-left', agoraVoiceChatStore.handleUserLeft);

  return (
    <styled.Container>
      <styled.Body>
        {agoraStore.hasJoined && user && (
          <styled.Attendee>
            <styled.AttendeeAvatar
              size="medium"
              avatarSrc={user.avatarSrc}
              showBorder={agoraStore.localSoundLevel > 3}
            />
            <styled.AttendeeName text={user.name} size="xs" isMultiline={false} />
          </styled.Attendee>
        )}
        {agoraVoiceChatStore.users.map((user) => {
          const remoteUser = agoraVoiceChatStore.getAgoraRemoteUser(user.id);
          return (
            <styled.Attendee key={user.id}>
              <styled.AttendeeAvatar
                size="medium"
                avatarSrc={user.avatarSrc}
                showBorder={(remoteUser?.soundLevel ?? 0) > 3}
              />
              <styled.AttendeeName text={user.name} size="xs" isMultiline={false} />
            </styled.Attendee>
          );
        })}
      </styled.Body>
      <styled.Footer>
        <styled.EnterLeaveButton onClick={handleToggleVoiceChat}>
          <styled.EnterLeaveButtonLabel
            text={agoraStore.hasJoined ? 'Leave Voice Chat' : 'Join Voice Chat'}
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
            onClick={() => userDevicesStore.toggleMicrophone()}
            disabled={userDevicesStore.isTogglingMicrophone}
          >
            <IconSvg name={userDevicesStore.muted ? 'microphoneOff' : 'microphoneOn'} />
            <Text text={userDevicesStore.muted ? 'Mic Off' : 'Mic On'} size="xs" weight="light" />
          </styled.VoiceAction>
        </styled.VoiceActions>
      </styled.Footer>
    </styled.Container>
  );
};

export default observer(VoicePanel);
