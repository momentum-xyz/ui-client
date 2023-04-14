import {FC, useState} from 'react';
import {observer} from 'mobx-react-lite';
import cn from 'classnames';
import {Button, ButtonRound, Frame} from '@momentum-xyz/ui-kit-storybook';
import {useI18n} from '@momentum-xyz/core';

import {availableWallets, WalletConfigInterface} from 'wallets';

import {WalletLogin} from '../WalletLogin';

import * as styled from './SignIn.styled';

interface PropsInterface {
  onConnected: () => void;
}

const SignIn: FC<PropsInterface> = ({onConnected}) => {
  const {t} = useI18n();

  const [selectedWallet, setSelectedWallet] = useState<WalletConfigInterface | null>(null);
  // TODO check if we need this separate state in future - we currently don't use it
  const [connectWithWallet, setConnectWithWallet] = useState<boolean>(false);

  const openWalletInstallationLink = (url: string): void => {
    window.open(url, '_blank');
  };

  const count = 59589588;

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
                  <img src={wallet.icon} alt={`${wallet.name}-icon`} />
                  <span>{wallet.name}</span>
                </styled.MethodItem>
              ))}
            </styled.Methods>
          </styled.SignInMethodsContainer>

          {!selectedWallet && !connectWithWallet && (
            <styled.ExtraInfoPoints>
              <div className="row">
                <ButtonRound variant="primary" isLabel={true} icon="visible" />
                <span>{t('login.permissionInfo')}</span>
              </div>
              <div className="row">
                <ButtonRound variant="primary" isLabel={true} icon="locked" />
                <span>{t('login.auditInfo')}</span>
              </div>
              <div className="row">
                <ButtonRound variant="primary" isLabel={true} icon="star_favorite" />
                <span>{t('login.trustInfo', {count})}</span>
              </div>
            </styled.ExtraInfoPoints>
          )}

          {selectedWallet && (
            <>
              <styled.ConnectWithWalletRow>
                <img src={selectedWallet.icon} alt={`${selectedWallet.name}-icon`} />
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

export default observer(SignIn);
