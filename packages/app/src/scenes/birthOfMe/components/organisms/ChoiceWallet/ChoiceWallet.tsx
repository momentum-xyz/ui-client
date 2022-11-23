import React, {FC} from 'react';
import {Button, Dropdown, Text} from '@momentum-xyz/ui-kit';

import {Box} from 'ui-kit';
import polkadot from 'static/images/polkadot.svg';

import * as styled from './ChoiceWallet.styled';

interface PropsInterface {
  onSelect: () => void;
}

const ChoiceWallet: FC<PropsInterface> = ({onSelect}) => {
  return (
    <Box>
      <styled.Div>
        <Text size="m" text="Connect wallet and log in" align="left" />
        <styled.ImageContainer>
          <styled.Image src={polkadot} />
          <Text size="xs" text="Polkadot.js" align="left" transform="uppercase" />
        </styled.ImageContainer>
        <Dropdown
          placeholder="Select account"
          variant="third"
          options={[]}
          onOptionSelect={() => {}}
        />
        <Button size="medium" label="Connect your wallet" icon="wallet" onClick={onSelect} />
      </styled.Div>
    </Box>
  );
};

export default ChoiceWallet;
