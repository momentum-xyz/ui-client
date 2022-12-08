import React, {FC} from 'react';
import {Button, Dropdown, OptionInterface, Text} from '@momentum-xyz/ui-kit';

import {Box} from 'ui-kit';
import polkadot from 'static/images/polkadot.svg';

import * as styled from './ChoiceYourWallet.styled';

interface PropsInterface {
  walletOptions: OptionInterface[];
  wallet: string | null;
  isConnectDisabled: boolean;
  onSelectAddress: (address: string) => void;
  onConnect: () => void;
}

const ChoiceYourWallet: FC<PropsInterface> = (props) => {
  const {walletOptions, wallet, isConnectDisabled, onSelectAddress, onConnect} = props;

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

        <Dropdown
          placeholder="Select account"
          variant="third"
          valueType="wallet"
          options={walletOptions}
          onOptionSelect={(option) => onSelectAddress(option.value)}
        />

        <div>
          <Text
            size="m"
            text="No wallet? You can get one following the instructions"
            align="left"
          />
          <styled.Link
            target="_blank"
            href="https://discover.odyssey.org/create-your-odyssey/get-a-wallet/"
          >
            here
          </styled.Link>
        </div>
        <Button
          size="medium"
          label="Connect your wallet"
          icon="wallet"
          disabled={!wallet || isConnectDisabled}
          onClick={onConnect}
        />
      </styled.Div>
    </Box>
  );
};

export default ChoiceYourWallet;
