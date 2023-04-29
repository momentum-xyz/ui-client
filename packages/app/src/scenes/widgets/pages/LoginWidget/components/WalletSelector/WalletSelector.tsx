import {FC, useState} from 'react';
import {observer} from 'mobx-react-lite';
import cn from 'classnames';
import {useI18n} from '@momentum-xyz/core';
import {Button, Frame} from '@momentum-xyz/ui-kit-storybook';

import {TrustPoints, WalletLogin} from 'ui-kit';
import {availableWallets, WalletConfigInterface} from 'wallets';

import * as styled from './WalletSelector.styled';

interface PropsInterface {
  onConnected?: () => void;
}

const WalletSelector: FC<PropsInterface> = ({onConnected}) => {
  const {t} = useI18n();

  const [selectedWallet, setSelectedWallet] = useState<WalletConfigInterface | null>(null);
  // TODO check if we need this separate state in future - we currently don't use it
  const [connectWithWallet, setConnectWithWallet] = useState<boolean>(false);

  const openWalletInstallationLink = (url: string): void => {
    window.open(url, '_blank');
  };

  return (
    <styled.Container data-testid="SignIn-test">
      <Frame>
        <styled.Title>{t('login.howToConnectAsAMemberTitle')}</styled.Title>
        <styled.Desc>{t('login.howToConnectAsAMemberDescription')}</styled.Desc>

        <styled.ScrollableContainer>
          <styled.SignInMethodsContainer>
            <styled.Title>{t('login.installWalletOrConnect')}</styled.Title>
            <styled.Methods>
              {availableWallets.map((wallet) => (
                <styled.MethodItem
                  key={wallet.name}
                  className={cn(selectedWallet?.name === wallet.name && 'active')}
                  onClick={() => {
                    setSelectedWallet(wallet);
                    setConnectWithWallet(true);
                  }}
                >
                  <img src={wallet.logo} alt={`${wallet.name}-icon`} />
                  <span>{wallet.name}</span>
                </styled.MethodItem>
              ))}
            </styled.Methods>
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
                <WalletLogin
                  key={selectedWallet.name}
                  walletConf={selectedWallet}
                  onConnected={onConnected}
                />
              )}
            </>
          )}
        </styled.ScrollableContainer>
      </Frame>
    </styled.Container>
  );
};

export default observer(WalletSelector);
