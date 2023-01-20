import React, {FC} from 'react';
import {Button, Text} from '@momentum-xyz/ui-kit';

import {Box} from 'ui-kit';

import * as styled from './BuildOdyssey.styled';

interface PropsInterface {
  disabled?: boolean;
  name: string;
  onBuild: () => void;
}

const BuildOdyssey: FC<PropsInterface> = ({name, disabled, onBuild}) => {
  return (
    <Box>
      <styled.Div>
        <Text size="m" text={`Well done, ${name}! You just created your Odyssey`} align="left" />
        <Text size="m" text="Start creating your personal journey and..." align="left" />
        <Button size="medium" label="Build your Odyssey" disabled={disabled} onClick={onBuild} />
      </styled.Div>
    </Box>
  );
};

export default BuildOdyssey;
