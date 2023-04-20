import {FC, useRef} from 'react';
import {observer} from 'mobx-react-lite';
import {VoiceUserLine} from '@momentum-xyz/ui-kit-storybook';
import {useCoordinates} from '@momentum-xyz/ui-kit';

import {VoiceChatUserActions} from './VoiceChatUserActions';
import * as styled from './VoiceChatUser.styled';

interface PropsInterface {
  name?: string;
  avatarSrc?: string;
  soundLevel: number;
  isRemote?: boolean;
  isMuted: boolean;
  onUserKick?: () => void;
  onUserMute?: () => void;
}

const VoiceChatUser: FC<PropsInterface> = ({
  avatarSrc,
  soundLevel,
  name,
  isMuted,
  onUserKick,
  onUserMute,
  isRemote = false
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  const {coords, isShown, setIsShown} = useCoordinates(menuRef, 0, 0);

  return (
    <styled.Container>
      <VoiceUserLine
        imageSrc={avatarSrc || ''}
        username={name || ''}
        isMicrophoneOff={isMuted}
        isSpeaking={soundLevel > 3}
      />

      {/* FIXME: FOR LATER */}
      {isRemote && isShown && (
        <VoiceChatUserActions
          name={name ?? ''}
          onUserKick={onUserKick}
          onUserMute={onUserMute}
          coords={coords}
          onClose={() => setIsShown(false)}
        />
      )}
    </styled.Container>
  );
};

export default observer(VoiceChatUser);
