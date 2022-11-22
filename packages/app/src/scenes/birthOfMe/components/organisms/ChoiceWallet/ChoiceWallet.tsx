import React, {FC} from 'react';
import {Button, Dropdown, Text} from '@momentum-xyz/ui-kit';

import {Box} from 'scenes/birthOfMe/components';
import polkadot from 'static/images/polkadot.svg';

import * as styled from './ChoiceWallet.styled';

const ChoiceWallet: FC = () => {
  return (
    <Box>
      <styled.Div>
        <Text size="m" text="Connect wallet and log in" align="left" />
        <styled.ImageContainer>
          <styled.Image src={polkadot} />
          <Text size="xs" text="Polkadot.js" align="left" transform="uppercase" />
        </styled.ImageContainer>
        <Dropdown placeholder="Select account" options={[]} onOptionSelect={() => {}} />
        <Button label="Connect your wallet" icon="wallet" />
      </styled.Div>
    </Box>
  );
};

export default ChoiceWallet;
