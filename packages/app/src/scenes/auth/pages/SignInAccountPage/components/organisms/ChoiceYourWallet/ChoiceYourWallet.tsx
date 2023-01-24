import React, {FC} from 'react';
import {Button, Dropdown, Heading, IconSvg, OptionInterface, Text} from '@momentum-xyz/ui-kit';
import {useTranslation} from 'react-i18next';

import {Box, CycleNumbered} from 'ui-kit';
import polkadot from 'static/images/polkadot.svg';

import * as styled from './ChoiceYourWallet.styled';

interface PropsInterface {
  walletOptions: OptionInterface[];
  wallet: string | null;
  isConnectDisabled: boolean;
  onSelectAddress: (address: string) => void;
  onConnect: () => void;
}

const DISCOVER_URL = 'https://discover.odyssey.org/create-your-odyssey/get-a-wallet/';

const ChoiceYourWallet: FC<PropsInterface> = (props) => {
  const {walletOptions, wallet, isConnectDisabled, onSelectAddress, onConnect} = props;

  const {t} = useTranslation();

  return (
    <Box size="small">
      <styled.Div>
        <styled.Header>
          <IconSvg name="add" size="normal" />
          <Heading type="h3" label={t('actions.createOdyssey')} align="left" />
        </styled.Header>

        <Text size="m" text={t('messages.onceConnectedTokensWillBeAwarded')} align="left" />
        <styled.ImageContainer>
          <styled.Image src={polkadot} />
          <Text size="xs" text={t('networks.polkadot')} align="left" transform="uppercase" />
        </styled.ImageContainer>

        <Dropdown
          placeholder={t('placeholders.selectAccount')}
          variant="third"
          valueType="wallet"
          options={walletOptions}
          onOptionSelect={(option) => onSelectAddress(option.value)}
        />

        <div>
          <Text size="m" text={t('messages.noWalletFollowInstructions')} align="left" />
          <styled.Link target="_blank" href={DISCOVER_URL}>
            {t('labels.here')}
          </styled.Link>
        </div>

        <Button
          size="medium"
          label={t('labels.connectYourWallet')}
          icon="wallet"
          disabled={!wallet || isConnectDisabled}
          onClick={onConnect}
        />

        <styled.Numbers>
          <CycleNumbered number={1} isActive />
          <CycleNumbered number={2} />
        </styled.Numbers>
      </styled.Div>
    </Box>
  );
};

export default ChoiceYourWallet;
