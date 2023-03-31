import React, {FC, useCallback, useState} from 'react';
import {Button, Dropdown, Heading, IconSvg, OptionInterface, Text} from '@momentum-xyz/ui-kit';
import {FrameText} from '@momentum-xyz/ui-kit-storybook';
import {useI18n} from '@momentum-xyz/core';

import {Box, CycleNumbered} from 'ui-kit';
import polkadot from 'static/images/polkadot.svg';
import {availableWallets, WalletConfigInterface} from 'wallets';

import {WalletSignUp} from '../WalletSignUp';

import * as styled from './ChoiceYourWallet.styled';

interface PropsInterface {
  hasError: boolean;
  walletOptions: OptionInterface[];
  wallet: string | null;
  isConnectDisabled: boolean;
  onSelectAddress: (address: string) => void;
  onConnect: () => void;
}

const DISCOVER_URL = 'https://discover.odyssey.org/create-your-odyssey/get-a-wallet/';

const ChoiceYourWallet: FC<PropsInterface> = (props) => {
  const {walletOptions, wallet, isConnectDisabled, hasError, onSelectAddress, onConnect} = props;
  const [selectedWallet, setSelectedWallet] = useState<WalletConfigInterface | null>(null);

  const {t} = useI18n();

  const handleAccountConnected = useCallback(
    (address: string) => {
      onSelectAddress(address);
      onConnect();
    },
    [onConnect, onSelectAddress]
  );

  // const handleAccountConnected = useCallback(async () => {
  //   console.log('handleAccountConnected');
  //   // try {
  //   //   await sessionStore.loadUserProfile();
  //   // } catch (e) {
  //   //   console.log('Error loading profile', e);
  //   // }
  // }, []);

  const frameTitle = hasError ? 'Oops' : 'Sign in with your wallet';
  const frameLine = hasError
    ? 'Something went wrong with connecting your wallet. Please try again.'
    : 'Lorem ipsum dolor sit amet, consectetuer adipicing elit. Aenean commodo ligula.';

  return (
    <>
      <styled.Container>
        <FrameText title={frameTitle} line1={frameLine} />
        <styled.Separator />
        <FrameText title="Install wallet or connect" />
        <styled.SignUpMethodsContainer>
          {availableWallets.map((wallet) => {
            const {name, icon} = wallet;
            return (
              <styled.SignUpMethodContainer key={name} onClick={() => setSelectedWallet(wallet)}>
                <img src={icon} alt={`${name}-icon`} />
                <span>{name}</span>
              </styled.SignUpMethodContainer>
            );
          })}
        </styled.SignUpMethodsContainer>
        {selectedWallet && (
          <WalletSignUp
            key={selectedWallet.name}
            walletConf={selectedWallet}
            onConnected={handleAccountConnected}
            onCancel={() => setSelectedWallet(null)}
          />
        )}
      </styled.Container>
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
    </>
  );
};

export default ChoiceYourWallet;
