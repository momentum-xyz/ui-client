import {FC} from 'react';

import {ButtonRound, Hexagon} from '../../atoms';

import * as styled from './VoiceUserLine.styled';

export interface VoiceUserLinePropsInterface {
  imageSrc: string;
  username: string;
  isSpeaking?: boolean;
  isMicrophoneOff?: boolean;
}

const VoiceUserLine: FC<VoiceUserLinePropsInterface> = ({
  imageSrc,
  username,
  isSpeaking,
  isMicrophoneOff
}) => {
  return (
    <styled.Container data-testid="VoiceUserLine-test">
      <styled.Hexagon>
        <Hexagon type={isSpeaking ? 'third' : 'third-borderless'} imageSrc={imageSrc} />
      </styled.Hexagon>

      <styled.TitleContainer>
        <styled.Title>{username}</styled.Title>
      </styled.TitleContainer>

      {isMicrophoneOff && (
        <styled.Actions>
          <ButtonRound icon="microphoneOff" variant="primary" isLabel />
        </styled.Actions>
      )}
    </styled.Container>
  );
};

export default VoiceUserLine;
