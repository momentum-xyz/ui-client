import React, {FC} from 'react';
import {Button, IconSvg, InputDark, Text} from '@momentum-xyz/ui-kit';

import {Box} from 'ui-kit';

import * as styled from './ChoiceName.styled';

interface PropsInterface {
  onExplore: () => void;
}

const ChoiceName: FC<PropsInterface> = ({onExplore}) => {
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
        <Button size="medium" label="Explore Odyssey" icon="astro" onClick={onExplore} />
      </styled.Div>
    </Box>
  );
};

export default ChoiceName;
