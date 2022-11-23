import React, {FC} from 'react';
import {Button, Dropdown, OptionInterface, Text} from '@momentum-xyz/ui-kit';

import {Box} from 'ui-kit';
import polkadot from 'static/images/polkadot.svg';

import * as styled from './ChoiceWallet.styled';

interface PropsInterface {
  addresses: OptionInterface[];
  selectedAddress: string | null;
  onSelectAddress: (address: string) => void;
  onConnect: () => void;
}

const ChoiceWallet: FC<PropsInterface> = (props) => {
  const {addresses, selectedAddress, onSelectAddress, onConnect} = props;

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
          valueType="wallet"
          options={addresses}
          onOptionSelect={(option) => onSelectAddress(option.value)}
        />

        <Button
          size="medium"
          label="Connect your wallet"
          icon="wallet"
          disabled={!selectedAddress}
          onClick={onConnect}
        />
      </styled.Div>
    </Box>
  );
};

export default ChoiceWallet;
