import React, {FC} from 'react';
import {Button, IconSvg, InputDark, Text} from '@momentum-xyz/ui-kit';

import {Box} from 'scenes/birthOfMe/components';

import * as styled from './ChoiceName.styled';

const ChoiceName: FC = () => {
  return (
    <Box>
      <styled.Div>
        <Text size="m" text="Or do you want look around. What should we call you?" align="left" />
        <styled.ImageContainer>
          <IconSvg name="profile" size="large" />
          <InputDark placeholder="Choose your name" />
        </styled.ImageContainer>

        <Text
          size="m"
          text="It's great that you want to experience the journeys of other travellers."
          align="left"
        />
        <Button label="Explore Odyssey" icon="people" />
      </styled.Div>
    </Box>
  );
};

export default ChoiceName;
