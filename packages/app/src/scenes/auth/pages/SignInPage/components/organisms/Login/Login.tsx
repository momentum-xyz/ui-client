import React, {FC} from 'react';
import {Button, Dropdown, OptionInterface, Text} from '@momentum-xyz/ui-kit';

import {Box} from 'ui-kit';
import polkadot from 'static/images/polkadot.svg';

import * as styled from './Login.styled';

interface PropsInterface {
  walletOptions: OptionInterface[];
  wallet: string | null;
  isPending: boolean;
  onSelectAddress: (address: string) => void;
  onLogin: () => void;
}

const Login: FC<PropsInterface> = (props) => {
  const {walletOptions, wallet, isPending, onSelectAddress, onLogin} = props;

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
          options={walletOptions}
          onOptionSelect={(option) => onSelectAddress(option.value)}
        />

        <Button
          size="medium"
          label="Connect your wallet"
          icon="wallet"
          disabled={!wallet || isPending}
          onClick={onLogin}
        />
      </styled.Div>
    </Box>
  );
};

export default Login;
