import {Avatar, IconSvg, Text} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';
import {FC, useCallback} from 'react';

import {useStore} from 'shared/hooks';

import * as styled from './VoicePanel.styled';

const VoicePanel: FC = () => {
  const {agoraStore, sessionStore, mainStore} = useStore();
  const {worldStore} = mainStore;
  const {agoraMeetingStore} = agoraStore;
  const {user} = sessionStore;

  const handleToggleVoiceChat = useCallback(() => {
    if (agoraStore.hasJoined) {
      agoraStore.leave();
    } else {
      agoraStore.join(sessionStore.userId, worldStore.worldId);
    }
  }, [agoraStore, sessionStore.userId, worldStore.worldId]);

  return (
    <styled.Container>
      <styled.Body>
        {agoraStore.hasJoined && user && (
          <styled.Attendee>
            <Avatar size="medium" avatarSrc={user.avatarSrc} />
            <styled.AttendeeName text={user.name} size="xs" isMultiline={false} />
          </styled.Attendee>
        )}
        {agoraMeetingStore.users.map((user) => (
          <styled.Attendee key={user.uid}>
            <Avatar size="medium" avatarSrc={user.avatarSrc} />
            <styled.AttendeeName text={user.name} size="xs" />
          </styled.Attendee>
        ))}
      </styled.Body>
      <styled.Footer>
        <styled.EnterLeaveButton onClick={handleToggleVoiceChat}>
          <styled.EnterLeaveButtonLabel
            text={agoraStore.hasJoined ? 'Leave Voice Chat' : 'Join Voice Chat'}
            size="xs"
          />
        </styled.EnterLeaveButton>
        <styled.VoiceActions>
          <styled.VoiceAction>
            <IconSvg name="microphoneOff" />
            <Text text="Mute All" size="xs" />
          </styled.VoiceAction>
          <styled.VoiceAction>
            <IconSvg name="microphoneOff" />
            <Text text="Mic Off" size="xs" />
          </styled.VoiceAction>
        </styled.VoiceActions>
      </styled.Footer>
    </styled.Container>
  );
};

export default observer(VoicePanel);
