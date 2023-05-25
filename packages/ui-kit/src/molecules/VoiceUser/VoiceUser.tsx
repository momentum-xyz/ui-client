import {FC} from 'react';
import cn from 'classnames';

import {ButtonRound, Hexagon} from '../../atoms';

import * as styled from './VoiceUser.styled';

export interface VoiceUserPropsInterface {
  imageSrc: string;
  username: string;
  isSpeaking?: boolean;
  isMicrophoneOff?: boolean;
}

const VoiceUser: FC<VoiceUserPropsInterface> = ({
  imageSrc,
  username,
  isSpeaking,
  isMicrophoneOff
}) => {
  return (
    <styled.Container
      data-testid="VoiceUser-test"
      className={cn(!isMicrophoneOff && isSpeaking && 'isSpeaking')}
    >
      <styled.Hexagon>
        <Hexagon type="third-borderless" imageSrc={imageSrc} iconName="rabbit_fill" />
      </styled.Hexagon>

      <styled.TitleContainer>
        <styled.Title>{username}</styled.Title>
      </styled.TitleContainer>

      {isMicrophoneOff && (
        <styled.Actions className="isMuted">
          <ButtonRound icon="microphoneOff" variant="primary" size="normal" isLabel />
        </styled.Actions>
      )}

      {!isMicrophoneOff && isSpeaking && (
        <styled.Actions className="isSpeaking">
          <ButtonRound icon="talk" variant="primary" size="normal" isLabel />
        </styled.Actions>
      )}
    </styled.Container>
  );
};

export default VoiceUser;
