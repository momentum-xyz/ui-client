import React, {FC} from 'react';
import {Text} from '@momentum-xyz/ui-kit';

import {Box} from 'ui-kit';

import * as styled from './CongratulationsBox.styled';

interface PropsInterface {
  amount: string;
}

const CongratulationsBox: FC<PropsInterface> = ({amount}) => {
  return (
    <Box>
      <styled.Div>
        <Text size="m" text="Congratulations!" align="left" />
        <Text
          size="m"
          text={`You just received ${amount} tokens. One more step and you'll embark on your epic journey!`}
          align="left"
        />
      </styled.Div>
    </Box>
  );
};

export default CongratulationsBox;
