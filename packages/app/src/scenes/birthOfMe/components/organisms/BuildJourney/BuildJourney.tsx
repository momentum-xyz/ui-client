import React, {FC} from 'react';
import {Button, Text} from '@momentum-xyz/ui-kit';

import {Box} from 'ui-kit';

import * as styled from './BuildJourney.styled';

interface PropsInterface {
  onBuild: () => void;
}

const BuildJourney: FC<PropsInterface> = ({onBuild}) => {
  return (
    <Box>
      <styled.Div>
        <Text size="m" text="Well done, Polkajor! You just created your Odyssey" align="left" />
        <Text size="m" text="Start creating your personal journey and..." align="left" />
        <Text
          size="m"
          text="Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus."
          align="left"
        />
        <Text size="m" text="Enter Polkajor and start the journey" align="left" />

        <Button size="medium" label="Build your Journey" onClick={onBuild} />
      </styled.Div>
    </Box>
  );
};

export default BuildJourney;
