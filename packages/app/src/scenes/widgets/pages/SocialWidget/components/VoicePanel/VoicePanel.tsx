import {IconSvg, Text} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';
import {FC, useCallback} from 'react';

import {useStore} from 'shared/hooks';

import * as styled from './VoicePanel.styled';

const VoicePanel: FC = () => {
  const {agoraStore, sessionStore, mainStore} = useStore();
  const {worldStore} = mainStore;
  const {agoraMeetingStore, userDevicesStore} = agoraStore;
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
            <styled.AttendeeAvatar
              size="medium"
              avatarSrc={user.avatarSrc}
              showBorder={agoraStore.localSoundLevel > 3}
            />
            <styled.AttendeeName text={user.name} size="xs" isMultiline={false} />
          </styled.Attendee>
        )}
        {agoraMeetingStore.users.map((user) => (
          <styled.Attendee key={user.uid}>
            <styled.AttendeeAvatar
              size="medium"
              avatarSrc={user.avatarSrc}
              showBorder={agoraStore.localSoundLevel > 3}
            />
            <styled.AttendeeName text={user.name} size="xs" />
          </styled.Attendee>
        ))}
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
