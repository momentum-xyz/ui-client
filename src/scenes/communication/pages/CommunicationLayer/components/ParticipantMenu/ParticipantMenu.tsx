import React, {FC} from 'react';

import {IconSvg, Text} from 'ui-kit';

import * as styled from './ParticipantMenu.styled';

const ParticipantMenu: FC = () => {
  return (
    <styled.Container>
      <styled.Content>
        <styled.Option>
          <styled.IconContainer>
            <IconSvg name="microphoneOff" />
          </styled.IconContainer>
          <Text text="Mute Anton" size="xxs" />
        </styled.Option>
        <styled.Option>
          <styled.IconContainer>
            <IconSvg name="remove-user" />
          </styled.IconContainer>
          <Text text="Kick Anton" size="xxs" />
        </styled.Option>
      </styled.Content>
      <styled.Triangle />
    </styled.Container>
  );
};

export default ParticipantMenu;
