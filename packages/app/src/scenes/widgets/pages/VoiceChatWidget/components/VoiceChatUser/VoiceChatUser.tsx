import {FC} from 'react';
import {VoiceUser} from '@momentum-xyz/ui-kit';

import * as styled from './VoiceChatUser.styled';

interface PropsInterface {
  name?: string;
  avatarSrc?: string | null;
  soundLevel: number;
  isMuted: boolean;
}

const VoiceChatUser: FC<PropsInterface> = ({avatarSrc, soundLevel, name, isMuted}) => {
  return (
    <styled.Container>
      <VoiceUser
        imageSrc={avatarSrc || ''}
        username={name || ''}
        isMicrophoneOff={isMuted}
        isSpeaking={soundLevel > 3}
      />
    </styled.Container>
  );
};

export default VoiceChatUser;
