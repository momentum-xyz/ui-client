import {FC, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {Button} from '@momentum-xyz/ui-kit';

import {TrustPoints, WalletLogin, WalletSelector} from 'ui-kit';
import {WalletConfigInterface} from 'wallets';

import * as styled from './SignIn.styled';

interface PropsInterface {
  headless?: boolean;
}

const SignIn: FC<PropsInterface> = ({headless = false}) => {
  const {t} = useI18n();

  const [selectedWallet, setSelectedWallet] = useState<WalletConfigInterface | null>(null);
  // TODO check if we need this separate state in future - we currently don't use it
  const [connectWithWallet, setConnectWithWallet] = useState<boolean>(false);

  const openWalletInstallationLink = (url: string): void => {
    window.open(url, '_blank');
  };

  return (
    <styled.Container data-testid="SignIn-test">
      {!headless && (
        <>
          <styled.Title>{t('login.howToConnectAsAMemberTitle')}</styled.Title>
          <styled.Desc>{t('login.howToConnectAsAMemberDescription')}</styled.Desc>
        </>
      )}

      <styled.SignInMethodsContainer>
        <styled.Title>{t('login.installWalletOrConnect')}</styled.Title>
        <WalletSelector
          onSelect={(wallet) => {
            setSelectedWallet(wallet);
            setConnectWithWallet(true);
          }}
        />
      </styled.SignInMethodsContainer>

      {!selectedWallet && !connectWithWallet && <TrustPoints />}

      {selectedWallet && (
        <>
          <styled.ConnectWithWalletRow>
            <img src={selectedWallet.logo} alt={`${selectedWallet.name}-icon`} />
            <span>{t('login.connectWith', {wallet: selectedWallet.name})}</span>
          </styled.ConnectWithWalletRow>

          {!connectWithWallet && (
            <styled.ConnectWithWallet>
              <Button
                label={t('login.installBrowserExtension')}
                icon="logout" // TODO: Add missing 'install' icon to storybook and use it here
                wide
                onClick={() => openWalletInstallationLink(selectedWallet.browserExtensionUrl)}
              />
              <Button
                label={t('login.connectWallet')}
                icon="link"
                wide
                onClick={() => setConnectWithWallet(true)}
              />
            </styled.ConnectWithWallet>
          )}

          {connectWithWallet && (
            <WalletLogin key={selectedWallet.name} walletConf={selectedWallet} />
          )}
        </>
      )}
    </styled.Container>
  );
};

export default observer(SignIn);
