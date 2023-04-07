import {FC, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {FrameText, Button, ButtonRound} from '@momentum-xyz/ui-kit-storybook';
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
  const [connectWithWallet, setConnectWithWallet] = useState<boolean>(false);

  const openWalletInstallationLink = (url: string): void => {
    window.open(url, '_blank');
  };

  const connectWithWalletRow = selectedWallet && (
    <styled.ConnectWithWalletRow>
      <img src={selectedWallet.icon} alt={`${selectedWallet.name}-icon`} />
      <span>{t('login.connectWith', {wallet: selectedWallet.name})}</span>
    </styled.ConnectWithWalletRow>
  );

  return (
    <styled.Container>
      <FrameText
        title={t('login.howToConnectAsAMemberTitle')}
        line1={t('login.howToConnectAsAMemberDescription')}
      />
      <styled.SignInMethodsContainer>
        <span className="title">{t('login.installWalletOrConnect')}</span>
        <div className="methods">
          {availableWallets.map((wallet) => {
            const {name, icon} = wallet;
            return (
              <styled.SignInMethodContainer
                key={name}
                onClick={() => {
                  setSelectedWallet(wallet);
                  setConnectWithWallet(false);
                }}
              >
                <img src={icon} alt={`${name}-icon`} />
                <span>{name}</span>
              </styled.SignInMethodContainer>
            );
          })}
        </div>
      </styled.SignInMethodsContainer>
      {!selectedWallet && !connectWithWallet && (
        <styled.ExtraInfoPoints>
          <div className="row">
            <ButtonRound variant="primary" isLabel={true} icon="visible" />
            <span>View only permissions, we will never do anything without your appoval</span>
          </div>
          <div className="row">
            <ButtonRound variant="primary" isLabel={true} icon="locked" />
            <span>Audited Smart contracts</span>
          </div>
          <div className="row">
            <ButtonRound variant="primary" isLabel={true} icon="star_favorite" />
            <span>Trusted by 59589588 customers</span>
          </div>
        </styled.ExtraInfoPoints>
      )}
      {selectedWallet && (
        <>
          {connectWithWalletRow}
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
    </styled.Container>
  );
};

export default observer(SignIn);
