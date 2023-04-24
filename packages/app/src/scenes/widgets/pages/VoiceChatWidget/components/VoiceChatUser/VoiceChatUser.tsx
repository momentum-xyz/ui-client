import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {VoiceUserLine} from '@momentum-xyz/ui-kit-storybook';

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
      <VoiceUserLine
        imageSrc={avatarSrc || ''}
        username={name || ''}
        isMicrophoneOff={isMuted}
        isSpeaking={soundLevel > 3}
      />

      {/* FIXME: FOR LATER
      {isRemote && isShown && (
        <VoiceChatUserActions
          name={name ?? ''}
          onUserKick={() => {}}
          onUserMute={() => {}}
          coords={coords}
          onClose={() => setIsShown(false)}
        />
      )}*/}
    </styled.Container>
  );
};

export default observer(VoiceChatUser);
