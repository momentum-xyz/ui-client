import React, {FC} from 'react';
import {Text} from '@momentum-xyz/ui-kit';

import {Box} from 'ui-kit';

import * as styled from './TravellerBox.styled';

const TravellerBox: FC = () => {
  return (
    <Box>
      <styled.Div>
        <Text size="m" text="Hello traveller" align="left" />
        <Text
          size="m"
          text=" You are embarking on a journey that will intertwine with many others and will take you deep."
          align="left"
        />
      </styled.Div>
    </Box>
  );
};

export default TravellerBox;
