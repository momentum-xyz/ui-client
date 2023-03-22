import {FC, memo} from 'react';

import {ButtonRound, Hexagon} from '../../atoms';

import * as styled from './VoiceUserLine.styled';

export interface VoiceUserLinePropsInterface {
  imageSrc: string;
  username: string;
  isCallHidden?: boolean;
  onCallClick?: () => void;
}

const VoiceUserLine: FC<VoiceUserLinePropsInterface> = ({
  imageSrc,
  username,
  isCallHidden,
  onCallClick
}) => {
  return (
    <styled.Container data-testid="Widget-test">
      <styled.Hexagon>
        <Hexagon type="third-borderless" imageSrc={imageSrc} />
      </styled.Hexagon>

      <styled.TitleContainer>
        <styled.Title>{username}</styled.Title>
      </styled.TitleContainer>

      {!isCallHidden && (
        <styled.Actions>
          <ButtonRound icon="call_connect" variant="primary" onClick={onCallClick} />
        </styled.Actions>
      )}
    </styled.Container>
  );
};

export default memo(VoiceUserLine);
