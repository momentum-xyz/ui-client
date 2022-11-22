import React, {FC} from 'react';
import {Button, Text} from '@momentum-xyz/ui-kit';

import {Box} from 'ui-kit';
import image from 'static/images/world.svg';

import * as styled from './JourneyBox.styled';

interface PropsInterface {
  onCreate: () => void;
}

const JourneyBox: FC<PropsInterface> = ({onCreate}) => {
  return (
    <Box>
      <styled.Div>
        <Text size="m" text="Create your Journey" align="left" />
        <styled.Image src={image} />
        <Text
          size="m"
          text="You need a wallet to get started. If you already have one, click on 'Create your Odyssey'. Or read more about getting a wallet on discover.odyssey.org"
          align="left"
        />
        <Button label="Create your Journey" wide onClick={onCreate} />
      </styled.Div>
    </Box>
  );
};

export default JourneyBox;
