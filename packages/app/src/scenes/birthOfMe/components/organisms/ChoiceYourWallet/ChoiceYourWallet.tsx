import React, {FC} from 'react';
import {Button, Dropdown, Text} from '@momentum-xyz/ui-kit';

import {Box} from 'ui-kit';
import polkadot from 'static/images/polkadot.svg';

import * as styled from './ChoiceYourWallet.styled';

interface PropsInterface {
  onConnect: () => void;
}

const ChoiceYourWallet: FC<PropsInterface> = ({onConnect}) => {
  return (
    <Box>
      <styled.Div>
        <Text size="m" text="1. Connect your wallet" align="left" />
        <Text
          size="m"
          text="Once connected, you will be awarded some Drive tokens to get you started"
          align="left"
        />
        <styled.ImageContainer>
          <styled.Image src={polkadot} />
          <Text size="xs" text="Polkadot.js" align="left" transform="uppercase" />
        </styled.ImageContainer>
        <Dropdown placeholder="Select account" options={[]} onOptionSelect={() => {}} />
        <Text
          size="m"
          text="No wallet? You can get one following the instructions here"
          align="left"
        />
        <Button size="medium" label="Connect your wallet" icon="wallet" onClick={onConnect} />
      </styled.Div>
    </Box>
  );
};

export default ChoiceYourWallet;
